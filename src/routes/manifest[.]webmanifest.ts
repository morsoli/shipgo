import { createFileRoute } from "@tanstack/react-router"
import { siteConfig } from "@/config/site-config"

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          {
            name: siteConfig.title,
            short_name: siteConfig.title,
            description: siteConfig.description,
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#111827",
            icons: [
              {
                src: "/image.png",
                sizes: "512x512",
                type: "image/png",
              },
            ],
          },
          {
            headers: {
              "Cache-Control": "public, max-age=3600, s-maxage=86400",
              "Content-Type": "application/manifest+json; charset=utf-8",
            },
          }
        ),
    },
  },
})
