import { randomUUID } from "node:crypto"
import postgres from "postgres"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { CreditEntryTypes } from "@/core/credits/types"

const databaseUrl = process.env.TEST_DATABASE_URL
const describeDatabase = databaseUrl ? describe : describe.skip

describeDatabase("PostgreSQL repository integration", () => {
  const sql = postgres(databaseUrl!, { prepare: false })
  let repositories: typeof import("./credit.repository") & typeof import("./payment.repository")
  let closeDb: typeof import("@/db").closeDb

  beforeAll(async () => {
    process.env.DATABASE_URL = databaseUrl
    repositories = {
      ...(await import("./credit.repository")),
      ...(await import("./payment.repository")),
    }
    ;({ closeDb } = await import("@/db"))
  })

  beforeEach(async () => {
    await sql`truncate table "shipgo_credit_ledger", "shipgo_credit_wallet", "shipgo_billing_order", "apikey", "verification", "account", "session", "user" cascade`
  })

  afterAll(async () => {
    await closeDb?.()
    await sql.end()
  })

  async function createUser() {
    const id = randomUUID()
    const now = new Date()
    await sql`
      insert into "user" (id, name, email, normalized_email, email_verified, role, created_at, updated_at)
      values (${id}, 'Acceptance User', ${`${id}@example.com`}, ${`${id}@example.com`}, true, 'user', ${now}, ${now})
    `
    return id
  }

  it("stores compatible auth, session, verification, and API-key records", async () => {
    const userId = await createUser()
    const now = new Date()
    await sql`
      insert into "account" (id, account_id, provider_id, user_id, created_at, updated_at)
      values (${randomUUID()}, ${userId}, 'credential', ${userId}, ${now}, ${now})
    `
    await sql`
      insert into "session" (id, token, user_id, expires_at, created_at, updated_at)
      values (${randomUUID()}, ${randomUUID()}, ${userId}, ${new Date(now.getTime() + 86_400_000)}, ${now}, ${now})
    `
    await sql`
      insert into "verification" (id, identifier, value, expires_at, created_at, updated_at)
      values (${randomUUID()}, ${`${userId}@example.com`}, ${randomUUID()}, ${new Date(now.getTime() + 86_400_000)}, ${now}, ${now})
    `
    await sql`
      insert into "apikey" (id, key, user_id, enabled, created_at, updated_at)
      values (${randomUUID()}, ${randomUUID()}, ${userId}, true, ${now}, ${now})
    `
    const [counts] = await sql<
      { accounts: number; sessions: number; verifications: number; keys: number }[]
    >`
      select
        (select count(*)::int from "account") as accounts,
        (select count(*)::int from "session") as sessions,
        (select count(*)::int from "verification") as verifications,
        (select count(*)::int from "apikey") as keys
    `
    expect(counts).toEqual({ accounts: 1, sessions: 1, verifications: 1, keys: 1 })
  })

  it("consumes FIFO credits atomically and expires the remaining balance", async () => {
    const userId = await createUser()
    const later = new Date("2030-02-01T00:00:00.000Z")
    const earlier = new Date("2030-01-01T00:00:00.000Z")
    await repositories.addCredits({
      userId,
      amount: 100,
      entryType: CreditEntryTypes.SignupBonus,
      summary: "later",
      expiresAt: later,
    })
    await repositories.addCredits({
      userId,
      amount: 50,
      entryType: CreditEntryTypes.CreditPackPurchase,
      summary: "earlier",
      expiresAt: earlier,
    })

    await repositories.consumeCredits({ userId, amount: 120, description: "acceptance usage" })
    expect(await repositories.getCreditBalance(userId)).toBe(30)
    const earnRows = await sql<{ summary: string; available_delta: number }[]>`
      select summary, available_delta from "shipgo_credit_ledger"
      where user_id = ${userId} and delta > 0 order by expires_at
    `
    expect(earnRows).toEqual([
      { summary: "earlier", available_delta: 0 },
      { summary: "later", available_delta: 30 },
    ])

    const expired = await repositories.expireCredits(new Date("2031-01-01T00:00:00.000Z"))
    expect(expired.credits).toBe(30)
    expect(await repositories.getCreditBalance(userId)).toBe(0)
  })

  it("deduplicates monthly credit grants and billing order invoices", async () => {
    const userId = await createUser()
    const input = {
      userId,
      amount: 50,
      entryType: CreditEntryTypes.FreeMonthlyGrant,
      summary: "monthly",
      monthStart: new Date("2026-06-01T00:00:00.000Z"),
      nextMonthStart: new Date("2026-07-01T00:00:00.000Z"),
    }
    expect(await repositories.addMonthlyCreditsOnce(input)).toBe(true)
    expect(await repositories.addMonthlyCreditsOnce(input)).toBe(false)

    const order = {
      provider: "stripe" as const,
      externalInvoiceId: "invoice-acceptance",
      priceId: "price-acceptance",
      billingMode: "subscription" as const,
      orderKind: "subscription_plan" as const,
      billingInterval: "month" as const,
      userId,
      customerId: "customer-acceptance",
      status: "active" as const,
      settled: true,
    }
    expect((await repositories.upsertBillingOrderByInvoice(order)).created).toBe(true)
    expect((await repositories.upsertBillingOrderByInvoice(order)).created).toBe(false)
  })
})
