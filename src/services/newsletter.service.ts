import { z } from "zod"

export const newsletterEmailSchema = z.string().trim().email().max(320)

export type NewsletterProviderName = "resend" | "beehiiv"

function getProvider(): NewsletterProviderName {
  return process.env.NEWSLETTER_PROVIDER === "beehiiv" ? "beehiiv" : "resend"
}

function requireConfig(name: string, value?: string): string {
  if (!value) throw new Error(`${name} is required for the newsletter provider`)
  return value
}

async function resendRequest(path: string, init: RequestInit = {}) {
  const apiKey = requireConfig("RESEND_API_KEY", process.env.RESEND_API_KEY)
  const response = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  })
  if (!response.ok && response.status !== 404) {
    throw new Error(`Resend newsletter request failed with status ${response.status}`)
  }
  return response
}

async function beehiivRequest(path: string, init: RequestInit = {}) {
  const apiKey = requireConfig("BEEHIIV_API_KEY", process.env.BEEHIIV_API_KEY)
  const response = await fetch(`https://api.beehiiv.com/v2${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  })
  if (!response.ok && response.status !== 404) {
    throw new Error(`Beehiiv newsletter request failed with status ${response.status}`)
  }
  return response
}

async function subscribeWithResend(email: string) {
  const audienceId = requireConfig("RESEND_AUDIENCE_ID", process.env.RESEND_AUDIENCE_ID)
  await resendRequest(`/audiences/${audienceId}/contacts`, {
    method: "POST",
    body: JSON.stringify({ email, unsubscribed: false }),
  })
}

async function unsubscribeWithResend(email: string) {
  const audienceId = requireConfig("RESEND_AUDIENCE_ID", process.env.RESEND_AUDIENCE_ID)
  await resendRequest(`/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`, {
    method: "DELETE",
  })
}

async function getResendStatus(email: string) {
  const audienceId = requireConfig("RESEND_AUDIENCE_ID", process.env.RESEND_AUDIENCE_ID)
  const response = await resendRequest(
    `/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`
  )
  if (response.status === 404) return false
  const payload = (await response.json()) as { unsubscribed?: boolean }
  return !payload.unsubscribed
}

async function subscribeWithBeehiiv(email: string) {
  const publicationId = requireConfig("BEEHIIV_PUBLICATION_ID", process.env.BEEHIIV_PUBLICATION_ID)
  await beehiivRequest(`/publications/${publicationId}/subscriptions`, {
    method: "POST",
    body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: false }),
  })
}

async function unsubscribeWithBeehiiv(email: string) {
  const publicationId = requireConfig("BEEHIIV_PUBLICATION_ID", process.env.BEEHIIV_PUBLICATION_ID)
  const search = await beehiivRequest(
    `/publications/${publicationId}/subscriptions?email=${encodeURIComponent(email)}`
  )
  if (search.status === 404) return
  const payload = (await search.json()) as { data?: Array<{ id: string }> }
  const id = payload.data?.[0]?.id
  if (id) {
    await beehiivRequest(`/publications/${publicationId}/subscriptions/${id}`, {
      method: "DELETE",
    })
  }
}

async function getBeehiivStatus(email: string) {
  const publicationId = requireConfig("BEEHIIV_PUBLICATION_ID", process.env.BEEHIIV_PUBLICATION_ID)
  const response = await beehiivRequest(
    `/publications/${publicationId}/subscriptions?email=${encodeURIComponent(email)}`
  )
  if (response.status === 404) return false
  const payload = (await response.json()) as { data?: Array<{ status?: string }> }
  return payload.data?.some((item) => item.status === "active") ?? false
}

export async function subscribeNewsletter(rawEmail: string) {
  const email = newsletterEmailSchema.parse(rawEmail)
  if (getProvider() === "beehiiv") return subscribeWithBeehiiv(email)
  return subscribeWithResend(email)
}

export async function unsubscribeNewsletter(rawEmail: string) {
  const email = newsletterEmailSchema.parse(rawEmail)
  if (getProvider() === "beehiiv") return unsubscribeWithBeehiiv(email)
  return unsubscribeWithResend(email)
}

export async function getNewsletterStatus(rawEmail: string) {
  const email = newsletterEmailSchema.parse(rawEmail)
  if (getProvider() === "beehiiv") return getBeehiivStatus(email)
  return getResendStatus(email)
}
