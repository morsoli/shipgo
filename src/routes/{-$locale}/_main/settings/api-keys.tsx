import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Copy, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { authClient } from "@/shared/lib/auth/auth-client"

export const Route = createFileRoute("/{-$locale}/_main/settings/api-keys")({
  component: ApiKeySettings,
})

function ApiKeySettings() {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const keys = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const result = await authClient.apiKey.list()
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
  })
  const createKey = useMutation({
    mutationFn: async () => {
      const result = await authClient.apiKey.create({ name: name.trim() })
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: async (data) => {
      setNewKey(data?.key ?? null)
      setName("")
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] })
    },
    onError: (error) => toast.error(error.message),
  })
  const deleteKey = useMutation({
    mutationFn: async (keyId: string) => {
      const result = await authClient.apiKey.delete({ keyId })
      if (result.error) throw new Error(result.error.message)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] }),
    onError: (error) => toast.error(error.message),
  })

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          New keys are shown once. Store them securely.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Key name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button
          disabled={!name.trim() || createKey.isPending}
          onClick={() => createKey.mutate()}
        >
          Create
        </Button>
      </div>
      {newKey && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
          <p className="mb-2 text-sm font-medium">Copy this key now</p>
          <div className="flex gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto rounded bg-muted p-2 text-xs">
              {newKey}
            </code>
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(newKey)}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="divide-y rounded-lg border">
        {(keys.data ?? []).map((key) => (
          <div
            key={key.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{key.name ?? "Unnamed key"}</p>
              <p className="text-xs text-muted-foreground">{key.start ?? key.prefix ?? "Hidden"}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              disabled={deleteKey.isPending}
              onClick={() => deleteKey.mutate(key.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {!keys.isLoading && (keys.data?.length ?? 0) === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No API keys.</p>
        )}
      </div>
    </section>
  )
}
