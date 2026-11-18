import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"
import { PageShell } from "@/shared/components/page-shell"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { http } from "@/shared/lib/tools/http-client"

export const Route = createFileRoute("/{-$locale}/_main/_landing/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact | ShipGo" }] }),
})

function ContactPage() {
  const { locale } = Route.useParams()
  const zh = locale === "zh"
  const [pending, setPending] = useState(false)

  return (
    <PageShell
      eyebrow={zh ? "联系" : "Contact"}
      title={zh ? "告诉我们你的问题" : "Tell us how we can help"}
      description={
        zh ? "我们通常会在两个工作日内回复。" : "We usually reply within two business days."
      }
    >
      <form
        className="mx-auto max-w-2xl space-y-5 rounded-xl border bg-card p-6"
        onSubmit={async (event) => {
          event.preventDefault()
          setPending(true)
          const form = new FormData(event.currentTarget)
          try {
            await http("/api/contact", {
              method: "POST",
              body: {
                name: form.get("name"),
                email: form.get("email"),
                message: form.get("message"),
                locale: zh ? "zh" : "en",
              },
            })
            event.currentTarget.reset()
            toast.success(zh ? "消息已发送" : "Message sent")
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to send message")
          } finally {
            setPending(false)
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="contact-name">{zh ? "姓名" : "Name"}</Label>
          <Input
            id="contact-name"
            name="name"
            required
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">{zh ? "邮箱" : "Email"}</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message">{zh ? "消息" : "Message"}</Label>
          <Textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            rows={8}
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
        >
          {pending ? (zh ? "发送中..." : "Sending...") : zh ? "发送消息" : "Send message"}
        </Button>
      </form>
    </PageShell>
  )
}
