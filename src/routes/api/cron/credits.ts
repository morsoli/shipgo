import { createFileRoute } from "@tanstack/react-router"
import { runCreditMaintenance } from "@/services/credit-distribution.service"

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET
  return Boolean(secret && request.headers.get("authorization") === `Basic ${secret}`)
}

export const Route = createFileRoute("/api/cron/credits")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 })
        try {
          return Response.json({ success: true, data: await runCreditMaintenance() })
        } catch (error) {
          console.error("[cron/credits] Failed", error)
          return Response.json({ error: "Credit maintenance failed" }, { status: 500 })
        }
      },
    },
  },
})
