import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import { PricingCards } from "@/shared/components/landing/pricing/pricing-cards"
import { Button } from "@/shared/components/ui/button"
import { useGlobalContext } from "@/shared/context/global.context"
import { http } from "@/shared/lib/tools/http-client"

export const Route = createFileRoute("/{-$locale}/_main/settings/billing")({
  component: BillingSettings,
})

function BillingSettings() {
  const { userInfo } = useGlobalContext()
  const plan = userInfo?.payment?.activePlan

  const openPortal = useMutation({
    mutationFn: async () => {
      const result = await http<{ url: string }>("/api/payment/portal", {
        method: "POST",
        body: { returnUrl: window.location.href },
      })
      return result.url
    },
    onSuccess: (url) => {
      window.location.href = url
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <section className="space-y-8">
      <div className="space-y-4 rounded-xl border p-6">
        <div>
          <h2 className="text-xl font-semibold">Billing</h2>
          <p className="text-sm text-muted-foreground">Manage your plan and payment method.</p>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-lg font-semibold capitalize">{plan?.name ?? plan?.id ?? "Free"}</p>
          </div>
          {plan && !plan.id.includes("free") && (
            <Button
              variant="outline"
              disabled={openPortal.isPending}
              onClick={() => openPortal.mutate()}
            >
              {openPortal.isPending ? "Opening..." : "Manage billing"}
            </Button>
          )}
        </div>
      </div>
      <PricingCards variant="compact" />
    </section>
  )
}
