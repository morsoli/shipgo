import { LockKeyhole } from "lucide-react"
import { LocalizedLink } from "@/shared/components/locale/localized-link"
import { Button } from "@/shared/components/ui/button"

export function PremiumGate() {
  return (
    <section className="mx-auto my-12 max-w-xl rounded-xl border bg-card p-8 text-center">
      <LockKeyhole className="mx-auto size-10 text-primary" />
      <h2 className="mt-4 text-2xl font-semibold">Premium content</h2>
      <p className="mt-2 text-muted-foreground">Upgrade to a paid plan to read this guide.</p>
      <Button
        asChild
        className="mt-5"
      >
        <LocalizedLink to="/pricing">View plans</LocalizedLink>
      </Button>
    </section>
  )
}
