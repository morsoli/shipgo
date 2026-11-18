export type PublicConfig = {
  paymentProvider: "stripe" | "creem"
  creditsEnabled: boolean
  allowFreeUserCreditPurchase: boolean
  signupBonusEnabled: boolean
  signupBonusAmount: number
  signupBonusExpireDays: number
}

export const publicConfig: PublicConfig = {
  paymentProvider: process.env.PAYMENT_PROVIDER === "creem" ? "creem" : "stripe",
  creditsEnabled: true,
  allowFreeUserCreditPurchase: true,
  signupBonusEnabled: true,
  signupBonusAmount: 50,
  signupBonusExpireDays: 30,
}
