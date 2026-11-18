import { createFileRoute } from "@tanstack/react-router"
import { getNewsletterStatus } from "@/services/newsletter.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/newsletter/status")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      GET: async ({ context }) => {
        try {
          return Resp.success({
            subscribed: await getNewsletterStatus(context.session.user.email),
          })
        } catch (error) {
          console.error("[newsletter/status] Failed", error)
          return Resp.error("Unable to load newsletter status", 500)
        }
      },
    },
  },
})
