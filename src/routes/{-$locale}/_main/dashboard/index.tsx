import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CreditActivityChart } from "@/shared/components/user-dashboard/credit-activity-chart"
import { CreditHistoryPanel } from "@/shared/components/user-dashboard/credit-history-panel"
import { useGlobalContext } from "@/shared/context/global.context"

export const Route = createFileRoute("/{-$locale}/_main/dashboard/")({
  component: DashboardPage,
})

function DashboardPage() {
  const { userInfo, credits } = useGlobalContext()
  const plan = userInfo?.payment?.activePlan?.name ?? userInfo?.payment?.activePlan?.id ?? "Free"
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="text-3xl font-semibold">
            Welcome back, {userInfo?.user?.name ?? "there"}
          </h1>
        </div>
        <Button asChild>
          <a href="./settings/billing">Manage plan</a>
        </Button>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold capitalize">{plan}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Credit balance</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{credits?.userCredits ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account status</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {userInfo?.user ? "Active" : "Loading"}
          </CardContent>
        </Card>
      </section>
      <CreditActivityChart />
      <section className="rounded-xl border p-6">
        <CreditHistoryPanel />
      </section>
    </div>
  )
}
