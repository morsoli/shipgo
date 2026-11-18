import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { actionFailure, validationFailure } from "@/core/action-result"
import { consumeCredits } from "@/repositories/credit.repository"
import { sessionMiddleware } from "@/shared/middleware/auth.middleware"

const schema = z.object({
  amount: z.number().int().positive(),
  description: z.string().trim().min(1).max(500),
})

export const consumeCreditsFn = createServerFn({ method: "POST" })
  .middleware([sessionMiddleware])
  .inputValidator((input: unknown) => input)
  .handler(async ({ context, data }) => {
    if (!context.session?.user.id) return actionFailure("UNAUTHORIZED", "Authentication required")
    const parsed = schema.safeParse(data)
    if (!parsed.success) return validationFailure(parsed.error)
    try {
      await consumeCredits({ userId: context.session.user.id, ...parsed.data })
      return { success: true } as const
    } catch (error) {
      return actionFailure(
        error instanceof Error && error.message === "Insufficient credits"
          ? "INSUFFICIENT_CREDITS"
          : "CREDIT_CONSUME_FAILED",
        error instanceof Error ? error.message : "Unable to consume credits"
      )
    }
  })
