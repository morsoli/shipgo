import { beforeEach, describe, expect, it, vi } from "vitest"
import { CreditEntryTypes } from "@/core/credits/types"

const listCreditEntries = vi.fn()
vi.mock("@/repositories/credit.repository", () => ({ listCreditEntries }))

describe("credit history service", () => {
  beforeEach(() => listCreditEntries.mockReset())

  it("validates filters and maps transaction statistics", async () => {
    const { creditHistoryQuerySchema, getCreditHistory } = await import("./credit-history.service")
    expect(creditHistoryQuerySchema.safeParse({ page: "1", limit: "101", days: "7" }).success).toBe(
      false
    )
    listCreditEntries.mockResolvedValue({
      total: 2,
      rows: [
        {
          id: "earn",
          entryType: CreditEntryTypes.SignupBonus,
          delta: 100,
          summary: "gift",
          expiresAt: null,
          createdAt: new Date("2026-06-01T10:00:00.000Z"),
        },
        {
          id: "spend",
          entryType: CreditEntryTypes.Consumption,
          delta: -30,
          summary: "usage",
          expiresAt: null,
          createdAt: new Date("2026-06-01T11:00:00.000Z"),
        },
      ],
    })

    const result = await getCreditHistory("user-1", {
      page: 1,
      limit: 20,
      days: 7,
    })
    expect(result.stats).toEqual({
      earned: 100,
      spent: 30,
      byDay: [{ date: "2026-06-01", earned: 100, spent: 30 }],
    })
    expect(result.data[0]).toMatchObject({
      credits: 100,
      creditsType: CreditEntryTypes.SignupBonus,
    })
  })
})
