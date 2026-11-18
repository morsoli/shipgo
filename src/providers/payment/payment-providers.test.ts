import { createHmac } from "node:crypto"
import Stripe from "stripe"
import { describe, expect, it } from "vitest"
import { WebhookSignatureError } from "@/core/payment/types"
import { CreemPaymentProvider } from "./creem.provider"
import { isPaymentProviderEnabled } from "./index"
import { StripePaymentProvider } from "./stripe.provider"

describe("payment provider event mapping", () => {
  it("enables only the configured payment provider", () => {
    const original = process.env.PAYMENT_PROVIDER
    process.env.PAYMENT_PROVIDER = "creem"
    expect(isPaymentProviderEnabled("creem")).toBe(true)
    expect(isPaymentProviderEnabled("stripe")).toBe(false)
    if (original === undefined) delete process.env.PAYMENT_PROVIDER
    else process.env.PAYMENT_PROVIDER = original
  })

  it("maps a signed Stripe checkout event", async () => {
    const secret = "whsec_test"
    const payload = JSON.stringify({
      id: "evt_checkout",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          object: "checkout.session",
          customer: "cus_test",
          invoice: "in_test",
          mode: "payment",
          payment_status: "paid",
          subscription: null,
          metadata: { userId: "user-test", priceId: "price-test", orderKind: "credit_pack" },
        },
      },
    })
    const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret })
    const provider = new StripePaymentProvider("sk_test_value", secret)

    await expect(provider.parseWebhook(payload, signature)).resolves.toMatchObject({
      provider: "stripe",
      eventType: "checkout.session.completed",
      externalInvoiceId: "in_test",
      userId: "user-test",
      priceId: "price-test",
      orderKind: "credit_pack",
      status: "completed",
      settled: true,
    })
  })

  it("maps signed Creem subscription events and rejects invalid signatures", async () => {
    const secret = "creem-test-secret"
    const payload = JSON.stringify({
      id: "evt_creem",
      eventType: "subscription.past_due",
      object: {
        id: "sub_test",
        customer_id: "cus_test",
        product_id: "price_test",
        metadata: { userId: "user-test", orderKind: "subscription_plan" },
      },
    })
    const signature = createHmac("sha256", secret).update(payload).digest("hex")
    const provider = new CreemPaymentProvider(secret, "creem-api-key")

    await expect(provider.parseWebhook(payload, signature)).resolves.toMatchObject({
      provider: "creem",
      eventType: "subscription.past_due",
      userId: "user-test",
      orderKind: "subscription_plan",
      status: "past_due",
      settled: false,
    })
    await expect(provider.parseWebhook(payload, "00")).rejects.toBeInstanceOf(WebhookSignatureError)
  })
})
