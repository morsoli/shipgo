import { type Dictionary, t } from "intlayer"

export default {
  key: "credit-packages",
  content: {
    basic: {
      name: t({ en: "Basic Pack (500 Credits)", zh: "基础积分包（500 积分）" }),
      description: t({
        en: "Ideal for light usage and getting started",
        zh: "适合轻量使用与快速上手",
      }),
    },
    standard: {
      name: t({ en: "Standard Pack (1,500 Credits)", zh: "标准积分包（1,500 积分）" }),
      description: t({
        en: "Balanced credit bundle for regular workflows",
        zh: "适合日常业务流量的均衡积分包",
      }),
    },
    premium: {
      name: t({ en: "Premium Pack (5,000 Credits)", zh: "高级积分包（5,000 积分）" }),
      description: t({
        en: "High-capacity credits for growing teams",
        zh: "适合成长型团队的高额度积分包",
      }),
    },
    enterprise: {
      name: t({ en: "Enterprise Pack (20,000 Credits)", zh: "企业积分包（20,000 积分）" }),
      description: t({
        en: "Maximum volume credits for production workloads",
        zh: "适合高并发生产负载的大容量积分包",
      }),
    },
  },
} satisfies Dictionary
