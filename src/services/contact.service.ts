import { z } from "zod"
import { sendEmail } from "@/shared/lib/email/send-email"

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["en", "zh"]).default("en"),
})

export async function submitContact(input: z.infer<typeof contactSchema>) {
  const data = contactSchema.parse(input)
  const recipient = process.env.CONTACT_EMAIL
  if (!recipient) throw new Error("Contact email is not configured")
  await sendEmail({
    to: recipient,
    subject: `ShipGo contact from ${data.name}`,
    type: "contact",
    locale: data.locale,
    replyTo: data.email,
    content: data.message,
    name: data.name,
  })
}
