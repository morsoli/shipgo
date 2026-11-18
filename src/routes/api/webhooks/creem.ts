import { createFileRoute } from "@tanstack/react-router"
import { WebhookSignatureError } from "@/core/payment/types"
import { isPaymentProviderEnabled } from "@/providers/payment"
import { processPaymentWebhook } from "@/services/payment.service"

export const Route = createFileRoute("/api/webhooks/creem")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isPaymentProviderEnabled("creem")) {
          return Response.json({ error: "Creem payment provider is not enabled" }, { status: 400 })
        }
        const payload = await request.text()
        const signature = request.headers.get("creem-signature") ?? ""
        if (!payload || !signature)
          return Response.json({ error: "Missing payload or signature" }, { status: 400 })
        try {
          const result = await processPaymentWebhook("creem", payload, signature)
          return Response.json({ received: true, ...result })
        } catch (error) {
          console.error("[webhook/creem] Failed", error)
          return Response.json(
            { error: error instanceof Error ? error.message : "Webhook failed" },
            { status: error instanceof WebhookSignatureError ? 400 : 500 }
          )
        }
      },
    },
  },
})
