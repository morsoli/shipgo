import { useLocation } from "@tanstack/react-router"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"

export function ContentActions({
  type,
  slug: suppliedSlug,
  locale,
}: {
  type: "docs" | "blog"
  slug?: string
  locale?: string
}) {
  const [pending, setPending] = useState(false)
  const location = useLocation()
  const marker = `/${type}/`
  const pathSlug = location.pathname.includes(marker)
    ? location.pathname.split(marker)[1]?.replace(/^zh\//, "") || "index"
    : "index"
  const slug = suppliedSlug || pathSlug
  const load = async () => {
    const query = new URLSearchParams({ type, slug, locale: locale === "zh" ? "zh" : "en" })
    const response = await fetch(`/api/content/markdown?${query}`)
    if (!response.ok) throw new Error("Unable to load Markdown")
    return response.text()
  }
  const openWith = async (provider: "chatgpt" | "claude") => {
    setPending(true)
    try {
      const markdown = await load()
      const base = provider === "chatgpt" ? "https://chatgpt.com/?q=" : "https://claude.ai/new?q="
      window.open(`${base}${encodeURIComponent(markdown.slice(0, 12000))}`, "_blank", "noopener")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          try {
            await navigator.clipboard.writeText(await load())
          } finally {
            setPending(false)
          }
        }}
      >
        <Copy className="size-4" /> Copy Markdown
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => void openWith("chatgpt")}
      >
        <ExternalLink className="size-4" /> ChatGPT
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => void openWith("claude")}
      >
        <ExternalLink className="size-4" /> Claude
      </Button>
    </div>
  )
}
