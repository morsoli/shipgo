import type { BillingMode, BillingOrderKind, PlanInterval } from "@/core/payment/types"

export type PlanPrice = {
  priceId: string
  amount: number
  currency: string
  billingMode: BillingMode
  interval?: PlanInterval
  disabled?: boolean
}

export type PricePlan = {
  id: "free" | "pro" | "lifetime"
  isFree: boolean
  isLifetime: boolean
  popular?: boolean
  credits?: { enabled: boolean; amount: number; expireDays?: number }
  prices: PlanPrice[]
}

function resolvePriceId(serverKey: string, clientValue?: string): string {
  const serverValue = typeof process !== "undefined" ? process.env[serverKey] : undefined
  return serverValue || clientValue || ""
}

const currency =
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_CURRENCY
    : undefined) || "USD"

export const businessConfig = {
  plans: [
    {
      id: "free",
      isFree: true,
      isLifetime: false,
      credits: { enabled: true, amount: 50, expireDays: 30 },
      prices: [],
    },
    {
      id: "pro",
      isFree: false,
      isLifetime: false,
      popular: true,
      credits: { enabled: true, amount: 1_000, expireDays: 30 },
      prices: [
        {
          priceId: resolvePriceId(
            "STRIPE_PRO_MONTHLY_PRICE_ID",
            typeof import.meta !== "undefined" && import.meta.env
              ? import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID
              : undefined
          ),
          amount: 19,
          currency,
          billingMode: "subscription",
          interval: "month",
        },
        {
          priceId: resolvePriceId(
            "STRIPE_PRO_YEARLY_PRICE_ID",
            typeof import.meta !== "undefined" && import.meta.env
              ? import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID
              : undefined
          ),
          amount: 190,
          currency,
          billingMode: "subscription",
          interval: "year",
        },
      ],
    },
    {
      id: "lifetime",
      isFree: false,
      isLifetime: true,
      credits: { enabled: true, amount: 1_000, expireDays: 30 },
      prices: [
        {
          priceId: resolvePriceId(
            "STRIPE_LIFETIME_PRICE_ID",
            typeof import.meta !== "undefined" && import.meta.env
              ? import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID
              : undefined
          ),
          amount: 499,
          currency,
          billingMode: "one_time",
        },
      ],
    },
  ] satisfies PricePlan[],
  creditPackages: [
    {
      id: "basic",
      amount: 500,
      price: 9,
      priceId: resolvePriceId("STRIPE_CREDIT_BASIC_PRICE_ID"),
      expireDays: 365,
    },
    {
      id: "standard",
      amount: 1_500,
      price: 19,
      priceId: resolvePriceId("STRIPE_CREDIT_STANDARD_PRICE_ID"),
      expireDays: 365,
    },
    {
      id: "premium",
      amount: 5_000,
      price: 49,
      priceId: resolvePriceId("STRIPE_CREDIT_PREMIUM_PRICE_ID"),
      expireDays: 365,
    },
    {
      id: "enterprise",
      amount: 20_000,
      price: 149,
      priceId: resolvePriceId("STRIPE_CREDIT_ENTERPRISE_PRICE_ID"),
      expireDays: 365,
    },
  ],
  orderKinds: ["subscription_plan", "lifetime_plan", "credit_pack"] satisfies BillingOrderKind[],
} as const

export function findPlanByPriceId(priceId: string) {
  if (!priceId) return undefined
  return businessConfig.plans.find((plan) => plan.prices.some((price) => price.priceId === priceId))
}
