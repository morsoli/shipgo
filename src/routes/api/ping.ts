import { createFileRoute } from "@tanstack/react-router"
import { sql } from "drizzle-orm"
import { getDb } from "@/db"

export const Route = createFileRoute("/api/ping")({
  server: {
    handlers: {
      GET: async () => {
        const db = getDb()
        if (!db) {
          return Response.json(
            { ok: false, service: "shipgo", database: "not_configured" },
            { status: 503 }
          )
        }
        try {
          await db.execute(sql`select 1`)
          return Response.json({
            ok: true,
            service: "shipgo",
            database: "connected",
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          console.error("[ping] Database health check failed", error)
          return Response.json(
            { ok: false, service: "shipgo", database: "unavailable" },
            { status: 503 }
          )
        }
      },
    },
  },
})
