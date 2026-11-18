import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { http } from "@/shared/lib/tools/http-client"

export const Route = createFileRoute("/{-$locale}/_main/settings/notifications")({
  component: NotificationSettings,
})

function NotificationSettings() {
  const status = useQuery({
    queryKey: ["newsletter-status"],
    queryFn: () => http<{ subscribed: boolean }>("/api/newsletter/status", { requireAuth: true }),
  })
  const subscribed = status.data?.subscribed

  const update = useMutation({
    mutationFn: async () => {
      if (subscribed) {
        await http("/api/newsletter/unsubscribe", { method: "POST" })
        return false
      } else {
        const session = await import("@/shared/lib/auth/auth-client").then(({ authClient }) =>
          authClient.getSession()
        )
        if (!session.data?.user.email) throw new Error("Unable to load account email")
        await http("/api/newsletter/subscribe", {
          method: "POST",
          body: { email: session.data.user.email },
        })
        return true
      }
    },
    onSuccess: () => {
      void status.refetch()
      toast.success("Notification preferences updated")
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground">Manage product news and release updates.</p>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 p-4">
        <div>
          <p className="font-medium">Newsletter</p>
          <p className="text-sm text-muted-foreground">
            {status.isLoading ? "Checking status..." : subscribed ? "Subscribed" : "Not subscribed"}
          </p>
        </div>
        <Button
          variant="outline"
          disabled={update.isPending || status.isLoading}
          onClick={() => update.mutate()}
        >
          {update.isPending ? "Updating..." : subscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </div>
    </section>
  )
}
