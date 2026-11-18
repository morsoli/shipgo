import { createFileRoute, useSearch } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getBlogPosts, getCategories, mapToBlogPost } from "@/config/content/blog-source"
import BlogGrid from "@/shared/components/blog/blog-grid"
import EmptyBlog from "@/shared/components/blog/empty"
import { LocalizedLink, type To } from "@/shared/components/locale/localized-link"
import { cn } from "@/shared/lib/utils"

export const Route = createFileRoute("/{-$locale}/_main/_landing/blog/")({
  component: BlogListPage,
  validateSearch: (search: Record<string, unknown>) => ({
    cat: typeof search.cat === "string" ? search.cat : undefined,
    page: Math.max(1, Number(search.page) || 1),
  }),
  head: () => ({
    meta: [
      { title: "Blog - ShipGo" },
      { name: "description", content: "Latest news, tutorials and updates from ShipGo" },
    ],
  }),
  loader: async ({ params }) => {
    return await getBlogListData({ data: { lang: params.locale } })
  },
})

const getBlogListData = createServerFn({ method: "GET" })
  .inputValidator((params: { lang?: string }) => params)
  .handler(async ({ data: { lang } }) => {
    const posts = getBlogPosts(lang).map(mapToBlogPost)
    const categories = getCategories(lang)
    return { posts, categories }
  })

function BlogListPage() {
  const { posts, categories } = Route.useLoaderData()
  const { cat, page } = useSearch({ from: "/{-$locale}/_main/_landing/blog/" })

  const allCategories = [{ id: "all", name: "All", slug: "", description: "" }, ...categories]

  const filteredPosts = cat ? posts.filter((post) => post.categories.includes(cat)) : posts
  const pageSize = 9
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visiblePosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <main
      tabIndex={-1}
      className="relative z-1 outline-none mb-10"
    >
      <div className={cn("mx-auto w-full max-w-7xl", "px-6 lg:px-8", "pt-6 md:pt-10")}>
        <h2 className={cn("text-6xl leading-tight font-medium", "sm:text-4xl sm:leading-10")}>
          Blog
        </h2>

        <nav className="mt-6">
          <ul className="flex items-center gap-6 flex-wrap">
            {allCategories.map((category) => {
              const isActive = (cat || "") === category.slug || (category.id === "all" && !cat)
              const href = category.slug ? `/blog?cat=${category.slug}` : "/blog"

              return (
                <li
                  key={category.id}
                  className="text-lg"
                >
                  <LocalizedLink
                    to={href as To}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      isActive
                        ? "text-foreground"
                        : cn("text-muted-foreground hover:text-foreground")
                    )}
                  >
                    {category.name}
                  </LocalizedLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className={cn("mt-12", "px-6 lg:px-8")}>
        {visiblePosts.length === 0 ? (
          <EmptyBlog />
        ) : (
          <BlogGrid
            posts={visiblePosts}
            categories={categories}
          />
        )}
        {totalPages > 1 && (
          <nav
            className="mx-auto mt-10 flex max-w-7xl justify-center gap-2"
            aria-label="Blog pagination"
          >
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <LocalizedLink
                key={number}
                to={`/blog?page=${number}${cat ? `&cat=${cat}` : ""}` as To}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm",
                  number === currentPage && "bg-primary text-primary-foreground"
                )}
              >
                {number}
              </LocalizedLink>
            ))}
          </nav>
        )}
      </div>
    </main>
  )
}
