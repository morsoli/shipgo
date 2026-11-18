import { createFileRoute } from "@tanstack/react-router"
import { getAdminUser } from "@/services/admin-user.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAdminMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/admin/users/$userId")({
  server: {
    middleware: [apiAdminMiddleware],
    handlers: {
      GET: async ({ params }) => {
        try {
          const record = await getAdminUser(params.userId)
          return record ? Resp.success(record) : Resp.error("User not found", 404)
        } catch (error) {
          console.error("[admin/users] Failed to get user", error)
          return Resp.error("Failed to get user", 500)
        }
      },
    },
  },
})
