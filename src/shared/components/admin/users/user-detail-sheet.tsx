import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Ban, UserCheck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { http } from "@/shared/lib/tools/http-client"
import type { AdminUserDetail } from "@/shared/types/admin"

type UserDetailSheetProps = {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

export function UserDetailSheet({ userId, open, onOpenChange, onUpdate }: UserDetailSheetProps) {
  const queryClient = useQueryClient()
  const [reason, setReason] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: () => http<AdminUserDetail>(`/api/admin/users/${userId}`),
    enabled: Boolean(userId && open),
  })

  const banMutation = useMutation({
    mutationFn: async (ban: boolean) =>
      http<AdminUserDetail>(`/api/admin/users/${userId}/ban`, {
        method: ban ? "POST" : "DELETE",
        body: ban
          ? JSON.stringify({
              reason: reason || undefined,
              expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
            })
          : undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "user", userId] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      onUpdate?.()
      toast.success("User status updated")
    },
  })

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>User details</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading user...</p>
        ) : user ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  {user.banned && <Badge variant="destructive">Banned</Badge>}
                </div>
              </div>
            </div>

            <dl className="grid gap-3 rounded-lg border p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(user.createdAt).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Ban reason</dt>
                <dd className="text-right">{user.banReason ?? "-"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Ban expires</dt>
                <dd>{user.banExpires ? new Date(user.banExpires).toLocaleString() : "-"}</dd>
              </div>
            </dl>

            {!user.banned && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="ban-reason">Ban reason</Label>
                  <Input
                    id="ban-reason"
                    value={reason}
                    maxLength={500}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ban-expires">Expires at</Label>
                  <Input
                    id="ban-expires"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(event) => setExpiresAt(event.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full"
              variant={user.banned ? "outline" : "destructive"}
              disabled={banMutation.isPending}
              onClick={() => banMutation.mutate(!user.banned)}
            >
              {user.banned ? <UserCheck className="size-4" /> : <Ban className="size-4" />}
              {user.banned ? "Unban user" : "Ban user"}
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">User not found.</p>
        )}
      </SheetContent>
    </Sheet>
  )
}
