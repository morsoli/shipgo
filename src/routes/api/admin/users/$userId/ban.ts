import { createFileRoute } from "@tanstack/react-router"
import { banUserSchema, setUserBan } from "@/services/admin-user.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAdminMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/admin/users/$userId/ban")({
  server: {
    middleware: [apiAdminMiddleware],
    handlers: {
      POST: async ({ params, request }) => {
        const parsed = banUserSchema.safeParse(await request.json().catch(() => ({})))
        if (!parsed.success) return Resp.error("Invalid ban request", 400)

        try {
          const record = await setUserBan(params.userId, parsed.data)
          return record ? Resp.success(record) : Resp.error("User not found", 404)
        } catch (error) {
          if (error instanceof Error && error.message.includes("read-only")) {
            return Resp.error(error.message, 403)
          }
          console.error("[admin/users] Failed to ban user", error)
          return Resp.error("Failed to ban user", 500)
        }
      },
      DELETE: async ({ params }) => {
        try {
          const record = await setUserBan(params.userId, null)
          return record ? Resp.success(record) : Resp.error("User not found", 404)
        } catch (error) {
          if (error instanceof Error && error.message.includes("read-only")) {
            return Resp.error(error.message, 403)
          }
          console.error("[admin/users] Failed to unban user", error)
          return Resp.error("Failed to unban user", 500)
        }
      },
    },
  },
})
