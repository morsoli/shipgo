import { createFileRoute, Outlet } from "@tanstack/react-router"
import { pageAuthMiddleware } from "@/shared/middleware/auth.middleware"

const links = [
  ["Profile", "profile"],
  ["Billing", "billing"],
  ["Credits", "credits"],
  ["Security", "security"],
  ["Notifications", "notifications"],
  ["API Keys", "api-keys"],
] as const

export const Route = createFileRoute("/{-$locale}/_main/settings")({
  component: SettingsLayout,
  ssr: false,
  server: { middleware: [pageAuthMiddleware] },
})

function SettingsLayout() {
  return (
    <main className="mx-auto min-h-dvh max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Account settings</h1>
        <p className="text-muted-foreground">Manage your ShipGo account and credentials.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-[180px_1fr]">
        <nav className="flex gap-2 md:flex-col">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={`./${href}`}
              className="rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {label}
            </a>
          ))}
        </nav>
        <Outlet />
      </div>
    </main>
  )
}
