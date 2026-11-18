import { createFileRoute } from "@tanstack/react-router"
import { adminUserQuerySchema, getAdminUsers } from "@/services/admin-user.service"
import { Resp } from "@/shared/lib/tools/response"
import { apiAdminMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/admin/users/")({
  server: {
    middleware: [apiAdminMiddleware],
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const parsed = adminUserQuerySchema.safeParse(Object.fromEntries(url.searchParams))
        if (!parsed.success) {
          return Resp.error("Invalid user query", 400)
        }

        try {
          return Resp.success(await getAdminUsers(parsed.data))
        } catch (error) {
          console.error("[admin/users] Failed to list users", error)
          return Resp.error("Failed to list users", 500)
        }
      },
    },
  },
})
