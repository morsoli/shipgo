import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/_main/_landing/blog/category/$slug")({
  beforeLoad: ({ params }) => {
    const prefix = params.locale ? `/${params.locale}` : ""
    throw redirect({
      href: `${prefix}/blog?cat=${encodeURIComponent(params.slug)}`,
      replace: true,
    })
  },
})
