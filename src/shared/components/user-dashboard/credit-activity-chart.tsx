import { useQuery } from "@tanstack/react-query"
import { http } from "@/shared/lib/tools/http-client"

type CreditActivity = {
  stats: {
    earned: number
    spent: number
    byDay: { date: string; earned: number; spent: number }[]
  }
}

export function CreditActivityChart() {
  const query = useQuery({
    queryKey: ["credit-activity", 7],
    queryFn: () => http<CreditActivity>("/api/credit/history?days=7&limit=100"),
  })
  const days = query.data?.stats.byDay ?? []
  const max = Math.max(1, ...days.flatMap((day) => [day.earned, day.spent]))

  return (
    <section className="rounded-xl border p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">7-day credit activity</h2>
          <p className="text-sm text-muted-foreground">Credits earned and spent by day</p>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-600">+{query.data?.stats.earned ?? 0}</span>
          <span className="text-rose-600">-{query.data?.stats.spent ?? 0}</span>
        </div>
      </div>
      {query.isLoading ? (
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      ) : days.length === 0 ? (
        <div className="grid h-40 place-items-center rounded-lg bg-muted/40 text-sm text-muted-foreground">
          No credit activity in the last 7 days
        </div>
      ) : (
        <div
          className="flex h-40 items-end gap-3"
          role="img"
          aria-label="Credit activity chart"
        >
          {days.map((day) => (
            <div
              key={day.date}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-28 w-full items-end justify-center gap-1">
                <div
                  className="w-2/5 rounded-t bg-emerald-500"
                  style={{ height: `${Math.max(4, (day.earned / max) * 100)}%` }}
                  title={`${day.date}: ${day.earned} earned`}
                />
                <div
                  className="w-2/5 rounded-t bg-rose-500"
                  style={{ height: `${Math.max(4, (day.spent / max) * 100)}%` }}
                  title={`${day.date}: ${day.spent} spent`}
                />
              </div>
              <span className="truncate text-xs text-muted-foreground">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
