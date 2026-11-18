import { createServerFn } from "@tanstack/react-start"
import { findPlanByPriceId } from "@/config/business-config"
import { findCurrentBillingOrder } from "@/repositories/payment.repository"
import { sessionMiddleware } from "@/shared/middleware/auth.middleware"
import type { UserInfo } from "@/shared/types/user"

const empty: UserInfo = { user: null, payment: { activePlan: null, activeSubscription: null } }

export const getUserInfoFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }): Promise<UserInfo> => {
    if (!context.session?.user.id) return empty
    const current = await findCurrentBillingOrder(context.session.user.id)
    const plan = current ? findPlanByPriceId(current.priceId) : null
    return {
      user: context.session.user as UserInfo["user"],
      payment: {
        activePlan: plan
          ? {
              id: plan.id,
              name: plan.id,
              planType: plan.isLifetime ? "one_time" : "subscription",
              credit: plan.credits
                ? { amount: plan.credits.amount, expireDays: plan.credits.expireDays }
                : undefined,
              prices: plan.prices.map((price) => ({
                priceId: price.priceId,
                amount: Math.round(price.amount * 100),
                currency: price.currency,
                ...("interval" in price && price.interval ? { interval: price.interval } : {}),
              })),
              display: { isRecommended: Boolean(plan.popular) },
            }
          : null,
        activeSubscription: null,
      },
    }
  })
