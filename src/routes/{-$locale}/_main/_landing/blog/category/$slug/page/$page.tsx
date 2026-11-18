import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/_main/_landing/blog/category/$slug/page/$page")({
  beforeLoad: ({ params }) => {
    const prefix = params.locale ? `/${params.locale}` : ""
    const category = encodeURIComponent(params.slug)
    const page = encodeURIComponent(params.page)
    throw redirect({
      href: `${prefix}/blog?cat=${category}&page=${page}`,
      replace: true,
    })
  },
})
