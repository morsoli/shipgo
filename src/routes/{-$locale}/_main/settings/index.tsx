import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/_main/settings/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/{-$locale}/settings/profile",
      params: { locale: params.locale },
    })
  },
})
