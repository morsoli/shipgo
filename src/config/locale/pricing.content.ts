import { type Dictionary, t } from "intlayer"

export default {
  key: "pricing",
  content: {
    title: t({ en: "Choose Your Plan", zh: "选择你的计划" }),
    subtitle: t({
      en: "Select the plan that fits your ShipGo product and team",
      zh: "选择适合你与团队的 ShipGo 方案",
    }),
    loginRequired: t({
      en: "Please login first before purchasing",
      zh: "请先登录后再购买",
    }),
    paymentFailed: t({
      en: "Payment processing failed, please try again",
      zh: "支付处理失败，请重试",
    }),
    processing: t({ en: "Processing...", zh: "处理中..." }),
    loading: t({ en: "Loading...", zh: "加载中..." }),
    getStarted: t({ en: "Get Started", zh: "立即开始" }),
    currentPlan: t({ en: "Current Plan", zh: "当前计划" }),
    upgradePlan: t({ en: "Upgrade", zh: "升级" }),
    downgradePlan: t({ en: "Downgrade Not Supported", zh: "不支持降级" }),
    upgradeFailed: t({ en: "Upgrade failed, please try again", zh: "升级失败，请重试" }),
    popular: t({ en: "Popular", zh: "热门" }),
    free: t({ en: "Free", zh: "免费" }),
    once: t({ en: "once", zh: "一次性" }),
    lifetime: t({ en: "lifetime", zh: "终身" }),
    save20: t({ en: "Save 20%", zh: "省 20%" }),
    month: t({ en: "month", zh: "月" }),
    year: t({ en: "year", zh: "年" }),
    plans: {
      free: {
        title: t({ en: "Free", zh: "免费版" }),
        description: t({
          en: "Explore ShipGo authentication, dashboard, and starter credits",
          zh: "体验 ShipGo 认证、工作台与基础积分额度",
        }),
        price: "$0",
        popular: false,
        features: [
          t({ en: "50 monthly starter credits", zh: "每月 50 基础积分" }),
          t({ en: "Email & OAuth authentication", zh: "邮箱与 OAuth 社交登录" }),
          t({ en: "Personal dashboard & API keys", zh: "个人工作台与 API Key 管理" }),
          t({ en: "Public docs & community support", zh: "完整文档与社区支持" }),
        ],
        buttonText: t({ en: "Get Started", zh: "立即开始" }),
        buttonHref: "/login",
      },
      pro: {
        title: t({ en: "Pro", zh: "专业版" }),
        description: t({
          en: "Built for launching production SaaS products and teams",
          zh: "专为上线生产级 SaaS 产品与团队打造",
        }),
        price: "$19",
        originalPrice: "$29",
        popular: true,
        features: [
          t({ en: "1,000 monthly credits included", zh: "每月包含 1,000 积分" }),
          t({ en: "Full Stripe & Creem billing portal", zh: "完整 Stripe 与 Creem 账单门户" }),
          t({ en: "Premium guides & gated content", zh: "解锁全部会员专属内容与指南" }),
          t({ en: "Priority engineering support", zh: "优先技术支持" }),
          t({ en: "Production API keys & webhooks", zh: "生产级 API Key 与 Webhook" }),
        ],
        buttonText: t({ en: "Upgrade to Pro", zh: "升级到专业版" }),
        buttonHref: "/pricing",
      },
      lifetime: {
        title: t({ en: "Lifetime", zh: "终身版" }),
        description: t({
          en: "One-time payment for permanent Pro access and monthly credits",
          zh: "一次性买断，永久享受专业版权限与月度积分",
        }),
        price: "$499",
        originalPrice: "$699",
        popular: false,
        features: [
          t({ en: "Everything in Pro plan", zh: "包含专业版全部能力" }),
          t({ en: "1,000 credits refreshed monthly", zh: "每月自动发放 1,000 积分" }),
          t({ en: "Lifetime platform updates", zh: "终身版本更新与维护" }),
          t({ en: "Priority customer support", zh: "优先客户支持" }),
          t({ en: "Early access to new capabilities", zh: "抢先体验新功能模块" }),
          t({ en: "Custom provider integrations", zh: "自定义 Provider 扩展支持" }),
          t({ en: "Commercial SaaS deployment rights", zh: "完整商业部署授权" }),
        ],
        buttonText: t({ en: "Buy Lifetime", zh: "购买终身版" }),
        buttonHref: "/pricing",
      },
    },
  },
} satisfies Dictionary
