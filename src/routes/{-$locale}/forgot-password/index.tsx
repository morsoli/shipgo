import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { authClient } from "@/shared/lib/auth/auth-client"

export const Route = createFileRoute("/{-$locale}/forgot-password/")({
  component: ForgotPasswordPage,
  ssr: false,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async () => {
    setPending(true)
    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setPending(false)
    if (result.error) toast.error(result.error.message)
    else setSent(true)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send a reset link.
        </p>
      </div>
      {sent ? (
        <p className="rounded-lg border p-4 text-sm">
          If an account exists for that email, a reset link has been sent.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button
            disabled={pending || !email}
            onClick={() => void submit()}
          >
            {pending ? "Sending..." : "Send reset link"}
          </Button>
        </>
      )}
      <a
        href="../login"
        className="text-sm text-primary underline underline-offset-4"
      >
        Back to sign in
      </a>
    </main>
  )
}
