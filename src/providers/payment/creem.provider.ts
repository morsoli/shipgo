import { createHmac, timingSafeEqual } from "node:crypto"
import { Creem } from "creem"
import {
  type BillingOrderKind,
  type CheckoutInput,
  type NormalizedPaymentEvent,
  type PaymentProvider,
  type PaymentStatus,
  WebhookSignatureError,
} from "@/core/payment/types"
import { createShipGoId } from "@/shared/lib/id"

type CreemWebhook = {
  id?: string
  eventType?: string
  object?: Record<string, unknown>
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function string(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function metadata(value: unknown): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record(value)).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    )
  )
}

function orderKindFromMetadata(meta: Record<string, string>): BillingOrderKind {
  if (meta.orderKind === "credit_pack" || meta.type === "credit_purchase") return "credit_pack"
  if (meta.orderKind === "lifetime_plan") return "lifetime_plan"
  return "subscription_plan"
}

function status(eventType: string): PaymentStatus {
  return {
    "checkout.completed": "completed",
    "subscription.paid": "active",
    "subscription.active": "active",
    "subscription.update": "active",
    "subscription.canceled": "canceled",
    "subscription.scheduled_cancel": "active",
    "subscription.expired": "canceled",
    "subscription.past_due": "past_due",
    "subscription.trialing": "trialing",
    "subscription.paused": "paused",
  }[eventType] as PaymentStatus
}

export class CreemPaymentProvider implements PaymentProvider {
  readonly name = "creem" as const
  private readonly client: Creem

  constructor(
    private readonly webhookSecret = process.env.CREEM_WEBHOOK_SECRET,
    apiKey = process.env.CREEM_API_KEY
  ) {
    if (!apiKey) throw new Error("CREEM_API_KEY is not configured")
    if (!webhookSecret) throw new Error("CREEM_WEBHOOK_SECRET is not configured")
    this.client = new Creem({ apiKey, serverIdx: process.env.CREEM_DEBUG === "true" ? 1 : 0 })
  }

  async createCheckout(input: CheckoutInput) {
    const checkout = await this.client.checkouts.create({
      productId: input.priceId,
      successUrl: input.successUrl.replace("{CHECKOUT_SESSION_ID}", "{CHECKOUT_ID}"),
      requestId: createShipGoId("req"),
      customer: { email: input.customerEmail },
      metadata: {
        ...input.metadata,
        userId: input.userId,
        priceId: input.priceId,
        orderKind: input.orderKind,
      },
    })
    if (!checkout.checkoutUrl) throw new Error("Creem did not return a checkout URL")
    return { id: checkout.id, url: checkout.checkoutUrl }
  }

  async createPortal(customerId: string) {
    const result = await this.client.customers.generateBillingLinks({ customerId })
    return { url: result.customerPortalLink }
  }

  async parseWebhook(payload: string, signature: string): Promise<NormalizedPaymentEvent | null> {
    const expected = createHmac("sha256", this.webhookSecret!).update(payload).digest()
    const supplied = Buffer.from(signature, "hex")
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      throw new WebhookSignatureError("Invalid Creem webhook signature")
    }

    const event = JSON.parse(payload) as CreemWebhook
    const eventType = event.eventType
    const object = record(event.object)
    if (!eventType || !event.id) throw new Error("Invalid Creem webhook payload")
    if (!eventType.startsWith("subscription.") && eventType !== "checkout.completed") return null

    const meta = metadata(object.metadata)
    const product = record(object.product)
    const customer = record(object.customer)
    const subscription = record(object.subscription)
    const priceId = string(product.id) ?? string(object.product_id) ?? meta.priceId
    const customerId = string(customer.id) ?? string(object.customer_id)
    if (!priceId || !customerId) throw new Error("Creem event is missing required fields")

    const eventStatus = status(eventType)
    return {
      provider: "creem",
      eventId: event.id,
      eventType,
      externalInvoiceId: string(object.order) ?? string(object.id) ?? event.id,
      priceId,
      billingMode:
        eventType.startsWith("subscription.") || Object.keys(subscription).length > 0
          ? "subscription"
          : "one_time",
      orderKind: orderKindFromMetadata(meta),
      userId: meta.userId,
      customerId,
      subscriptionId:
        string(subscription.id) ??
        (eventType.startsWith("subscription.") ? string(object.id) : undefined),
      checkoutSessionId: eventType === "checkout.completed" ? string(object.id) : undefined,
      status: eventStatus,
      settled: ["completed", "active", "trialing"].includes(eventStatus),
      metadata: meta,
    }
  }
}
