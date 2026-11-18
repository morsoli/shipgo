import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search, Users } from "lucide-react"
import { useState } from "react"
import { UserDetailSheet } from "@/shared/components/admin"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { http } from "@/shared/lib/tools/http-client"
import type { AdminUserListItem, PaginatedResponse } from "@/shared/types/admin"

export const Route = createFileRoute("/{-$locale}/_main/admin/users")({
  component: UsersPage,
})

function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | "banned" | "verified" | "unverified">("all")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ["admin", "users", page, search, status],
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        sortBy: "createdAt",
        sortOrder: "desc",
      })
      if (search.trim()) params.set("search", search.trim())
      if (status === "banned") params.set("banned", "true")
      if (status === "verified") params.set("emailVerified", "true")
      if (status === "unverified") params.set("emailVerified", "false")
      return http<PaginatedResponse<AdminUserListItem>>(`/api/admin/users?${params}`)
    },
  })

  const items = query.data?.items ?? []
  const pagination = query.data?.pagination

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Search users and manage account restrictions.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name or email"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <select
          className="h-9 rounded-md border bg-background px-3 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as typeof status)
            setPage(1)
          }}
        >
          <option value="all">All users</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Role</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
              <th className="px-4 py-3 text-right font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer border-t hover:bg-muted/30"
                onClick={() => setSelectedUserId(user.id)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <Badge variant={user.banned ? "destructive" : "secondary"}>
                    {user.banned ? "Banned" : user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!query.isLoading && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-muted-foreground">
            <Users className="size-8" />
            <p>No users found.</p>
          </div>
        )}
        {query.isLoading && (
          <p className="px-4 py-14 text-center text-muted-foreground">Loading...</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pagination?.total ?? 0} users</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1 || query.isFetching}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!pagination || page >= pagination.totalPages || query.isFetching}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <UserDetailSheet
        userId={selectedUserId}
        open={Boolean(selectedUserId)}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        onUpdate={() => query.refetch()}
      />
    </div>
  )
}
