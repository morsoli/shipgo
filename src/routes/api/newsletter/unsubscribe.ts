import { createFileRoute } from "@tanstack/react-router"
import { unsubscribeNewsletter } from "@/services/newsletter.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/newsletter/unsubscribe")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      POST: async ({ context }) => {
        try {
          await unsubscribeNewsletter(context.session.user.email)
          return Resp.success({ subscribed: false })
        } catch (error) {
          console.error("[newsletter/unsubscribe] Failed", error)
          return Resp.error("Unable to unsubscribe", 500)
        }
      },
    },
  },
})
