import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { assertCheckoutUrlOrigin, createCustomerPortal } from "@/services/payment.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

const schema = z.object({ returnUrl: z.string().url() })

export const Route = createFileRoute("/api/payment/portal")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      POST: async ({ context, request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Resp.error("Invalid portal request", 400)
        try {
          assertCheckoutUrlOrigin({
            successUrl: parsed.data.returnUrl,
            cancelUrl: parsed.data.returnUrl,
          })
          return Resp.success(
            await createCustomerPortal(context.session.user.id, parsed.data.returnUrl)
          )
        } catch (error) {
          console.error("[payment/portal] Failed", error)
          return Resp.error(error instanceof Error ? error.message : "Portal failed", 500)
        }
      },
    },
  },
})
