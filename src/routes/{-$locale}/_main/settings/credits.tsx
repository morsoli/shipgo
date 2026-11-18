import { createFileRoute } from "@tanstack/react-router"
import { CreditHistoryPanel } from "@/shared/components/user-dashboard/credit-history-panel"
import { CreditPackagesPanel } from "@/shared/components/user-dashboard/credit-packages-panel"

export const Route = createFileRoute("/{-$locale}/_main/settings/credits")({
  component: CreditSettings,
})

function CreditSettings() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl border p-6">
        <CreditPackagesPanel />
      </div>
      <div className="rounded-xl border p-6">
        <CreditHistoryPanel />
      </div>
    </section>
  )
}
