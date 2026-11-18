import { createFileRoute } from "@tanstack/react-router"
import { checkoutSchema, createCheckout } from "@/services/payment.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/payment/checkout")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      POST: async ({ context, request }) => {
        const parsed = checkoutSchema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Resp.error("Invalid checkout request", 400)
        try {
          const result = await createCheckout({
            user: context.session.user,
            ...parsed.data,
          })
          return Resp.success({ checkoutUrl: result.url, sessionId: result.id })
        } catch (error) {
          console.error("[payment/checkout] Failed", error)
          return Resp.error(error instanceof Error ? error.message : "Checkout failed", 500)
        }
      },
    },
  },
})
