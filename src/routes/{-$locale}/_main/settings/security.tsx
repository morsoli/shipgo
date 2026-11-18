import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { authClient } from "@/shared/lib/auth/auth-client"

export const Route = createFileRoute("/{-$locale}/_main/settings/security")({
  component: SecuritySettings,
})

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [deletePassword, setDeletePassword] = useState("")
  const changePassword = useMutation({
    mutationFn: async () => {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (result.error) throw new Error(result.error.message)
    },
    onSuccess: () => {
      setCurrentPassword("")
      setNewPassword("")
      toast.success("Password changed")
    },
    onError: (error) => toast.error(error.message),
  })

  const deleteAccount = useMutation({
    mutationFn: async () => {
      const result = await authClient.deleteUser({ password: deletePassword, callbackURL: "/" })
      if (result.error) throw new Error(result.error.message)
    },
    onSuccess: () => {
      window.location.href = "/"
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <section className="space-y-8">
      <div className="space-y-5 rounded-xl border p-6">
        <div>
          <h2 className="text-xl font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground">Other active sessions will be revoked.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <Button
          disabled={changePassword.isPending || !currentPassword || newPassword.length < 8}
          onClick={() => changePassword.mutate()}
        >
          Change password
        </Button>
      </div>

      <div className="space-y-5 rounded-xl border border-destructive/40 p-6">
        <div>
          <h2 className="text-xl font-semibold text-destructive">Delete account</h2>
          <p className="text-sm text-muted-foreground">
            This action permanently deletes your data.
          </p>
        </div>
        <Input
          type="password"
          placeholder="Confirm with your password"
          value={deletePassword}
          onChange={(event) => setDeletePassword(event.target.value)}
        />
        <Button
          variant="destructive"
          disabled={deleteAccount.isPending || !deletePassword}
          onClick={() => {
            if (window.confirm("Permanently delete your account?")) deleteAccount.mutate()
          }}
        >
          Delete account
        </Button>
      </div>
    </section>
  )
}
