import { businessConfig } from "@/config/business-config"
import { publicConfig } from "@/config/public-config"
import { CreditEntryTypes } from "@/core/credits/types"
import { addCreditsOnce } from "@/repositories/credit.repository"
import { subscribeNewsletter } from "@/services/newsletter.service"

function expirationDate(days?: number) {
  if (!days) return undefined
  const result = new Date()
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

export async function runRegistrationPostProcessing(user: { id: string; email: string }) {
  const tasks: Promise<unknown>[] = []
  if (publicConfig.signupBonusEnabled) {
    tasks.push(
      addCreditsOnce({
        userId: user.id,
        amount: publicConfig.signupBonusAmount,
        entryType: CreditEntryTypes.SignupBonus,
        summary: "Registration signup bonus",
        expiresAt: expirationDate(publicConfig.signupBonusExpireDays),
      })
    )
  }

  const freePlan = businessConfig.plans.find((plan) => plan.id === "free")
  if (freePlan?.credits?.enabled) {
    tasks.push(
      addCreditsOnce({
        userId: user.id,
        amount: freePlan.credits.amount,
        entryType: CreditEntryTypes.FreeMonthlyGrant,
        summary: "Free plan monthly credits",
        expiresAt: expirationDate(freePlan.credits.expireDays),
      })
    )
  }
  tasks.push(subscribeNewsletter(user.email))

  const results = await Promise.allSettled(tasks)
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[registration] Post-processing task failed", {
        userId: user.id,
        email: user.email,
        error: result.reason,
      })
    }
  }
}
