import { and, asc, count, desc, eq, gt, gte, isNull, lt, lte, not, or, sql } from "drizzle-orm"
import { type CreditEntryType, CreditEntryTypes } from "@/core/credits/types"
import { type DbTransaction, requireDb } from "@/db"
import { creditLedger, creditWallet } from "@/db/app.schema"
import { createShipGoId } from "@/shared/lib/id"

type Executor = ReturnType<typeof requireDb> | DbTransaction

export async function getCreditBalance(userId: string, executor: Executor = requireDb()) {
  const [row] = await executor
    .select({ balance: creditWallet.balance })
    .from(creditWallet)
    .where(eq(creditWallet.userId, userId))
    .limit(1)
  return row?.balance ?? 0
}

export async function listCreditEntries(input: {
  userId: string
  page: number
  limit: number
  days?: number
  type?: CreditEntryType
}) {
  const filters = [eq(creditLedger.userId, input.userId)]
  if (input.days) {
    const since = new Date()
    since.setUTCDate(since.getUTCDate() - input.days)
    filters.push(gte(creditLedger.createdAt, since))
  }
  if (input.type) filters.push(eq(creditLedger.entryType, input.type))

  const [rows, totals] = await Promise.all([
    requireDb()
      .select()
      .from(creditLedger)
      .where(and(...filters))
      .orderBy(desc(creditLedger.createdAt))
      .limit(input.limit)
      .offset((input.page - 1) * input.limit),
    requireDb()
      .select({ total: count() })
      .from(creditLedger)
      .where(and(...filters)),
  ])
  return { rows, total: totals[0]?.total ?? 0 }
}

export async function addCredits(input: {
  userId: string
  amount: number
  entryType: CreditEntryType
  summary: string
  billingOrderId?: string
  expiresAt?: Date
}) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("Credit amount must be a positive integer")
  }

  await requireDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.userId}))`)
    const updated = await tx
      .update(creditWallet)
      .set({
        balance: sql`${creditWallet.balance} + ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(eq(creditWallet.userId, input.userId))
      .returning({ id: creditWallet.id })
    if (updated.length === 0) {
      await tx.insert(creditWallet).values({
        id: createShipGoId("wal"),
        userId: input.userId,
        balance: input.amount,
      })
    }
    await tx.insert(creditLedger).values({
      id: createShipGoId("ldg"),
      userId: input.userId,
      entryType: input.entryType,
      summary: input.summary,
      delta: input.amount,
      availableDelta: input.amount,
      billingOrderId: input.billingOrderId,
      expiresAt: input.expiresAt,
    })
  })
}

export async function addCreditsOnce(input: {
  userId: string
  amount: number
  entryType: CreditEntryType
  summary: string
  expiresAt?: Date
}) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("Credit amount must be a positive integer")
  }

  return requireDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.userId}))`)
    const [existing] = await tx
      .select({ id: creditLedger.id })
      .from(creditLedger)
      .where(
        and(eq(creditLedger.userId, input.userId), eq(creditLedger.entryType, input.entryType))
      )
      .limit(1)
    if (existing) return false

    const updated = await tx
      .update(creditWallet)
      .set({
        balance: sql`${creditWallet.balance} + ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(eq(creditWallet.userId, input.userId))
      .returning({ id: creditWallet.id })
    if (updated.length === 0) {
      await tx.insert(creditWallet).values({
        id: createShipGoId("wal"),
        userId: input.userId,
        balance: input.amount,
      })
    }
    await tx.insert(creditLedger).values({
      id: createShipGoId("ldg"),
      userId: input.userId,
      entryType: input.entryType,
      summary: input.summary,
      delta: input.amount,
      availableDelta: input.amount,
      expiresAt: input.expiresAt,
    })
    return true
  })
}

