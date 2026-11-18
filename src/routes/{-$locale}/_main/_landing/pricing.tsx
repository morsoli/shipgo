import { createFileRoute } from "@tanstack/react-router"
import { Pricing } from "@/shared/components/landing/pricing"

export const Route = createFileRoute("/{-$locale}/_main/_landing/pricing")({
  component: PricingPage,
  head: () => ({ meta: [{ title: "Pricing | ShipGo" }] }),
})

function PricingPage() {
  return <Pricing />
}
