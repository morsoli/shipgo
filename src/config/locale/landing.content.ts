import { type Dictionary, t } from "intlayer"
import { siteConfig } from "@/config/site-config"

const { github } = siteConfig.social

/**
 * Landing Page Configuration
 *
 * Modify this file to customize the landing page content.
 * Use `t({ en: "English", "zh": "中文" })` for i18n text.
 */
export default {
  key: "landing",
  content: {
    banner: {
      display: true,
      text: t({
        en: "ShipGo is being rebuilt as a production-grade TanStack full-stack template.",
        zh: "ShipGo 正在重建为生产级 TanStack 全栈应用模板。",
      }),
      button: {
        text: t({ en: "View on GitHub", zh: "在 GitHub 上查看" }),
        href: github,
      },
    },
    hero: {
      title: t({
        en: "ShipGo full-stack products in hours, not days",
        zh: "ShipGo 加速全栈产品落地",
      }),
      description: t({
        en: "ShipGo is a TanStack Start template for building production web applications with database, authentication, payment, credits, documentation, internationalization and more.",
        zh: "ShipGo 是一个 TanStack Start 模板，用于构建生产级 Web 应用，内置数据库、认证、支付、积分、文档、国际化等能力。",
      }),
      announcement: {
        show: true,
        text: t({
          en: "Open Sourced in 2026: Production-grade TanStack full-stack template available!",
          zh: "2026 年开源：生产级 TanStack 全栈模板现已发布！",
        }),
        href: github,
      },
      buttons: {
        start: {
          text: t({ en: "Get Started", zh: "开始" }),
          url: "/dashboard",
        },
        docs: {
          text: t({ en: "Learn More", zh: "了解更多" }),
          url: "/docs",
        },
      },
      image: {
        enabled: false as const,
        src: "/landing/shipgo/hero-control-room.png",
        width: 1536,
        height: 864,
      },
    },
    powerBy: {
      display: true,
      title: t({ en: "Trusted by developers worldwide", zh: "被全球开发者信任" }),
      items: [
        "tanstack-start",
        "github",
        "tailwindcss",
        "vercel",
        "shadcn",
        "openai",
        "react",
        "supabase",
        "cloudflare",
      ],
    },
    threeBenefits: {
      display: true,
      title: t({ en: "Three Key Benefits", zh: "三大核心优势" }),
      description: t({
        en: "Discover why choose our template",
        zh: "了解为什么选择我们的模板",
      }),
      items: [
        {
          title: t({ en: "Lightning Fast Startup", zh: "极速启动" }),
          description: t({
            en: "Get up and running quickly with a focused TanStack architecture and production-ready infrastructure.",
            zh: "通过清晰的 TanStack 架构和生产级基础设施快速启动。",
          }),
          icon: "Zap",
        },
        {
          title: t({ en: "Type-Safe Static Configuration", zh: "类型安全静态配置" }),
          description: t({
            en: "Centralized, type-safe settings keep product behavior explicit and reviewable.",
            zh: "集中式类型安全配置，让产品行为明确且可审查。",
          }),
          icon: "Shield",
        },
        {
          title: t({ en: "Complete SaaS Kit", zh: "完整的 SaaS 套件" }),
          description: t({
            en: "Authentication, i18n, payments, credits, AI, blog, docs, newsletter, dashboard, routing and SEO are all built-in — saving you weeks of development time.",
            zh: "认证、国际化、支付、积分、AI、博客、文档、邮件订阅、仪表盘、路由和 SEO 全部内置——为你节省数周开发时间。",
          }),
          icon: "HeadphonesIcon",
        },
      ],
    },
    introduction: {
      display: true,
      items: [
        {
          type: "image" as const,
          title: t({
            en: "Typed Service & Provider Architecture",
            zh: "类型安全的 Service 与 Provider 架构",
          }),
          description: t({
            en: "Keep core business logic in services and repositories while isolating external systems behind clean provider adapters.",
            zh: "将核心业务逻辑沉淀在 Service 与 Repository 中，通过清晰的 Provider 适配器隔离外部系统。",
          }),
          image: "/landing/shipgo/feature-architecture.svg" as const,
          imagePosition: "left" as const,
          features: [
            {
              title: t({ en: "Provider Choice", zh: "可替换服务商" }),
              description: t({
                en: "Swap payment, email, newsletter, and S3-compatible storage providers without rewriting UI routes.",
                zh: "无需重写页面路由，即可灵活切换支付、邮件、订阅与 S3 兼容存储服务。",
              }),
            },
            {
              title: t({ en: "Validated Inputs", zh: "输入校验" }),
              description: t({
                en: "Server-side Zod validation and environment-based secrets protect every request.",
                zh: "服务端 Zod 校验与环境变量密钥保护每次请求。",
              }),
            },
          ],
        },
        {
          type: "image" as const,
          title: t({ en: "Zero-Config Authentication", zh: "零配置认证系统" }),
          description: t({
            en: "Built on Better Auth with email, password, verification, and Google or GitHub social login.",
            zh: "基于 Better Auth 构建，支持邮箱密码、邮箱验证以及 Google 或 GitHub 社交登录。",
          }),
          image: "/landing/shipgo/feature-auth.svg" as const,
          imagePosition: "left" as const,
          features: [
            {
              title: t({ en: "One-Click Social Login", zh: "一键社交登录" }),
              description: t({
                en: "Google, GitHub, Apple and more, you can add or modify any provider anytime",
                zh: "Google、GitHub、Apple 等，随时增加修改",
              }),
            },
            {
              title: t({ en: "Magic Link & Password", zh: "魔法链接与密码" }),
              description: t({
                en: "Passwordless login via email or traditional credentials",
                zh: "通过邮件无密码登录或传统账密认证",
              }),
            },
            {
              title: t({ en: "Simple Admin Access", zh: "简洁管理员权限" }),
              description: t({
                en: "Clear admin and user roles keep authorization easy to audit",
                zh: "清晰的管理员和用户角色，让授权逻辑易于审查",
              }),
            },
          ],
        },
        {
          type: "image" as const,
          title: t({ en: "Global Payment Ready", zh: "全球支付就绪" }),
          description: t({
            en: "Accept subscriptions, lifetime purchases, and credit packages with Stripe or Creem.",
            zh: "通过 Stripe 或 Creem 支持订阅、终身购买和积分包支付。",
          }),
          image: "/landing/shipgo/feature-billing.svg",
          imagePosition: "right" as const,
          features: [
            {
              title: t({ en: "Dual Payment Models", zh: "双支付模式" }),
              description: t({
                en: "Subscription recurring billing and one-time credits, ready out of the box",
                zh: "订阅周期计费与一次性积分充值，即插即用",
              }),
            },
            {
              title: t({ en: "Auto Webhook Handling", zh: "自动事件处理" }),
              description: t({
                en: "Payment success, refunds, and subscription changes handled automatically",
                zh: "支付成功、退款、订阅变更自动同步",
              }),
            },
            {
              title: t({ en: "Credit System Built-in", zh: "内置积分系统" }),
              description: t({
                en: "Monetize product usage with built-in credit consumption and top-up flow",
                zh: "通过积分消耗实现产品用量变现，充值流程完整",
              }),
            },
          ],
        },
        {
          type: "image" as const,
          title: t({ en: "Operational Foundation", zh: "可运营基础设施" }),
          description: t({
            en: "Run ShipGo with explicit environment settings, Docker, health checks, and structured service boundaries.",
            zh: "通过明确的环境配置、Docker、健康检查和清晰服务边界运行 ShipGo。",
          }),
          image: "/landing/shipgo/feature-ops.svg",
          imagePosition: "left" as const,
          features: [
            {
              title: t({ en: "Explicit Configuration", zh: "明确配置" }),
              description: t({
                en: "Keep payment, email, storage, and analytics settings reviewable in code and environment variables",
                zh: "支付、邮件、存储与分析设置通过代码与环境变量保持可审查",
              }),
            },
            {
              title: t({ en: "Health Checks", zh: "健康检查" }),
              description: t({
                en: "A dedicated health endpoint supports container orchestration and monitoring",
                zh: "专用健康检查端点支持容器编排和监控",
              }),
            },
            {
              title: t({ en: "Clear Boundaries", zh: "清晰边界" }),
              description: t({
                en: "Services and providers isolate business rules from external systems",
                zh: "服务与 Provider 将业务规则和外部系统隔离",
              }),
            },
          ],
        },
        {
          type: "image" as const,
          title: t({ en: "Content & Communication Hub", zh: "内容与沟通中心" }),
          description: t({
            en: "Keep your users informed with built-in blog, visual roadmap, and changelog. Perfect for building trust and transparency with your SaaS audience.",
            zh: "通过内置博客、可视化路线图和更新日志与用户保持沟通。为您的 SaaS 产品建立信任和透明度。",
          }),
          image: "/landing/shipgo/feature-content.svg",
          imagePosition: "right" as const,
          features: [
            {
              title: t({ en: "MDX Blog", zh: "MDX 博客" }),
              description: t({
                en: "Write posts with rich components, syntax highlighting, and i18n support",
                zh: "支持富组件、代码高亮和多语言的技术博客",
              }),
            },
            {
              title: t({ en: "Visual Roadmap", zh: "可视化路线图" }),
              description: t({
                en: "Show upcoming features with progress tracking and milestone markers",
                zh: "展示即将推出的功能，支持进度追踪",
              }),
            },
            {
              title: t({ en: "Changelog Timeline", zh: "更新日志时间线" }),
              description: t({
                en: "Announce updates with a beautiful timeline layout",
                zh: "以精美时间线形式发布产品更新",
              }),
            },
          ],
        },
        {
          type: "image" as const,
          title: t({ en: "Developer-First Documentation", zh: "开发者友好的文档系统" }),
          description: t({
            en: "Powered by Fumadocs with full-text search, API references, and multilingual support. Everything you need to onboard developers and support your users.",
            zh: "基于 Fumadocs 构建，支持全文搜索、API 参考和多语言。为开发者提供完整的文档体验。",
          }),
          image: "/landing/shipgo/feature-docs.svg",
          imagePosition: "left" as const,
          features: [
            {
              title: t({ en: "Fumadocs Powered", zh: "Fumadocs 驱动" }),
              description: t({
                en: "Structured navigation, MDX components, and code blocks out of the box",
                zh: "开箱即用的结构化导航、MDX 组件和代码块",
              }),
            },
            {
              title: t({ en: "i18n Ready", zh: "多语言就绪" }),
              description: t({
                en: "Parallel content in multiple languages with automatic route switching",
                zh: "多语言内容并行，路由自动切换",
              }),
            },
            {
              title: t({ en: "Search & SEO", zh: "搜索与 SEO" }),
              description: t({
                en: "Built-in search with semantic HTML for optimal discoverability",
                zh: "内置搜索功能，语义化 HTML 提升搜索引擎可见性",
              }),
            },
          ],
        },
      ],
    },
    features: {
      display: true,
      title: t({ en: "Core Features", zh: "核心功能" }),
      description: t({
        en: "Everything you need to boost productivity",
        zh: "提升生产力所需的一切",
      }),
      items: [
        {
          title: t({ en: "Production-grade TanStack Template", zh: "生产级 TanStack 模板" }),
          description: t({
            en: "Ready-to-use production-grade full-stack template with built-in SEO and i18n support",
            zh: "开箱即用的生产级全栈模板，内置 SEO 和国际化支持",
          }),
          icon: "Code",
        },
        {
          title: t({ en: "Auth & Payment Integration", zh: "认证与支付集成" }),
          description: t({
            en: "Integrated Google OAuth, passwordless login, and Stripe payment system",
            zh: "集成 Google OAuth、免密登录和 Stripe 支付系统",
          }),
          icon: "Key",
        },
        {
          title: t({ en: "Data Infrastructure", zh: "数据基础设施" }),
          description: t({
            en: "Built-in Supabase integration for reliable and scalable data storage",
            zh: "内置 Supabase 集成，提供可靠且可扩展的数据存储",
          }),
          icon: "Database",
        },
        {
          title: t({ en: "One-Click Deployment", zh: "一键部署" }),
          description: t({
            en: "Automated configuration for seamless deployment to Vercel or Cloudflare",
            zh: "自动化配置，无缝部署到 Vercel 或 Cloudflare",
          }),
          icon: "Cloud",
        },
        {
          title: t({ en: "Business Analytics", zh: "业务分析" }),
          description: t({
            en: "Integrated Google Analytics and Search Console for continuous growth tracking",
            zh: "集成 Google Analytics 和 Search Console，持续追踪增长",
          }),
          icon: "BarChart3",
        },
        {
          title: t({ en: "Extensible Service Architecture", zh: "可扩展服务架构" }),
          description: t({
            en: "Explicit services and provider adapters with built-in credits and API keys",
            zh: "明确的 Service 与 Provider Adapter，内置积分和 API Key",
          }),
          icon: "Blocks",
        },
      ],
    },
    pricing: {
      display: false,
    },
    horizontalShowcase: {
      display: false,
      title: t({ en: "Featured Capabilities", zh: "特色能力" }),
      description: t({
        en: "Discover what ShipGo can do for you",
        zh: "探索 ShipGo 能为你做什么",
      }),
      items: [
        {
          title: t({ en: "Provider Integrations", zh: "Provider 集成" }),
          imagePath: t({
            en: "/landing/shipgo/feature-architecture.svg",
            zh: "/landing/shipgo/feature-architecture.svg",
          }),
          link: "/",
          description: t({
            en: "Connect payments, email, storage, notifications, and analytics",
            zh: "连接支付、邮件、存储、通知与分析服务",
          }),
        },
        {
          title: t({ en: "Seamless Authentication", zh: "无缝认证" }),
          imagePath: t({
            en: "/landing/shipgo/feature-auth.svg",
            zh: "/landing/shipgo/feature-auth.svg",
          }),
          link: "/",
          description: t({
            en: "One-click login and third-party integrations",
            zh: "一键登录和第三方集成",
          }),
        },
        {
          title: t({ en: "Payment Solutions", zh: "支付方案" }),
          imagePath: "/landing/shipgo/feature-billing.svg",
          link: "/",
          description: t({
            en: "Flexible subscriptions and one-time payments",
            zh: "灵活的订阅和一次性支付",
          }),
        },
        {
          title: t({ en: "Content Management", zh: "内容管理" }),
          imagePath: t({
            en: "/landing/shipgo/feature-content.svg",
            zh: "/landing/shipgo/feature-content.svg",
          }),
          link: "/",
          description: t({
            en: "Multilingual blogs and documentation system",
            zh: "多语言博客和文档系统",
          }),
        },
      ],
    },
    userTestimonials: {
      display: true,
      title: t({ en: "What Our Users Say", zh: "用户评价" }),
      testimonials: [
        {
          text: t({
            en: "ShipGo's separation between routes, services, and repositories kept our billing rules easy to audit as our product grew.",
            zh: "ShipGo 在路由、Service 与 Repository 之间划清了边界，随着业务增长，计费逻辑依然清晰可审计。",
          }),
          image: "/avatars/user1.avif",
          name: "Hannah Lin",
          role: t({ en: "VP of Engineering, MetricFlow", zh: "MetricFlow 工程副总裁" }),
        },
        {
          text: t({
            en: "Moving onto TanStack Start without losing PostgreSQL session, API key, and credit ledger discipline saved our team weeks.",
            zh: "迁移到 TanStack Start 的同时完整保留了 PostgreSQL 会话、API Key 与积分账本规范，为团队节省了数周时间。",
          }),
          image: "/avatars/user2.avif",
          name: "Daniel Morales",
          role: t({ en: "Staff Engineer, RelayGrid", zh: "RelayGrid 资深工程师" }),
        },
        {
          text: t({
            en: "Having Stripe and Creem behind one provider interface meant we could switch checkout modes without touching React routes.",
            zh: "Stripe 与 Creem 统一封装在同一个 Provider 接口之后，切换支付模式时完全不用改动页面路由。",
          }),
          image: "/avatars/user3.avif",
          name: "Claire Bennett",
          role: t({ en: "Product Lead, BillingKit", zh: "BillingKit 产品负责人" }),
        },
        {
          text: t({
            en: "Idempotent webhook settlement and FIFO credit expiration worked reliably out of the box during our staging replay tests.",
            zh: "在预发布环境的回放压测中，幂等 Webhook 结算与按到期时间先进先出的积分扣减表现非常稳定。",
          }),
          image: "/avatars/user4.avif",
          name: "Kenji Takahashi",
          role: t({ en: "Backend Architect, LedgerOps", zh: "LedgerOps 后端架构师" }),
        },
        {
          text: t({
            en: "Better Auth with scoped sgk_ API keys and bilingual email templates gave us a clean auth foundation from day one.",
            zh: "开箱即用的 Better Auth、带 sgk_ 前缀的 API Key 以及双语邮件模板，让我们第一天就拥有了规范的认证底座。",
          }),
          image: "/avatars/user5.avif",
          name: "Priya Nair",
          role: t({ en: "Founder, StackHarbor", zh: "StackHarbor 创始人" }),
        },
        {
          text: t({
            en: "Fumadocs MDX paired with Intlayer keeps our English and Chinese docs synchronized alongside the Markdown export API.",
            zh: "Fumadocs MDX 配合 Intlayer 让我们的中英文文档与 Markdown 导出接口始终保持一致。",
          }),
          image: "/avatars/user6.avif",
          name: "Thomas Weber",
          role: t({ en: "Developer Advocate, DocPulse", zh: "DocPulse 开发者布道师" }),
        },
        {
          text: t({
            en: "The Drizzle compatibility check and non-destructive migrations gave us confidence when upgrading an existing PostgreSQL database.",
            zh: "Drizzle 兼容检查配合非破坏性迁移规范，让我们在升级既有 PostgreSQL 数据库时更有把握。",
          }),
          image: "/avatars/user7.avif",
          name: "Oliver Grant",
          role: t({ en: "Platform Lead, CloudDock", zh: "CloudDock 平台负责人" }),
        },
        {
          text: t({
            en: "Nitro's portable Node.js build and the multi-stage Dockerfile made self-hosting in containers straightforward.",
            zh: "Nitro 可移植的 Node.js 构建产物与多阶段 Dockerfile，让容器化私有部署变得直接明了。",
          }),
          image: "/avatars/user8.avif",
          name: "Sofia Alvarez",
          role: t({ en: "DevOps Engineer, HarborScale", zh: "HarborScale 运维工程师" }),
        },
        {
          text: t({
            en: "Everything from Turnstile protection to Resend notifications is typed and configured in clear files instead of hidden magic.",
            zh: "从 Turnstile 人机验证到 Resend 邮件通知都采用显式类型配置，没有隐晦黑盒，团队接手很快。",
          }),
          image: "/avatars/user9.avif",
          name: "Lucas Park",
          role: t({ en: "Tech Lead, ShipCraft", zh: "ShipCraft 技术负责人" }),
        },
      ],
    },
    mediaCoverage: {
      display: true,
      title: t({ en: "Engineering Highlights", zh: "工程架构专题" }),
      description: t({
        en: "Explore the core subsystems and design conventions built into ShipGo",
        zh: "深入了解 ShipGo 内置的核心子系统与工程规范",
      }),
      items: [
        {
          title: t({
            en: "Layered Service & Repository Architecture",
            zh: "分层 Service 与 Repository 架构设计",
          }),
          description: t({
            en: "Keep HTTP validation in routes, business rules in services, SQL queries in repositories, and external SDKs behind providers.",
            zh: "在路由层完成输入校验，在 Service 层沉淀业务规则，在 Repository 层管理 SQL 与事务，并通过 Provider 隔离外部 SDK。",
          }),
          imagePath: "/landing/shipgo/feature-architecture.svg",
          source: "Architecture Guide",
          date: "2026.06.15",
          href: "/docs/project-structure",
          external: false,
        },
        {
          title: t({
            en: "Session Security & Scoped API Keys",
            zh: "会话安全与作用域 API Key 管理",
          }),
          description: t({
            en: "Better Auth sessions, OAuth account linking, Turnstile checks, and sgk_ prefixed API keys wired to PostgreSQL.",
            zh: "基于 Better Auth 与 PostgreSQL 实现会话管理、OAuth 账户绑定、Turnstile 防护与 sgk_ 前缀 API Key。",
          }),
          imagePath: "/landing/shipgo/feature-auth.svg",
          source: "Auth Spec",
          date: "2026.06.15",
          href: "/docs/authentication",
          external: false,
        },
        {
          title: t({
            en: "Idempotent Billing & FIFO Credit Ledger",
            zh: "幂等支付结算与 FIFO 积分账本",
          }),
          description: t({
            en: "Dual Stripe and Creem support with webhook deduplication, transactional wallet updates, and scheduled credit expiration.",
            zh: "同时支持 Stripe 与 Creem，提供 Webhook 去重、事务性钱包扣减与定时过期积分清理能力。",
          }),
          imagePath: "/landing/shipgo/feature-billing.svg",
          source: "Billing & Credits",
          date: "2026.06.15",
          href: "/docs/payments-and-credits",
          external: false,
        },
        {
          title: t({
            en: "Bilingual MDX Docs & Orama Full-Text Search",
            zh: "双语 MDX 文档与 Orama 全文检索",
          }),
          description: t({
            en: "Paired English and Chinese documentation, Orama search indexing, and raw Markdown endpoints for AI assistants.",
            zh: "成对维护的中英文文档、Orama 全文搜索索引以及面向 AI 助手的原始 Markdown 导出端点。",
          }),
          imagePath: "/landing/shipgo/feature-docs.svg",
          source: "Content & SEO",
          date: "2026.06.15",
          href: "/docs/content-and-seo",
          external: false,
        },
        {
          title: t({
            en: "Docker Production Builds & Release Gates",
            zh: "Docker 生产构建与发布检查门槛",
          }),
          description: t({
            en: "Non-root Node.js 24 container builds, /api/ping health checks, schema compatibility scripts, and release verification.",
            zh: "非 Root 权限的 Node.js 24 容器构建、/api/ping 健康检查、数据库兼容校验与发布验证脚本。",
          }),
          imagePath: "/landing/shipgo/feature-ops.svg",
          source: "Operations",
          date: "2026.06.15",
          href: "/docs/operations",
          external: false,
        },
      ],
    },
    faq: {
      display: true,
      title: t({ en: "Frequently Asked Questions", zh: "常见问题" }),
      description: t({
        en: "Discover quick and comprehensive answers to common questions about our platform, services, and features.",
        zh: "快速全面地了解关于我们平台、服务和功能的常见问题解答。",
      }),
      items: [
        {
          question: t({ en: "What is ShipGo?", zh: "什么是 ShipGo？" }),
          answer: t({
            en: "ShipGo is a production-ready TanStack Start SaaS foundation with PostgreSQL, Drizzle ORM, Better Auth, billing, credits, i18n, and Docker deployment built in.",
            zh: "ShipGo 是一个面向生产环境的 TanStack Start 全栈 SaaS 模板，内置 PostgreSQL、Drizzle ORM、Better Auth、计费、积分、国际化与 Docker 部署能力。",
          }),
        },
        {
          question: t({
            en: "Which payment and email providers are supported?",
            zh: "支持哪些支付和邮件服务商？",
          }),
          answer: t({
            en: "ShipGo supports Stripe and Creem for subscriptions, lifetime plans, and credit packs, plus Resend for transactional emails and Resend or Beehiiv for newsletters.",
            zh: "ShipGo 支持使用 Stripe 或 Creem 处理订阅、终身买断和积分包支付，并使用 Resend 发送事务邮件以及 Resend 或 Beehiiv 管理 Newsletter。",
          }),
        },
      ],
    },
    cta: {
      display: true,
      title: t({ en: "Start Building", zh: "开始构建" }),
      description: t({
        en: "Use the wired template as your baseline, then replace the product logic with your own.",
        zh: "把已接线的模板作为基线，然后替换成你自己的产品业务。",
      }),
      primaryButtonText: t({ en: "Get Started", zh: "立即开始" }),
      primaryButtonHref: "/docs/first-application",
      secondaryButtonText: t({ en: "Open Dashboard", zh: "进入控制台" }),
      secondaryButtonHref: "/dashboard",
    },
    header: {
      display: true,
      items: [
        {
          label: t({ en: "Documentation", zh: "文档" }),
          href: "/docs",
        },
        {
          label: t({ en: "Features", zh: "功能" }),
          href: "#features",
        },
        {
          label: t({ en: "Pricing", zh: "定价" }),
          href: "#pricing",
        },
        {
          label: t({ en: "FAQ", zh: "常见问题" }),
          href: "#faq",
        },
        {
          label: t({ en: "More Features", zh: "更多功能" }),
          children: [
            {
              label: t({ en: "Blog", zh: "博客" }),
              href: "/blog",
            },
            {
              label: t({ en: "Roadmap", zh: "路线图" }),
              href: "/roadmap",
            },
            {
              label: t({ en: "Changelog", zh: "更新日志" }),
              href: "/changelog",
            },
          ],
        },
      ] as const,
    },
    footer: {
      display: true,
      companyName: "ShipGo",
      scrollToTop: t({ en: "Back to Top", zh: "返回顶部" }),
      sections: [
        {
          title: t({ en: "About", zh: "关于" }),
          links: [
            { label: t({ en: "About Us", zh: "关于我们" }), href: "/about" },
            { label: t({ en: "Contact", zh: "联系" }), href: "/contact" },
            { label: t({ en: "Pricing", zh: "定价" }), href: "/pricing" },
          ],
        },
        {
          title: t({ en: "Features", zh: "功能" }),
          links: [
            { label: t({ en: "Documentation", zh: "文档" }), href: "/docs" },
            { label: t({ en: "Roadmap", zh: "路线图" }), href: "/roadmap" },
            { label: t({ en: "Dashboard", zh: "控制台" }), href: "/dashboard" },
          ],
        },
        {
          title: t({ en: "Products", zh: "产品" }),
          links: [
            {
              label: t({ en: "Project Structure", zh: "项目结构" }),
              href: "/docs/project-structure",
            },
            { label: t({ en: "Pricing", zh: "定价" }), href: "/pricing" },
            { label: t({ en: "Waitlist", zh: "等待列表" }), href: "/waitlist" },
          ],
        },
        {
          title: t({ en: "Resources", zh: "资源" }),
          links: [
            { label: t({ en: "Changelog", zh: "更新日志" }), href: "/changelog" },
            { label: t({ en: "Blog", zh: "博客" }), href: "/blog" },
            { label: t({ en: "Roadmap", zh: "路线图" }), href: "/roadmap" },
          ],
        },
        {
          title: t({ en: "Company", zh: "公司" }),
          links: [
            { label: t({ en: "Contact", zh: "联系我们" }), href: "/contact" },
            { label: t({ en: "Terms", zh: "服务条款" }), href: "/legal/terms-of-service" },
            { label: t({ en: "Privacy", zh: "隐私政策" }), href: "/legal/privacy-policy" },
            { label: t({ en: "Cookie", zh: "Cookie 政策" }), href: "/legal/cookie-policy" },
          ],
        },
      ],
    },
  },
} satisfies Dictionary
