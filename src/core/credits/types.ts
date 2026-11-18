export const creditEntryTypes = [
  "signup_bonus",
  "free_monthly_grant",
  "credit_pack_purchase",
  "subscription_cycle_grant",
  "lifetime_monthly_grant",
  "credit_consumption",
  "credit_expiration",
] as const

export type CreditEntryType = (typeof creditEntryTypes)[number]

export const CreditEntryTypes = {
  SignupBonus: "signup_bonus",
  FreeMonthlyGrant: "free_monthly_grant",
  CreditPackPurchase: "credit_pack_purchase",
  SubscriptionCycleGrant: "subscription_cycle_grant",
  LifetimeMonthlyGrant: "lifetime_monthly_grant",
  Consumption: "credit_consumption",
  Expiration: "credit_expiration",
} as const satisfies Record<string, CreditEntryType>
