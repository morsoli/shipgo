const stats = [
  ["8", "compatible production tables"],
  ["2", "payment providers"],
  ["2", "supported languages"],
  ["20", "maximum search results"],
] as const

export function Stats() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border bg-card p-6 text-center"
          >
            <p className="text-4xl font-semibold text-primary">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
