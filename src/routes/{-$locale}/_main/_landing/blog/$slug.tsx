import browserCollections from "fumadocs-mdx:collections/browser"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Image } from "@unpic/react"
import { useFumadocsLoader } from "fumadocs-core/source/client"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Suspense } from "react"
import {
  type BlogFrontmatter,
  blogSource,
  getAuthor,
  getBlogPosts,
  getCategory,
  mapToBlogPost,
} from "@/config/content/blog-source"
import blogCss from "@/config/style/blog.css?url"
import { hasPremiumAccess } from "@/services/premium.service"
import { getBlogMDXComponents } from "@/shared/components/blog/custom-mdx-content"
import { ContentActions } from "@/shared/components/content-actions"
import { LocalizedLink, type To } from "@/shared/components/locale/localized-link"
import { PremiumGate } from "@/shared/components/premium-gate"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"
import { sessionMiddleware } from "@/shared/middleware/auth.middleware"
import type { BlogCategory, BlogPost } from "@/shared/types/blog"

type BlogLoaderData = {
  path: string
  title: string
  description?: string
  image?: string
  date: string
  author: { id: string; name: string }
  categories: BlogCategory[]
  tags: string[]
  allowed: boolean
  related: BlogPost[]
}

const serverLoader = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .inputValidator((params: { slug: string; lang?: string }) => params)
  .handler(async ({ data: { slug, lang }, context }): Promise<BlogLoaderData> => {
    const page = blogSource.getPage([slug], lang)
    if (!page) throw notFound()

    const frontmatter = page.data as BlogFrontmatter
    const author = getAuthor(frontmatter.author, lang)
    const categoriesData = frontmatter.categories
      .map((catSlug: string) => getCategory(catSlug, lang))
      .filter((c): c is BlogCategory => c !== null)
    const allowed =
      !frontmatter.premium ||
      Boolean(context.session?.user.id && (await hasPremiumAccess(context.session.user.id)))

    return {
      path: page.path,
      title: frontmatter.title,
      description: frontmatter.description,
      image: frontmatter.image,
      date: frontmatter.date.toISOString(),
      author: author ?? { id: frontmatter.author, name: frontmatter.author },
      categories: categoriesData,
      tags: frontmatter.tags,
      allowed,
      related: getBlogPosts(lang)
        .filter((candidate) => candidate.slugs.join("/") !== slug)
        .filter((candidate) =>
          (candidate.data as BlogFrontmatter).categories.some((category) =>
            frontmatter.categories.includes(category)
          )
        )
        .slice(0, 3)
        .map(mapToBlogPost),
    }
  })

export const Route = createFileRoute("/{-$locale}/_main/_landing/blog/$slug")({
  component: BlogPostPage,
  loader: async ({ params }) => {
    const data = await serverLoader({
      data: {
        slug: params.slug,
        lang: params.locale,
      },
    })
    if (data.allowed) await clientLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} | ShipGo` : "Blog | ShipGo" },
      ...(loaderData?.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
      { property: "og:type", content: "article" },
      ...(loaderData?.image ? [{ property: "og:image", content: loaderData.image }] : []),
    ],
    links: [{ rel: "stylesheet", href: blogCss }],
  }),
})

const clientLoader = browserCollections.blog.createClientLoader({
  component({ default: MDX }) {
    return (
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDX components={getBlogMDXComponents()} />
      </article>
    )
  },
})

function BlogPostPage() {
  const data = useFumadocsLoader(Route.useLoaderData())
  const locale = Route.useParams().locale

  return (
    <div className="container mx-auto px-4 py-6">
      <LocalizedLink
        to="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </LocalizedLink>

      <article className="max-w-3xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: data.title,
              description: data.description,
              datePublished: data.date,
              author: { "@type": "Person", name: data.author.name },
            }),
          }}
        />
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {data.categories.map((category: BlogCategory) => (
              <Badge
                key={category.id}
                variant="secondary"
              >
                {category.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>

          {data.description && (
            <p className="text-xl text-muted-foreground mb-6">{data.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <span>{data.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <time dateTime={data.date}>
                {new Date(data.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          {data.image && (
            <div className="aspect-video relative overflow-hidden rounded-xl bg-muted mb-8">
              <Image
                src={data.image}
                alt={data.title}
                layout="fullWidth"
                className="object-cover"
              />
            </div>
          )}
        </header>
        {data.allowed && (
          <ContentActions
            type="blog"
            slug={data.path.replace(/^blog\//, "")}
            locale={locale}
          />
        )}

        {data.allowed ? <BlogPostContent path={data.path} /> : <PremiumGate />}

        {data.tags.length > 0 && (
          <footer className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              {data.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </footer>
        )}
        {data.related.length > 0 && (
          <aside className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold">Related articles</h2>
            <div className="mt-4 grid gap-3">
              {data.related.map((post) => (
                <LocalizedLink
                  key={post.slug}
                  to={`/blog/${post.slug}` as To}
                  className="rounded-lg border p-4 hover:bg-muted/40"
                >
                  <span className="font-medium">{post.title}</span>
                </LocalizedLink>
              ))}
            </div>
          </aside>
        )}
      </article>
    </div>
  )
}

function BlogPostContent({ path }: { path: string }) {
  return <Suspense fallback={<BlogPostSkeleton />}>{clientLoader.useContent(path)}</Suspense>
}

function BlogPostSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className={cn("h-4 bg-muted rounded w-3/4")} />
      <div className={cn("h-4 bg-muted rounded w-full")} />
      <div className={cn("h-4 bg-muted rounded w-5/6")} />
      <div className={cn("h-4 bg-muted rounded w-2/3")} />
    </div>
  )
}
