import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/register/")({
  beforeLoad: ({ params }) => {
    const prefix = params.locale ? `/${params.locale}` : ""
    throw redirect({
      href: `${prefix}/login?mode=signup`,
      replace: true,
    })
  },
})
