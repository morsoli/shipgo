import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { getPaymentCompletion } from "@/services/payment.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/payment/status")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      GET: async ({ context, request }) => {
        const sessionId = new URL(request.url).searchParams.get("sessionId")
        const parsed = z.string().min(1).safeParse(sessionId)
        if (!parsed.success) return Resp.error("Invalid session ID", 400)
        try {
          return Resp.success(await getPaymentCompletion(context.session.user.id, parsed.data))
        } catch (error) {
          console.error("[payment/status] Failed", error)
          return Resp.error("Failed to check payment status", 500)
        }
      },
    },
  },
})