export async function addMonthlyCreditsOnce(input: {
  userId: string
  amount: number
  entryType: CreditEntryType
  summary: string
  monthStart: Date
  nextMonthStart: Date
  expiresAt?: Date
}) {
  return requireDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.userId}))`)
    const [existing] = await tx
      .select({ id: creditLedger.id })
      .from(creditLedger)
      .where(
        and(
          eq(creditLedger.userId, input.userId),
          eq(creditLedger.entryType, input.entryType),
          gte(creditLedger.createdAt, input.monthStart),
          lt(creditLedger.createdAt, input.nextMonthStart)
        )
      )
      .limit(1)
    if (existing) return false

    const updated = await tx
      .update(creditWallet)
      .set({
        balance: sql`${creditWallet.balance} + ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(eq(creditWallet.userId, input.userId))
      .returning({ id: creditWallet.id })
    if (updated.length === 0) {
      await tx.insert(creditWallet).values({
        id: createShipGoId("wal"),
        userId: input.userId,
        balance: input.amount,
      })
    }
    await tx.insert(creditLedger).values({
      id: createShipGoId("ldg"),
      userId: input.userId,
      entryType: input.entryType,
      summary: input.summary,
      delta: input.amount,
      availableDelta: input.amount,
      expiresAt: input.expiresAt,
    })
    return true
  })
}

export async function expireCredits(now = new Date()) {
  const candidates = await requireDb()
    .select({ id: creditLedger.id, userId: creditLedger.userId })
    .from(creditLedger)
    .where(
      and(
        lte(creditLedger.expiresAt, now),
        isNull(creditLedger.expiredProcessedAt),
        gt(creditLedger.availableDelta, 0)
      )
    )

  let expired = 0
  for (const candidate of candidates) {
    await requireDb().transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${candidate.userId}))`)
      const [record] = await tx
        .select()
        .from(creditLedger)
        .where(
          and(
            eq(creditLedger.id, candidate.id),
            isNull(creditLedger.expiredProcessedAt),
            gt(creditLedger.availableDelta, 0)
          )
        )
        .limit(1)
      const amount = record?.availableDelta ?? 0
      if (amount <= 0) return

      await tx
        .update(creditLedger)
        .set({ availableDelta: 0, expiredProcessedAt: now, updatedAt: now })
        .where(eq(creditLedger.id, candidate.id))
      await tx
        .update(creditWallet)
        .set({
          balance: sql`greatest(${creditWallet.balance} - ${amount}, 0)`,
          updatedAt: now,
        })
        .where(eq(creditWallet.userId, candidate.userId))
      await tx.insert(creditLedger).values({
        id: createShipGoId("ldg"),
        userId: candidate.userId,
        entryType: CreditEntryTypes.Expiration,
        summary: `Expired credits from ${candidate.id}`,
        delta: -amount,
        availableDelta: 0,
      })
      expired += amount
    })
  }
  return { records: candidates.length, credits: expired }
}

export async function consumeCredits(input: {
  userId: string
  amount: number
  description: string
}) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("Credit amount must be a positive integer")
  }

  await requireDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.userId}))`)
    const updated = await tx
      .update(creditWallet)
      .set({
        balance: sql`${creditWallet.balance} - ${input.amount}`,
        updatedAt: new Date(),
      })
      .where(
        and(eq(creditWallet.userId, input.userId), sql`${creditWallet.balance} >= ${input.amount}`)
      )
      .returning({ balance: creditWallet.balance })
    if (updated.length === 0) throw new Error("Insufficient credits")

    const earnRows = await tx
      .select()
      .from(creditLedger)
      .where(
        and(
          eq(creditLedger.userId, input.userId),
          not(eq(creditLedger.entryType, CreditEntryTypes.Consumption)),
          not(eq(creditLedger.entryType, CreditEntryTypes.Expiration)),
          gt(creditLedger.availableDelta, 0),
          or(isNull(creditLedger.expiresAt), gt(creditLedger.expiresAt, new Date()))
        )
      )
      .orderBy(asc(creditLedger.expiresAt), asc(creditLedger.createdAt))

    let remaining = input.amount
    for (const row of earnRows) {
      if (remaining === 0) break
      const deduction = Math.min(row.availableDelta ?? 0, remaining)
      await tx
        .update(creditLedger)
        .set({ availableDelta: (row.availableDelta ?? 0) - deduction, updatedAt: new Date() })
        .where(eq(creditLedger.id, row.id))
      remaining -= deduction
    }
    if (remaining !== 0) throw new Error("Credit ledger is inconsistent with current balance")

    await tx.insert(creditLedger).values({
      id: createShipGoId("ldg"),
      userId: input.userId,
      entryType: CreditEntryTypes.Consumption,
      summary: input.description,
      delta: -input.amount,
    })
  })
}
