import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { CreditCard, Home, KeyRound, Settings, Shield } from "lucide-react"
import { LocalizedLink, type To } from "@/shared/components/locale/localized-link"
import { Button } from "@/shared/components/ui/button"
import { useGlobalContext } from "@/shared/context/global.context"
import { pageAuthMiddleware } from "@/shared/middleware/auth.middleware"

const links = [
  { label: "Overview", to: "/dashboard", icon: Home },
  { label: "Billing", to: "/settings/billing", icon: CreditCard },
  { label: "API keys", to: "/settings/api-keys", icon: KeyRound },
  { label: "Security", to: "/settings/security", icon: Shield },
  { label: "Settings", to: "/settings/profile", icon: Settings },
] as const

export const Route = createFileRoute("/{-$locale}/_main/dashboard")({
  component: DashboardLayout,
  ssr: false,
  server: { middleware: [pageAuthMiddleware] },
})

function DashboardLayout() {
  const location = useLocation()
  const { credits, userInfo } = useGlobalContext()
  return (
    <div className="min-h-dvh bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <LocalizedLink
            to="/"
            className="text-lg font-semibold"
          >
            ShipGo
          </LocalizedLink>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-muted px-3 py-1">
              {credits?.userCredits ?? 0} credits
            </span>
            <span className="hidden text-muted-foreground sm:inline">{userInfo?.user?.email}</span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]">
        <aside className="border-r p-4 md:min-h-[calc(100dvh-4rem)]">
          <nav className="space-y-1">
            {links.map(({ label, to, icon: Icon }) => (
              <LocalizedLink
                key={to}
                to={to as To}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${location.pathname.endsWith(to) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <Icon className="size-4" /> {label}
              </LocalizedLink>
            ))}
          </nav>
          <div className="mt-8 rounded-xl border bg-card p-4">
            <p className="font-medium">Need more capacity?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upgrade your plan or purchase a credit package.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 w-full"
            >
              <LocalizedLink to="/settings/billing">Upgrade</LocalizedLink>
            </Button>
          </div>
        </aside>
        <main className="min-w-0 p-6">
          <p className="mb-6 text-sm text-muted-foreground">
            Dashboard / {location.pathname.split("/").filter(Boolean).at(-1) ?? "Overview"}
          </p>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
