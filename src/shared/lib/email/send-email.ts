import React from "react"

export type EmailType =
  | "magic-link"
  | "verification"
  | "reset-password"
  | "waitlist"
  | "newsletter-welcome"
  | "contact"

export interface EmailData {
  to: string
  url?: string
  locale?: string
  subject: string
  type?: EmailType
  replyTo?: string
  content?: string
  name?: string
}

interface EmailSendData extends EmailData {
  from: string
}

export interface EmailStrategy {
  sendEmail(data: EmailSendData, emailHtml: string): Promise<void>
}

export class ResendEmailStrategy implements EmailStrategy {
  private resendInstance: unknown
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmail(data: EmailSendData, emailHtml: string): Promise<void> {
    if (!this.resendInstance) {
      const { Resend } = await import("resend")
      this.resendInstance = new Resend(this.apiKey)
    }
    const resend = this.resendInstance as {
      emails: { send: (opts: Record<string, string>) => Promise<unknown> }
    }
    await resend.emails.send({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: emailHtml,
      ...(data.replyTo ? { reply_to: data.replyTo } : {}),
    })
  }
}

async function renderEmailTemplate(data: EmailData): Promise<string> {
  const { render } = await import("@react-email/components")
  const type = data.type || "magic-link"

  if (type === "verification") {
    const { VerificationEmail } = await import("@/shared/components/email/verification-email")
    return render(
      React.createElement(VerificationEmail, {
        verificationLink: data.url || "",
        locale: data.locale || "en",
      })
    )
  }

  if (type === "reset-password") {
    const { ResetPasswordEmail } = await import("@/shared/components/email/reset-password-email")
    return render(
      React.createElement(ResetPasswordEmail, {
        resetLink: data.url || "",
        locale: data.locale || "en",
      })
    )
  }

  if (type === "waitlist") {
    const { WaitlistEmail } = await import("@/shared/components/email/waitlist-email")
    return render(
      React.createElement(WaitlistEmail, {
        locale: data.locale || "en",
      })
    )
  }

  if (type === "newsletter-welcome") {
    const { NewsletterWelcomeEmail } = await import(
      "@/shared/components/email/newsletter-welcome-email"
    )
    return render(React.createElement(NewsletterWelcomeEmail, { locale: data.locale || "en" }))
  }

  if (type === "contact") {
    const { ContactEmail } = await import("@/shared/components/email/contact-email")
    return render(
      React.createElement(ContactEmail, {
        name: data.name || "",
        email: data.replyTo || "",
        message: data.content || "",
        locale: data.locale || "en",
      })
    )
  }

  const { MagicLinkEmail } = await import("@/shared/components/email/magic-link-email")
  return render(
    React.createElement(MagicLinkEmail, {
      magicLink: data.url || "",
      locale: data.locale || "en",
    })
  )
}

export class EmailContext {
  private strategy: EmailStrategy

  constructor(strategy: EmailStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: EmailStrategy): void {
    this.strategy = strategy
  }

  async sendEmail(data: EmailData): Promise<void> {
    const from = process.env.EMAIL_FROM
    if (!from) {
      throw new Error("EMAIL_FROM environment variable is not set")
    }

    const emailHtml = await renderEmailTemplate(data)
    await this.strategy.sendEmail({ ...data, from }, emailHtml)
  }
}

export const isEmailEnabled =
  !!process.env.EMAIL_FROM &&
  process.env.EMAIL_PROVIDER === "resend" &&
  !!process.env.RESEND_API_KEY

export function createEmailContext(): EmailContext {
  if (!process.env.EMAIL_PROVIDER) {
    throw new Error("Email is not configured. Please set EMAIL_PROVIDER environment variable.")
  }

  let strategy: EmailStrategy

  if (process.env.EMAIL_PROVIDER === "resend") {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is required when using Resend email provider")
    }
    strategy = new ResendEmailStrategy(process.env.RESEND_API_KEY)
  } else {
    throw new Error(`Unsupported email provider: ${process.env.EMAIL_PROVIDER}. Supported: resend`)
  }

  return new EmailContext(strategy)
}

export const sendEmail = async (data: EmailData): Promise<void> => {
  const emailContext = createEmailContext()
  await emailContext.sendEmail(data)
}
