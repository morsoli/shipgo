import Stripe from "stripe"
import {
  type BillingOrderKind,
  type CheckoutInput,
  type NormalizedPaymentEvent,
  type PaymentProvider,
  type PaymentStatus,
  WebhookSignatureError,
} from "@/core/payment/types"

function metadata(input?: Stripe.Metadata | null): Record<string, string> {
  return Object.fromEntries(
    Object.entries(input ?? {}).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    )
  )
}

function orderKindFromMetadata(value: Record<string, string>): BillingOrderKind {
  if (value.orderKind === "credit_pack" || value.type === "credit_purchase") return "credit_pack"
  if (value.orderKind === "lifetime_plan") return "lifetime_plan"
  return "subscription_plan"
}

function status(value: string): PaymentStatus {
  const allowed: PaymentStatus[] = [
    "active",
    "canceled",
    "incomplete",
    "incomplete_expired",
    "past_due",
    "paused",
    "trialing",
    "unpaid",
    "completed",
    "processing",
    "failed",
  ]
  return allowed.includes(value as PaymentStatus) ? (value as PaymentStatus) : "processing"
}

export class StripePaymentProvider implements PaymentProvider {
  readonly name = "stripe" as const
  private readonly stripe: Stripe
  private readonly webhookSecret: string

  constructor(
    secretKey = process.env.STRIPE_SECRET_KEY,
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  ) {
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured")
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
    this.stripe = new Stripe(secretKey)
    this.webhookSecret = webhookSecret
  }

  async createCheckout(input: CheckoutInput) {
    const mode = input.orderKind === "subscription_plan" ? "subscription" : "payment"
    const customMetadata = {
      ...input.metadata,
      userId: input.userId,
      priceId: input.priceId,
      orderKind: input.orderKind,
    }
    const session = await this.stripe.checkout.sessions.create({
      mode,
      customer_email: input.customerEmail,
      line_items: [{ price: input.priceId, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: customMetadata,
      ...(mode === "subscription"
        ? { subscription_data: { metadata: customMetadata } }
        : {
            payment_intent_data: { metadata: customMetadata },
            invoice_creation: { enabled: true },
          }),
    })
    if (!session.url) throw new Error("Stripe did not return a checkout URL")
    return { id: session.id, url: session.url }
  }

  async createPortal(customerId: string, returnUrl: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return { url: session.url }
  }

  async parseWebhook(payload: string, signature: string): Promise<NormalizedPaymentEvent | null> {
    let event: Stripe.Event
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret)
    } catch {
      throw new WebhookSignatureError("Invalid Stripe webhook signature")
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const meta = metadata(session.metadata)
      const priceId = meta.priceId
      const userId = meta.userId
      const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id
      if (!priceId || !customerId)
        throw new Error("Stripe checkout event is missing required metadata")
      return {
        provider: "stripe",
        eventId: event.id,
        eventType: event.type,
        externalInvoiceId:
          typeof session.invoice === "string" ? session.invoice : (session.invoice?.id ?? event.id),
        priceId,
        billingMode: session.mode === "subscription" ? "subscription" : "one_time",
        orderKind: orderKindFromMetadata(meta),
        userId,
        customerId,
        subscriptionId:
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id,
        checkoutSessionId: session.id,
        status:
          session.payment_status === "paid"
            ? session.mode === "subscription"
              ? "active"
              : "completed"
            : "processing",
        settled:
          session.payment_status === "paid" || session.payment_status === "no_payment_required",
        metadata: meta,
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object
      const meta = metadata(subscription.metadata)
      const item = subscription.items.data[0]
      if (!item?.price.id) throw new Error("Stripe subscription event is missing a price")
      return {
        provider: "stripe",
        eventId: event.id,
        eventType: event.type,
        externalInvoiceId: event.id,
        priceId: item.price.id,
        billingMode: "subscription",
        orderKind: orderKindFromMetadata(meta),
        userId: meta.userId,
        customerId:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
        subscriptionId: subscription.id,
        status: status(subscription.status),
        settled: ["active", "trialing"].includes(subscription.status),
        metadata: meta,
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object
      const subscription = invoice.parent?.subscription_details?.subscription
      const line = invoice.lines.data[0]
      const meta = metadata(invoice.parent?.subscription_details?.metadata)
      const rawPrice = line?.pricing?.price_details?.price
      const priceId = typeof rawPrice === "string" ? rawPrice : rawPrice?.id
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id
      if (!priceId || !customerId)
        throw new Error("Stripe invoice event is missing required fields")
      return {
        provider: "stripe",
        eventId: event.id,
        eventType: event.type,
        externalInvoiceId: invoice.id,
        priceId,
        billingMode: "subscription",
        orderKind: orderKindFromMetadata(meta),
        userId: meta.userId,
        customerId,
        subscriptionId: typeof subscription === "string" ? subscription : subscription?.id,
        status: "active",
        settled: true,
        metadata: meta,
      }
    }

    return null
  }
}
