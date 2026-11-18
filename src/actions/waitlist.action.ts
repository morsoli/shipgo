import { createServerFn } from "@tanstack/react-start"
import { getTranslationContent, type Locale } from "intlayer"
import { waitlistEmailTranslations } from "@/config/locale/waitlist.content"
import { newsletterEmailSchema, subscribeNewsletter } from "@/services/newsletter.service"
import { isEmailEnabled, sendEmail } from "@/shared/lib/email/send-email"

export const joinWaitlistFn = createServerFn({ method: "GET" })
  .inputValidator((params: { email: string; locale?: string }) => params)
  .handler(async ({ data: { email, locale = "en" } }) => {
    newsletterEmailSchema.parse(email)
    await subscribeNewsletter(email)
    if (isEmailEnabled) {
      const subject = getTranslationContent(waitlistEmailTranslations.subject, locale as Locale)

      await sendEmail({
        to: email,
        subject,
        type: "waitlist",
        locale,
      })
    }

    return { success: true, duplicate: false }
  })
