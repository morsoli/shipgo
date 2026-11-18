import { createFileRoute } from "@tanstack/react-router"
import { Image } from "@unpic/react"
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  Cloud,
  CreditCard,
  Database,
  FileSearch,
  KeyRound,
  Layers3,
  LockKeyhole,
  RouteIcon,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react"
import { Cta } from "@/shared/components/landing/cta"
import { Faq } from "@/shared/components/landing/faq"
import PowerBy from "@/shared/components/landing/powerby"
import { Pricing } from "@/shared/components/landing/pricing"
import { Testimonials } from "@/shared/components/landing/testimonials"
import { LocalizedLink, type To } from "@/shared/components/locale/localized-link"
import { Button } from "@/shared/components/ui/button"

export const Route = createFileRoute("/{-$locale}/_main/_landing/")({
  component: RouteComponent,
  ssr: true,
})

const benefits = [
  {
    title: "Auth boundary",
    zh: "认证边界",
    text: "Better Auth sessions, social login, API keys, admin roles.",
    icon: KeyRound,
  },
  {
    title: "Payment loop",
    zh: "支付闭环",
    text: "Stripe or Creem, plans, credits, webhook reconciliation.",
    icon: CreditCard,
  },
  {
    title: "Data foundation",
    zh: "数据基础",
    text: "PostgreSQL, Drizzle schema, compatibility checks.",
    icon: Database,
  },
  {
    title: "Content system",
    zh: "内容系统",
    text: "Docs, blog, changelog, roadmap, legal pages, search.",
    icon: FileSearch,
  },
  {
    title: "Provider layer",
    zh: "Provider 层",
    text: "Email, newsletter, storage, analytics, notifications.",
    icon: Layers3,
  },
  {
    title: "Release gates",
    zh: "发布检查",
    text: "Typecheck, tests, build, database check, smoke test.",
    icon: BadgeCheck,
  },
] as const

const steps = [
  ["01", "Clone", "Start from a typed TanStack Start app."],
  ["02", "Configure", "Set locales, providers, plans, content and env vars."],
  ["03", "Extend", "Add product routes through services and repositories."],
] as const

const architecture = [
  { label: "Route", value: "TanStack Start", icon: RouteIcon },
  { label: "Auth", value: "Better Auth", icon: LockKeyhole },
  { label: "Data", value: "PostgreSQL", icon: Database },
  { label: "Billing", value: "Stripe / Creem", icon: CreditCard },
  { label: "Docs", value: "Fumadocs", icon: FileSearch },
  { label: "Deploy", value: "Docker Node output", icon: Cloud },
] as const

function RouteComponent() {
  const { locale } = Route.useParams()
  const isZh = locale === "zh"

  const copy = {
    eyebrow: isZh ? "生产级 TanStack 全栈模板" : "Production-grade TanStack full-stack template",
    title: isZh ? "先有应用骨架，再开始做产品" : "Start with the application shape already solved",
    body: isZh
      ? "ShipGo 把登录、支付、积分、内容、文档、国际化、数据库和发布检查放进同一个清晰工程结构。你需要替换的是业务，不是重新搭模板。"
      : "ShipGo gives you the structure a real product needs: auth, billing, credits, content, docs, i18n, database checks, and release gates in one coherent TanStack app.",
    start: isZh ? "开始使用" : "Get started",
    docs: isZh ? "查看文档" : "Read docs",
    benefits: isZh ? "它如何帮助你更快启动" : "How it helps you ship faster",
    how: isZh ? "3 步开始" : "How it works",
    architecture: isZh ? "请求经过的层次" : "What is already wired",
    release: isZh ? "发布前可验证" : "Verified before release",
  }

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--muted),transparent_42%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="shipgo-rise">
            <div className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
              {copy.eyebrow}
            </div>
            <h1 className="mt-8 max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              {copy.body}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-6"
              >
                <LocalizedLink to={"/docs/first-application" as To}>
                  {copy.start}
                  <ArrowRight className="ml-2 size-4" />
                </LocalizedLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6"
              >
                <LocalizedLink to="/docs">{copy.docs}</LocalizedLink>
              </Button>
            </div>
          </div>

          <div className="shipgo-rise shipgo-delay-1">
            <div className="overflow-hidden rounded-3xl border bg-card p-2 shadow-xl">
              <Image
                src="/landing/shipgo/hero-control-room.png"
                alt={
                  isZh
                    ? "ShipGo 全栈模板架构主视觉"
                    : "ShipGo full-stack template architecture visual"
                }
                width={1536}
                height={864}
                className="aspect-video w-full rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <PowerBy />

      <section
        id="features"
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Benefits</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              {copy.benefits}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item, index) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="shipgo-lift rounded-2xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Icon className="size-7 text-primary" />
                  <h3 className="mt-8 text-xl font-semibold">{isZh ? item.zh : item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {copy.how}
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              {copy.architecture}
            </h2>
            <p className="mt-5 text-muted-foreground">
              {isZh
                ? "从克隆仓库到连接生产服务，请求链路与核心模块均已完成工程化接线。"
                : "From cloning the repository to wiring production providers, every request layer is structured and ready to extend."}
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map(([number, title, text]) => (
              <article
                key={number}
                className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:grid-cols-[auto_1fr]"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {number}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {architecture.map((item) => {
            const Icon = item.icon
            return (
              <article
                key={item.label}
                className="rounded-2xl border bg-card p-4 text-center shadow-sm"
              >
                <Icon className="mx-auto size-6 text-primary" />
                <p className="mt-4 text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
              </article>
            )
          })}
        </div>
      </section>

      <Pricing />
      <Testimonials />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border bg-card p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {copy.release}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                {isZh ? "不是占位模板，是可发布工程" : "Not a placeholder, a releasable project"}
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                [TerminalSquare, "pnpm typecheck"],
                [Braces, "pnpm build"],
                [ServerCog, "pnpm smoke:release"],
                [ShieldCheck, "pnpm db:check-compat"],
              ].map(([Icon, label]) => {
                const CheckIcon = Icon as typeof TerminalSquare
                return (
                  <div
                    key={label as string}
                    className="flex items-center justify-between rounded-xl border bg-background px-4 py-3"
                  >
                    <span className="flex items-center gap-3 font-mono text-sm">
                      <CheckIcon className="size-4 text-primary" />
                      {label as string}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                      gate
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <Faq />
      <Cta />
    </div>
  )
}
