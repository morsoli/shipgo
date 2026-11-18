import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { searchContent } from "@/services/content-search.service"

const schema = z.object({
  query: z.string().trim().min(1).max(200),
  locale: z.enum(["en", "zh"]).default("en"),
})

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const parsed = schema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
        if (!parsed.success) return Response.json([])

        return Response.json(await searchContent(parsed.data.query, parsed.data.locale))
      },
    },
  },
})
