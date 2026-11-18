import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { businessConfig } from "@/config/business-config"
import { createCheckout } from "@/services/payment.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

const schema = z.object({
  packageId: z.string().min(1),
  metadata: z.record(z.string(), z.string()).optional(),
})

export const Route = createFileRoute("/api/payment/credit-checkout")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      POST: async ({ context, request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Resp.error("Invalid credit checkout request", 400)
        const creditPackage = businessConfig.creditPackages.find(
          (item) => item.id === parsed.data.packageId
        )
        if (!creditPackage?.priceId) return Resp.error("Credit package is not configured", 404)
        try {
          const origin = new URL(request.url).origin
          const result = await createCheckout({
            user: context.session.user,
            priceId: creditPackage.priceId,
            successUrl: `${origin}/payment?session_id={CHECKOUT_SESSION_ID}&callback=/settings/credits`,
            cancelUrl: `${origin}/settings/credits`,
            metadata: {
              ...parsed.data.metadata,
              packageId: creditPackage.id,
              orderKind: "credit_pack",
            },
          })
          return Resp.success({ checkoutUrl: result.url, sessionId: result.id })
        } catch (error) {
          console.error("[payment/credit-checkout] Failed", error)
          return Resp.error(error instanceof Error ? error.message : "Checkout failed", 500)
        }
      },
    },
  },
})
