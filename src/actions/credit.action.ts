import { createServerFn } from "@tanstack/react-start"
import { getCreditBalance } from "@/repositories/credit.repository"
import { sessionMiddleware } from "@/shared/middleware/auth.middleware"
import type { UserCredits } from "@/shared/types/user"

const empty: UserCredits = { userCredits: 0 }

export const getUserCreditsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }): Promise<UserCredits> => {
    const userId = context.session?.user.id
    if (!userId) return empty
    return { userCredits: await getCreditBalance(userId) }
  })
