import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { ThemeProvider } from "tanstack-theme-kit"
import { validateServerEnvironmentFn } from "@/config/server-env"
import { siteConfig } from "@/config/site-config"
import appCss from "@/config/style/global.css?url"
import { localeFromPath, localizedLinks } from "@/core/seo/localized-links"
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools"
import { ErrorToaster } from "@/shared/components/error-toaster"
import { ServiceScripts } from "@/shared/components/service-scripts"
import { Toaster } from "@/shared/components/ui/sonner"
import { getIsAuthEnabled } from "@/shared/lib/auth/auth-config"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    await validateServerEnvironmentFn()
    return { isAuthEnabled: await getIsAuthEnabled() }
  },
  head: ({ matches }) => {
    const pathname = matches[matches.length - 1]?.pathname ?? "/"
    const baseUrl = import.meta.env.VITE_APP_URL ?? ""
    const links = localizedLinks(baseUrl, pathname)

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: `${siteConfig.title} -${siteConfig.titleSuffix}`,
        },
        {
          name: "description",
          content: siteConfig.description,
        },
        ...(siteConfig.robots?.meta ? [{ name: "robots", content: siteConfig.robots.meta }] : []),
        ...(siteConfig.keywords?.length
          ? [
              {
                name: "keywords",
                content: siteConfig.keywords.join(", "),
              },
            ]
          : []),
        // Open Graph
        {
          property: "og:title",
          content: siteConfig.title,
        },
        {
          property: "og:description",
          content: siteConfig.description,
        },
        {
          property: "og:image",
          content: `${import.meta.env.VITE_APP_URL}${siteConfig.images.ogImage}`,
        },
        ...(baseUrl ? [{ property: "og:url", content: links.canonical }] : []),
        {
          property: "og:type",
          content: "website",
        },
        // Twitter Card
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: siteConfig.title,
        },
        {
          name: "twitter:description",
          content: siteConfig.description,
        },
        {
          name: "twitter:image",
          content: `${import.meta.env.VITE_APP_URL}${siteConfig.images.ogImage}`,
        },
        ...(baseUrl ? [{ name: "twitter:url", content: links.canonical }] : []),
      ],
      links: [
        ...(baseUrl ? [{ rel: "canonical", href: links.canonical }] : []),
        ...(baseUrl
          ? [
              ...links.alternates.map((alternate) => ({
                rel: "alternate",
                hrefLang: alternate.hrefLang,
                href: alternate.href,
              })),
              { rel: "alternate", hrefLang: "x-default", href: links.default },
            ]
          : []),
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
        {
          rel: "icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/image.png",
        },
      ],
    }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const locale = localeFromPath(pathname)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
        {import.meta.env.VITE_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${import.meta.env.VITE_GA_MEASUREMENT_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.theme.defaultTheme}
          enableSystem
        >
          <NuqsAdapter>
            <Toaster />
            <ErrorToaster />
            {children}
          </NuqsAdapter>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ThemeProvider>
        <Scripts />
        <ServiceScripts />
      </body>
    </html>
  )
}
