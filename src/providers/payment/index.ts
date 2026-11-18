import type { PaymentProvider, PaymentProviderName } from "@/core/payment/types"
import { CreemPaymentProvider } from "./creem.provider"
import { StripePaymentProvider } from "./stripe.provider"

export function isPaymentProviderEnabled(name: PaymentProviderName) {
  return name === (process.env.PAYMENT_PROVIDER === "creem" ? "creem" : "stripe")
}

export function getPaymentProvider(
  name: PaymentProviderName = process.env.PAYMENT_PROVIDER === "creem" ? "creem" : "stripe"
): PaymentProvider {
  return name === "creem" ? new CreemPaymentProvider() : new StripePaymentProvider()
}
