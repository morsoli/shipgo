import { findPlanByPriceId } from "@/config/business-config"
import { findCurrentBillingOrder } from "@/repositories/payment.repository"

export async function hasPremiumAccess(userId: string) {
  const currentOrder = await findCurrentBillingOrder(userId)
  if (!currentOrder) return false
  const plan = findPlanByPriceId(currentOrder.priceId)
  return Boolean(plan && !plan.isFree)
}
