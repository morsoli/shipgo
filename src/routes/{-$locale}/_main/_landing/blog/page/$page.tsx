import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/_main/_landing/blog/page/$page")({
  beforeLoad: ({ params }) => {
    const prefix = params.locale ? `/${params.locale}` : ""
    throw redirect({
      href: `${prefix}/blog?page=${encodeURIComponent(params.page)}`,
      replace: true,
    })
  },
})
