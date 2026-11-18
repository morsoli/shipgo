import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

const productionEnvSchema = z
  .object({
    NODE_ENV: z.string().optional(),
    APP_URL: z.string().url(),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    PAYMENT_PROVIDER: z.enum(["stripe", "creem"]),
    EMAIL_PROVIDER: z.literal("resend"),
    EMAIL_FROM: z.string().min(3),
    RESEND_API_KEY: z.string().min(1),
  })
  .superRefine((env, context) => {
    const paymentSecret =
      env.PAYMENT_PROVIDER === "creem" ? process.env.CREEM_API_KEY : process.env.STRIPE_SECRET_KEY
    const webhookSecret =
      env.PAYMENT_PROVIDER === "creem"
        ? process.env.CREEM_WEBHOOK_SECRET
        : process.env.STRIPE_WEBHOOK_SECRET
    if (!paymentSecret) context.addIssue({ code: "custom", message: "Payment API key is required" })
    if (!webhookSecret)
      context.addIssue({ code: "custom", message: "Payment webhook secret is required" })
  })

let validated = false

export function validateServerEnvironment() {
  if (validated || process.env.NODE_ENV !== "production") return
  productionEnvSchema.parse(process.env)
  validated = true
}

export const validateServerEnvironmentFn = createServerFn({ method: "GET" }).handler(() => {
  validateServerEnvironment()
})
