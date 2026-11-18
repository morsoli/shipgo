export const billingModes = ["subscription", "one_time"] as const
export type BillingMode = (typeof billingModes)[number]

export const billingOrderKinds = ["subscription_plan", "lifetime_plan", "credit_pack"] as const
export type BillingOrderKind = (typeof billingOrderKinds)[number]

export const planIntervals = ["month", "year"] as const
export type PlanInterval = (typeof planIntervals)[number]

export const paymentStatuses = [
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
] as const
export type PaymentStatus = (typeof paymentStatuses)[number]

export interface CheckoutInput {
  userId: string
  customerEmail: string
  priceId: string
  orderKind: BillingOrderKind
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export type PaymentProviderName = "stripe" | "creem"

export type NormalizedPaymentEvent = {
  provider: PaymentProviderName
  eventId: string
  eventType: string
  externalInvoiceId: string
  priceId: string
  billingMode: BillingMode
  orderKind: BillingOrderKind
  billingInterval?: PlanInterval
  userId?: string
  customerId: string
  subscriptionId?: string
  checkoutSessionId?: string
  status: PaymentStatus
  settled: boolean
  metadata: Record<string, string>
}

export interface CheckoutResult {
  id: string
  url: string
}

export interface PaymentProvider {
  readonly name: PaymentProviderName
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>
  createPortal(customerId: string, returnUrl: string): Promise<{ url: string }>
  parseWebhook(payload: string, signature: string): Promise<NormalizedPaymentEvent | null>
}

export class WebhookSignatureError extends Error {
  override name = "WebhookSignatureError"
}
