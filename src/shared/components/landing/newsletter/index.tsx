import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { http } from "@/shared/lib/tools/http-client"

export function NewsletterSignup() {
  const [pending, setPending] = useState(false)
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold">Product news without the noise</h2>
        <p className="mt-3 text-muted-foreground">
          Get release notes, practical guides, and important service updates.
        </p>
        <form
          className="mx-auto mt-6 flex max-w-lg gap-2"
          onSubmit={async (event) => {
            event.preventDefault()
            setPending(true)
            const form = new FormData(event.currentTarget)
            try {
              await http("/api/newsletter/subscribe", {
                method: "POST",
                body: { email: form.get("email") },
              })
              event.currentTarget.reset()
              toast.success("Subscribed")
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Unable to subscribe")
            } finally {
              setPending(false)
            }
          }}
        >
          <Input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
          />
          <Button
            type="submit"
            disabled={pending}
          >
            {pending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  )
}
