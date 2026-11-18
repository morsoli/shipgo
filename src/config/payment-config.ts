import type { PlanPrice, PlanWithPrice } from "@/shared/types/payment"
import { businessConfig } from "./business-config"

export const CURRENCY =
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_CURRENCY
    : undefined) || "USD"

export const paymentConfig: PlanWithPrice[] = businessConfig.plans.map((plan) => ({
  id: plan.id,
  planType: plan.isFree ? "free" : plan.isLifetime ? "lifetime" : "subscription",
  ...(plan.credits
    ? {
        credit: {
          amount: plan.credits.amount,
          expireDays: plan.credits.expireDays,
        },
      }
    : {}),
  prices: plan.prices.map((price) => ({
    priceId: price.priceId,
    amount: Math.round(price.amount * 100),
    currency: price.currency || CURRENCY,
    ...("interval" in price && price.interval ? { interval: price.interval } : {}),
  })),
  ...(!plan.isFree
    ? {
        display: {
          ...(plan.popular ? { isRecommended: true } : {}),
          group: plan.isLifetime ? "one-time" : "subscription",
        },
      }
    : {}),
}))

export function getPlans(): PlanWithPrice[] {
  return paymentConfig
}

export function getPlanById(planId: string): PlanWithPrice | undefined {
  return paymentConfig.find((plan) => plan.id === planId)
}

export function getPlanByPriceId(priceId: string): PlanWithPrice | undefined {
  return paymentConfig.find((plan) => plan.prices.some((price) => price.priceId === priceId))
}

export function getPriceById(planId: string, priceId: string): PlanPrice | undefined {
  return getPlanById(planId)?.prices.find((price) => price.priceId === priceId)
}

export function getPlanType(planId: string) {
  return getPlanById(planId)?.planType ?? null
}
