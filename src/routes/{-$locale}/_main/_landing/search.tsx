import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { PageShell } from "@/shared/components/page-shell"
import { Input } from "@/shared/components/ui/input"
import { http } from "@/shared/lib/tools/http-client"

type SearchResult = { id: string; type: string; content: string; url: string }

export const Route = createFileRoute("/{-$locale}/_main/_landing/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
})

function SearchPage() {
  const { locale } = Route.useParams()
  const { q } = Route.useSearch()
  const { data = [], isLoading } = useQuery({
    queryKey: ["content-search", q, locale],
    queryFn: () =>
      http<SearchResult[]>(
        `/api/search?query=${encodeURIComponent(q)}&locale=${locale === "zh" ? "zh" : "en"}`
      ),
    enabled: q.length > 0,
  })
  return (
    <PageShell
      title={locale === "zh" ? "搜索内容" : "Search content"}
      description={
        locale === "zh"
          ? "搜索文档和博客，最多返回 20 条结果。"
          : "Search documentation and blog posts, with up to 20 results."
      }
    >
      <form className="mx-auto max-w-3xl">
        <Input
          name="q"
          defaultValue={q}
          placeholder={locale === "zh" ? "搜索..." : "Search..."}
        />
      </form>
      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        {isLoading && <p className="text-muted-foreground">Searching...</p>}
        {data.map((item) => (
          <a
            key={item.url}
            href={locale === "zh" ? `/zh${item.url}` : item.url}
            className="block rounded-xl border p-5 hover:bg-muted/40"
          >
            <h2 className="text-lg font-semibold">{item.content}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.url}</p>
          </a>
        ))}
      </div>
    </PageShell>
  )
}
