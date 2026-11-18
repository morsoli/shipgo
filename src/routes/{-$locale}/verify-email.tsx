import { createFileRoute } from "@tanstack/react-router"
import { MailCheck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { authClient } from "@/shared/lib/auth/auth-client"

export const Route = createFileRoute("/{-$locale}/verify-email")({
  component: VerifyEmailPage,
  head: () => ({ meta: [{ title: "Verify email | ShipGo" }] }),
})

function VerifyEmailPage() {
  const session = authClient.useSession()
  const [pending, setPending] = useState(false)
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
        <MailCheck className="mx-auto size-12 text-primary" />
        <h1 className="mt-5 text-2xl font-semibold">Verify your email</h1>
        <p className="mt-3 text-muted-foreground">
          Check your inbox and follow the verification link before opening protected pages.
        </p>
        <Button
          className="mt-6"
          disabled={pending || !session.data?.user.email}
          onClick={async () => {
            const email = session.data?.user.email
            if (!email) return
            setPending(true)
            const result = await authClient.sendVerificationEmail({
              email,
              callbackURL: "/dashboard",
            })
            setPending(false)
            if (result.error) toast.error(result.error.message)
            else toast.success("Verification email sent")
          }}
        >
          {pending ? "Sending..." : "Resend verification email"}
        </Button>
      </section>
    </main>
  )
}
