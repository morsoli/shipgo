import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { authClient } from "@/shared/lib/auth/auth-client"

export const Route = createFileRoute("/{-$locale}/_main/settings/profile")({
  component: ProfileSettings,
})

function ProfileSettings() {
  const session = authClient.useSession()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    setName(session.data?.user.name ?? "")
    setImage(session.data?.user.image ?? "")
  }, [session.data?.user])

  const save = useMutation({
    mutationFn: async () => {
      const result = await authClient.updateUser({ name: name.trim(), image: image.trim() || null })
      if (result.error) throw new Error(result.error.message)
    },
    onSuccess: () => toast.success("Profile updated"),
    onError: (error) => toast.error(error.message),
  })

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.set("file", file)
      form.set("folder", "avatars")
      const response = await fetch("/api/file/upload", { method: "POST", body: form })
      const payload = (await response.json()) as { data?: { url?: string }; message?: string }
      if (!response.ok || !payload.data?.url) throw new Error(payload.message ?? "Upload failed")
      return payload.data.url
    },
    onSuccess: setImage,
    onError: (error) => toast.error(error.message),
  })

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">Update your display name and avatar.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          value={name}
          maxLength={100}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-image">Avatar URL</Label>
        <Input
          id="profile-image"
          value={image}
          onChange={(event) => setImage(event.target.value)}
        />
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={upload.isPending}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) upload.mutate(file)
          }}
        />
      </div>
      <Button
        disabled={save.isPending || !name.trim()}
        onClick={() => save.mutate()}
      >
        {save.isPending ? "Saving..." : "Save profile"}
      </Button>
    </section>
  )
}
