import browserCollections from "fumadocs-mdx:collections/browser"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useFumadocsLoader } from "fumadocs-core/source/client"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { source } from "@/config/content/source"
import docsCss from "@/config/style/docs.css?url"
import { hasPremiumAccess } from "@/services/premium.service"
import { ContentActions } from "@/shared/components/content-actions"
import { getMDXComponents } from "@/shared/components/docs/mdx-components"
import { PremiumGate } from "@/shared/components/premium-gate"
import { i18n } from "@/shared/lib/i18n"
import { sessionMiddleware } from "@/shared/middleware/auth.middleware"

export function baseOptions(): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: "Documentation",
    },
  }
}

export const Route = createFileRoute("/{-$locale}/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? []
    const data = await serverLoader({
      data: {
        slugs,
        lang: params.locale,
      },
    })
    if (data.allowed) await clientLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title ? `${loaderData.title} | Documentation` : "Documentation",
      },
      { property: "og:type", content: "article" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: docsCss,
      },
    ],
  }),
})

const serverLoader = createServerFn({
  method: "GET",
})
  .middleware([sessionMiddleware])
  .inputValidator((params: { slugs: string[]; lang?: string }) => params)
  .handler(async ({ data: { slugs, lang }, context }) => {
    const page = source.getPage(slugs, lang)
    if (!page) throw notFound()
    const premium = Boolean(page.data.premium)
    const allowed =
      !premium ||
      Boolean(context.session?.user.id && (await hasPremiumAccess(context.session.user.id)))

    return {
      path: page.path,
      title: page.data.title,
      allowed,
      pageTree: await source.serializePageTree(source.getPageTree(lang)),
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <ContentActions type="docs" />
          <MDX
            components={{
              ...defaultMdxComponents,
              ...getMDXComponents(),
            }}
          />
        </DocsBody>
      </DocsPage>
    )
  },
})

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData())

  return (
    <DocsLayout
      {...baseOptions()}
      tree={data.pageTree}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: data.title,
          }),
        }}
      />
      {data.allowed ? <DocsContent path={data.path} /> : <PremiumGate />}
    </DocsLayout>
  )
}

function DocsContent({ path }: { path: string }) {
  return clientLoader.useContent(path)
}
