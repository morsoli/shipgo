import fs from "node:fs/promises"
import path from "node:path"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { blogSource } from "@/config/content/blog-source"
import { source } from "@/config/content/source"
import { hasPremiumAccess } from "@/services/premium.service"
import { sessionMiddleware } from "@/shared/middleware/auth.middleware"

const schema = z.object({
  type: z.enum(["docs", "blog"]),
  slug: z
    .string()
    .regex(/^[a-z0-9][a-z0-9/-]*$/)
    .max(300),
  locale: z.enum(["en", "zh"]).default("en"),
})

export const Route = createFileRoute("/api/content/markdown")({
  server: {
    middleware: [sessionMiddleware],
    handlers: {
      GET: async ({ context, request }) => {
        const parsed = schema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
        if (!parsed.success)
          return Response.json({ error: "Invalid content request" }, { status: 400 })
        const suffix = parsed.data.locale === "zh" ? ".zh.mdx" : ".mdx"
        const base = path.resolve(process.cwd(), "content", parsed.data.type)
        const contentSource = parsed.data.type === "docs" ? source : blogSource
        const page = contentSource.getPage(parsed.data.slug.split("/"), parsed.data.locale)
        if (!page) return Response.json({ error: "Content not found" }, { status: 404 })
        if (
          Boolean(page.data.premium) &&
          !(context.session?.user.id && (await hasPremiumAccess(context.session.user.id)))
        ) {
          return Response.json({ error: "Premium access required" }, { status: 403 })
        }
        const file = path.resolve(base, `${parsed.data.slug}${suffix}`)
        if (!file.startsWith(`${base}${path.sep}`)) {
          return Response.json({ error: "Invalid content path" }, { status: 400 })
        }
        try {
          const markdown = await fs.readFile(file, "utf8")
          return new Response(markdown, {
            headers: { "Content-Type": "text/markdown; charset=utf-8" },
          })
        } catch {
          return Response.json({ error: "Content not found" }, { status: 404 })
        }
      },
    },
  },
})
