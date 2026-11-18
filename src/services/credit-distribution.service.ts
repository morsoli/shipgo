import { businessConfig, findPlanByPriceId } from "@/config/business-config"
import { CreditEntryTypes } from "@/core/credits/types"
import { addMonthlyCreditsOnce, expireCredits } from "@/repositories/credit.repository"
import { findCurrentBillingOrder } from "@/repositories/payment.repository"
import { listAllUserIds } from "@/repositories/user.repository"
import { sendNotification } from "@/services/notification.service"

export function utcMonthBounds(date = new Date()) {
  return {
    start: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)),
    next: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)),
  }
}

function expirationDate(days?: number) {
  if (!days) return undefined
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

export async function distributeMonthlyCredits(now = new Date()) {
  const users = await listAllUserIds()
  const month = utcMonthBounds(now)
  let granted = 0
  let skipped = 0

  for (const { id: userId } of users) {
    const order = await findCurrentBillingOrder(userId)
    const plan = order
      ? findPlanByPriceId(order.priceId)
      : businessConfig.plans.find((item) => item.id === "free")
    if (!plan?.credits?.enabled) {
      skipped += 1
      continue
    }

    const entryType = plan.isLifetime
      ? CreditEntryTypes.LifetimeMonthlyGrant
      : plan.isFree
        ? CreditEntryTypes.FreeMonthlyGrant
        : CreditEntryTypes.SubscriptionCycleGrant
    const created = await addMonthlyCreditsOnce({
      userId,
      amount: plan.credits.amount,
      entryType,
      summary: `${plan.id} monthly credits`,
      monthStart: month.start,
      nextMonthStart: month.next,
      expiresAt: expirationDate(plan.credits.expireDays),
    })
    if (created) granted += 1
    else skipped += 1
  }

  return { users: users.length, granted, skipped }
}

export async function runCreditMaintenance(now = new Date()) {
  const distribution = await distributeMonthlyCredits(now)
  const expiration = await expireCredits(now)
  await sendNotification({
    title: "Credit maintenance completed",
    description: "Monthly distribution and expiration processing finished.",
    fields: {
      users: distribution.users,
      granted: distribution.granted,
      skipped: distribution.skipped,
      expiredCredits: expiration.credits,
    },
  })
  return { distribution, expiration }
}
