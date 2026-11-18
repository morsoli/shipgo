import { createFileRoute } from "@tanstack/react-router"
import { WebhookSignatureError } from "@/core/payment/types"
import { isPaymentProviderEnabled } from "@/providers/payment"
import { processPaymentWebhook } from "@/services/payment.service"

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isPaymentProviderEnabled("stripe")) {
          return Response.json({ error: "Stripe payment provider is not enabled" }, { status: 400 })
        }
        const payload = await request.text()
        const signature = request.headers.get("stripe-signature") ?? ""
        if (!payload || !signature)
          return Response.json({ error: "Missing payload or signature" }, { status: 400 })
        try {
          const result = await processPaymentWebhook("stripe", payload, signature)
          return Response.json({ received: true, ...result })
        } catch (error) {
          console.error("[webhook/stripe] Failed", error)
          return Response.json(
            { error: error instanceof Error ? error.message : "Webhook failed" },
            { status: error instanceof WebhookSignatureError ? 400 : 500 }
          )
        }
      },
    },
  },
})
