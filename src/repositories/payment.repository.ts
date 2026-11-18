import { and, desc, eq, or } from "drizzle-orm"
import type {
  BillingMode,
  BillingOrderKind,
  PaymentProviderName,
  PaymentStatus,
  PlanInterval,
} from "@/core/payment/types"
import { requireDb } from "@/db"
import { billingOrder } from "@/db/app.schema"
import { createShipGoId } from "@/shared/lib/id"

export async function findCurrentBillingOrder(userId: string) {
  const [record] = await requireDb()
    .select()
    .from(billingOrder)
    .where(
      and(
        eq(billingOrder.userId, userId),
        eq(billingOrder.settled, true),
        or(
          eq(billingOrder.status, "active"),
          eq(billingOrder.status, "completed"),
          eq(billingOrder.status, "trialing")
        )
      )
    )
    .orderBy(desc(billingOrder.createdAt))
    .limit(1)
  return record ?? null
}

export async function findBillingOrderBySessionId(userId: string, checkoutSessionId: string) {
  const [record] = await requireDb()
    .select()
    .from(billingOrder)
    .where(
      and(eq(billingOrder.userId, userId), eq(billingOrder.checkoutSessionId, checkoutSessionId))
    )
    .limit(1)
  return record ?? null
}

export async function upsertBillingOrderByInvoice(input: {
  provider: PaymentProviderName
  externalInvoiceId: string
  priceId: string
  billingMode: BillingMode
  orderKind: BillingOrderKind
  billingInterval?: PlanInterval
  userId: string
  customerId: string
  subscriptionId?: string
  checkoutSessionId?: string
  status: PaymentStatus
  settled: boolean
}) {
  return requireDb().transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: billingOrder.id })
      .from(billingOrder)
      .where(eq(billingOrder.externalInvoiceId, input.externalInvoiceId))
      .limit(1)
    if (existing) return { id: existing.id, created: false }

    const id = createShipGoId("ord")
    await tx.insert(billingOrder).values({ id, ...input })
    return { id, created: true }
  })
}
