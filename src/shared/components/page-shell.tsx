import type { ReactNode } from "react"

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto min-h-[70dvh] max-w-6xl px-6 py-16 md:py-24">
      <header className="mx-auto max-w-3xl text-center">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{description}</p>
      </header>
      <div className="mt-12">{children}</div>
    </main>
  )
}
