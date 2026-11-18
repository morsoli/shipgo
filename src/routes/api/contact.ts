import { createFileRoute } from "@tanstack/react-router"
import { contactSchema, submitContact } from "@/services/contact.service"
import { Resp } from "@/shared/lib/tools/response"

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = contactSchema.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Resp.error("Invalid contact request", 400)
        try {
          await submitContact(parsed.data)
          return Resp.success({ sent: true })
        } catch (error) {
          console.error("[contact] Failed", error)
          return Resp.error("Unable to send message", 500)
        }
      },
    },
  },
})
