import { z } from "zod"
import { businessConfig, findPlanByPriceId } from "@/config/business-config"
import { CreditEntryTypes } from "@/core/credits/types"
import type {
  CheckoutResult,
  NormalizedPaymentEvent,
  PaymentProviderName,
} from "@/core/payment/types"
import { getPaymentProvider } from "@/providers/payment"
import { addCredits } from "@/repositories/credit.repository"
import {
  findBillingOrderBySessionId,
  findCurrentBillingOrder,
  upsertBillingOrderByInvoice,
} from "@/repositories/payment.repository"
import { findUserByCustomerId, setUserCustomerId } from "@/repositories/user.repository"
import { sendNotification } from "@/services/notification.service"

const httpUrl = z
  .string()
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), {
    message: "URL must use HTTP or HTTPS",
  })

export const checkoutSchema = z.object({
  priceId: z.string().min(1),
  successUrl: httpUrl,
  cancelUrl: httpUrl,
  metadata: z.record(z.string(), z.string()).optional(),
})

export function assertCheckoutUrlOrigin(urls: { successUrl: string; cancelUrl: string }) {
  const appOrigin = new URL(
    process.env.APP_URL || import.meta.env.VITE_APP_URL || "http://localhost:3000"
  ).origin
  if (
    new URL(urls.successUrl).origin !== appOrigin ||
    new URL(urls.cancelUrl).origin !== appOrigin
  ) {
    throw new Error("Checkout redirect URLs must use the application origin")
  }
}

function productByPriceId(priceId: string) {
  const plan = findPlanByPriceId(priceId)
  if (plan) {
    const price = plan.prices.find((item) => item.priceId === priceId)!
    return {
      orderKind: plan.isLifetime ? ("lifetime_plan" as const) : ("subscription_plan" as const),
      billingMode: price.billingMode,
      billingInterval: "interval" in price ? price.interval : undefined,
      credits: plan.credits,
    }
  }
  const creditPackage = businessConfig.creditPackages.find((item) => item.priceId === priceId)
  if (creditPackage) {
    return {
      orderKind: "credit_pack" as const,
      billingMode: "one_time" as const,
      credits: {
        enabled: true,
        amount: creditPackage.amount,
        expireDays: creditPackage.expireDays,
      },
    }
  }
  return null
}

export async function createCheckout(input: {
  user: { id: string; email: string; name?: string | null }
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}): Promise<CheckoutResult> {
  assertCheckoutUrlOrigin(input)
  const product = productByPriceId(input.priceId)
  if (!product) throw new Error("Unknown or disabled price")
  return getPaymentProvider().createCheckout({
    userId: input.user.id,
    customerEmail: input.user.email,
    priceId: input.priceId,
    orderKind: product.orderKind,
    successUrl: input.successUrl,
    cancelUrl: input.cancelUrl,
    metadata: { ...input.metadata, userName: input.user.name ?? "" },
  })
}

export async function createCustomerPortal(userId: string, returnUrl: string) {
  const current = await findCurrentBillingOrder(userId)
  if (!current) throw new Error("No billing customer found")
  return getPaymentProvider().createPortal(current.customerId, returnUrl)
}

export async function getPaymentCompletion(userId: string, checkoutSessionId: string) {
  const record = await findBillingOrderBySessionId(userId, checkoutSessionId)
  const settled = Boolean(record?.settled)
  return { paid: settled, settled, status: record?.status ?? null }
}

async function grantWebhookCredits(event: NormalizedPaymentEvent, billingOrderId: string) {
  const product = productByPriceId(event.priceId)
  if (!product?.credits?.enabled || !event.settled) return

  const shouldGrant =
    (product.orderKind === "credit_pack" &&
      ["checkout.completed", "checkout.session.completed"].includes(event.eventType)) ||
    (product.orderKind === "lifetime_plan" &&
      ["checkout.completed", "checkout.session.completed"].includes(event.eventType)) ||
    (product.orderKind === "subscription_plan" &&
      (event.eventType === "invoice.paid" || event.eventType === "subscription.paid"))
  if (!shouldGrant || !event.userId) return

  const expiresAt = product.credits.expireDays
    ? new Date(Date.now() + product.credits.expireDays * 24 * 60 * 60 * 1000)
    : undefined
  await addCredits({
    userId: event.userId,
    amount: product.credits.amount,
    entryType:
      product.orderKind === "credit_pack"
        ? CreditEntryTypes.CreditPackPurchase
        : product.orderKind === "lifetime_plan"
          ? CreditEntryTypes.LifetimeMonthlyGrant
          : CreditEntryTypes.SubscriptionCycleGrant,
    summary: `${product.orderKind} payment credits`,
    billingOrderId,
    expiresAt,
  })
}

export async function processPaymentWebhook(
  providerName: PaymentProviderName,
  payload: string,
  signature: string
) {
  const event = await getPaymentProvider(providerName).parseWebhook(payload, signature)
  if (!event) return { handled: false, duplicate: false }

  const resolvedUser = event.userId ?? (await findUserByCustomerId(event.customerId))?.id
  if (!resolvedUser) throw new Error("Unable to resolve webhook user")
  event.userId = resolvedUser
  await setUserCustomerId(resolvedUser, event.customerId)

  const product = productByPriceId(event.priceId)
  if (!product) throw new Error("Webhook references an unknown price")
  event.orderKind = product.orderKind
  event.billingMode = product.billingMode
  event.billingInterval = product.billingInterval

  const result = await upsertBillingOrderByInvoice({
    provider: providerName,
    externalInvoiceId: event.externalInvoiceId,
    priceId: event.priceId,
    billingMode: event.billingMode,
    orderKind: event.orderKind,
    billingInterval: event.billingInterval,
    userId: resolvedUser,
    customerId: event.customerId,
    subscriptionId: event.subscriptionId,
    checkoutSessionId: event.checkoutSessionId,
    status: event.status,
    settled: event.settled,
  })
  if (result.created) await grantWebhookCredits(event, result.id)
  if (result.created) {
    void sendNotification({
      title: "Payment event processed",
      description: `${providerName}: ${event.eventType}`,
      fields: {
        userId: resolvedUser,
        status: event.status,
        settled: event.settled,
        orderKind: event.orderKind,
      },
    })
  }
  return { handled: true, duplicate: !result.created }
}
