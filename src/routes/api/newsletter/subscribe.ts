import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { subscribeNewsletter } from "@/services/newsletter.service"
import { Resp } from "@/shared/lib/tools/response"

const schema = z.object({ email: z.string().trim().email().max(320) })

export const Route = createFileRoute("/api/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Resp.error("Invalid email", 400)
        try {
          await subscribeNewsletter(parsed.data.email)
          return Resp.success({ subscribed: true })
        } catch (error) {
          console.error("[newsletter/subscribe] Failed", error)
          return Resp.error("Unable to subscribe", 500)
        }
      },
    },
  },
})
