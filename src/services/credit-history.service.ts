import { z } from "zod"
import { creditEntryTypes } from "@/core/credits/types"
import { listCreditEntries } from "@/repositories/credit.repository"

export const creditHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  days: z.coerce.number().int().min(1).max(365).optional(),
  type: z.enum(creditEntryTypes).optional(),
})

export async function getCreditHistory(
  userId: string,
  query: z.infer<typeof creditHistoryQuerySchema>
) {
  const result = await listCreditEntries({ userId, ...query })
  const data = result.rows.map((row) => ({
    id: row.id,
    credits: row.delta,
    creditsType: row.entryType,
    transactionType: row.entryType,
    description: row.summary,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }))
  const byDay = new Map<string, { earned: number; spent: number }>()
  for (const row of result.rows) {
    const day = row.createdAt.toISOString().slice(0, 10)
    const current = byDay.get(day) ?? { earned: 0, spent: 0 }
    if (row.delta >= 0) current.earned += row.delta
    else current.spent += Math.abs(row.delta)
    byDay.set(day, current)
  }

  return {
    data,
    total: result.total,
    page: query.page,
    limit: query.limit,
    stats: {
      earned: data.reduce((total, row) => total + Math.max(row.credits, 0), 0),
      spent: data.reduce((total, row) => total + Math.abs(Math.min(row.credits, 0)), 0),
      byDay: [...byDay.entries()]
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    },
  }
}
