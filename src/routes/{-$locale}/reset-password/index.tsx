import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { authClient } from "@/shared/lib/auth/auth-client"

export const Route = createFileRoute("/{-$locale}/reset-password/")({
  component: ResetPasswordPage,
  ssr: false,
})

function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pending, setPending] = useState(false)

  const submit = async () => {
    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }
    const token = new URLSearchParams(window.location.search).get("token") ?? undefined
    setPending(true)
    const result = await authClient.resetPassword({ newPassword: password, token })
    setPending(false)
    if (result.error) toast.error(result.error.message)
    else {
      toast.success("Password reset")
      window.location.href = "../login"
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Choose a new password</h1>
        <p className="text-sm text-muted-foreground">Use at least eight characters.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          id="confirm-password"
          type="password"
          minLength={8}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
      </div>
      <Button
        disabled={pending || password.length < 8 || confirm.length < 8}
        onClick={() => void submit()}
      >
        {pending ? "Resetting..." : "Reset password"}
      </Button>
    </main>
  )
}
