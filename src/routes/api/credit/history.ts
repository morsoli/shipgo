import { createFileRoute } from "@tanstack/react-router"
import { creditHistoryQuerySchema, getCreditHistory } from "@/services/credit-history.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAuthMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/credit/history")({
  server: {
    middleware: [apiAuthMiddleware],
    handlers: {
      GET: async ({ context, request }) => {
        try {
          const userId = context.session?.user.id

          if (!userId) {
            return Resp.error("Unauthorized", 401)
          }

          const parsed = creditHistoryQuerySchema.safeParse(
            Object.fromEntries(new URL(request.url).searchParams)
          )
          if (!parsed.success) return Resp.error("Invalid query", 400, "VALIDATION_FAILED")
          const history = await getCreditHistory(userId, parsed.data)

          return Resp.success(history)
        } catch (error) {
          console.error("Failed to fetch credit history:", error)
          return Resp.error("Failed to fetch credit history")
        }
      },
    },
  },
})
