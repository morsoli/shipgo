import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, apiKey, captcha } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { emailHarmony } from "better-auth-harmony"
import { getTranslationContent, type Locale } from "intlayer"
import { verificationEmailTranslations } from "@/config/locale/auth.content"
import { getDb } from "@/db"
import { runRegistrationPostProcessing } from "@/services/registration.service"
import { sendEmail } from "@/shared/lib/email/send-email"
import { isAuthConfigured } from "./auth-config"

const isCaptchaEnabled =
  process.env.TURNSTILE_CAPTCHA_ENABLED === "true" && !!process.env.TURNSTILE_SECRET_KEY

const isEmailVerificationEnabled = process.env.EMAIL_VERIFICATION_ENABLED === "true"

const isCredentialAuthEnabled = process.env.CREDENTIAL_AUTH_ENABLED !== "false"

const isGitHubOAuthEnabled =
  process.env.GITHUB_AUTH_ENABLED !== "false" &&
  !!process.env.GITHUB_CLIENT_ID &&
  !!process.env.GITHUB_CLIENT_SECRET

const isGoogleOAuthEnabled =
  process.env.GOOGLE_AUTH_ENABLED !== "false" &&
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET

function getLocaleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/").filter(Boolean)
    const locale = pathParts[0]
    if (locale === "zh" || locale === "en") {
      return locale
    }
  } catch {
    // ignore
  }
  return "en"
}

function createAuth() {
  if (!isAuthConfigured) {
    return null
  }

  const db = getDb()
  if (!db) {
    return null
  }

  return betterAuth({
    appName: "ShipGo",
    baseURL: process.env.APP_URL || import.meta.env.VITE_APP_URL || "http://localhost:3000",
    database: drizzleAdapter(db, { provider: "pg" }),
    advanced: {
      cookiePrefix: "shipgo",
    },
    session: {
      cookieCache: { enabled: true, maxAge: 60 * 60 },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      freshAge: 0,
    },
    plugins: [
      ...(isCaptchaEnabled
        ? [
            captcha({
              provider: "cloudflare-turnstile",
              secretKey: process.env.TURNSTILE_SECRET_KEY as string,
            }),
          ]
        : []),
      admin({
        defaultBanExpiresIn: undefined,
        bannedUserMessage: "You have been banned. Contact support if you believe this is an error.",
      }),
      apiKey({
        defaultPrefix: "sgk_",
        startingCharactersConfig: {
          shouldStore: true,
          charactersLength: 10,
        },
      }),
      emailHarmony({ allowNormalizedSignin: false }),
      tanstackStartCookies(),
    ],
    emailAndPassword: {
      enabled: isCredentialAuthEnabled,
      requireEmailVerification: isEmailVerificationEnabled,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          url,
          locale: "en",
          subject: "Reset your ShipGo password",
          type: "reset-password",
        })
      },
    },
    ...(isEmailVerificationEnabled && {
      emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
          const locale = getLocaleFromUrl(url)
          const subject = getTranslationContent(
            verificationEmailTranslations.subject,
            locale as Locale
          )

          await sendEmail({
            to: user.email,
            url,
            locale,
            subject,
            type: "verification",
          })
        },
      },
    }),
    socialProviders: {
      ...(isGitHubOAuthEnabled && {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
      }),
      ...(isGoogleOAuthEnabled && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }),
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
      },
    },
    user: {
      additionalFields: {
        billingCustomerId: { type: "string", required: false },
      },
      deleteUser: { enabled: true },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await runRegistrationPostProcessing({ id: user.id, email: user.email })
          },
        },
      },
    },
  })
}

export const auth = createAuth()

export function requireAuth() {
  if (!auth) {
    throw new Error(
      "Authentication is not configured. Please set DATABASE_URL and BETTER_AUTH_SECRET."
    )
  }
  return auth
}
