import { createFileRoute } from "@tanstack/react-router"
import { PageShell } from "@/shared/components/page-shell"

export const Route = createFileRoute("/{-$locale}/_main/_landing/about")({
  component: AboutPage,
  head: () => ({ meta: [{ title: "About | ShipGo" }] }),
})

function AboutPage() {
  const { locale } = Route.useParams()
  const zh = locale === "zh"
  const values = zh
    ? [
        ["兼容优先", "升级基础设施时，保护现有用户、账单和积分数据。"],
        ["明确边界", "路由、服务、数据访问和第三方 Provider 各司其职。"],
        ["可运营", "默认包含部署、监控、故障恢复和回滚所需能力。"],
      ]
    : [
        [
          "Compatibility first",
          "Protect users, billing, and credit data while upgrading infrastructure.",
        ],
        ["Clear boundaries", "Routes, services, repositories, and providers each have one job."],
        [
          "Operable by default",
          "Deployment, health checks, recovery, and rollback are part of the product.",
        ],
      ]

  return (
    <PageShell
      eyebrow={zh ? "关于我们" : "About"}
      title={zh ? "可靠交付 SaaS 产品" : "A reliable foundation for shipping SaaS"}
      description={
        zh
          ? "ShipGo 将认证、计费、积分、内容和运营能力整合进清晰的 TanStack 架构。"
          : "ShipGo brings authentication, billing, credits, content, and operations into a clear TanStack architecture."
      }
    >
      <div className="grid gap-5 md:grid-cols-3">
        {values.map(([title, description]) => (
          <article
            key={title}
            className="rounded-xl border bg-card p-6"
          >
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </PageShell>
  )
}
