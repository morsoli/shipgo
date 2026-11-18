import { describe, expect, it } from "vitest"
import { businessConfig, findPlanByPriceId } from "./business-config"
import { getPlans } from "./payment-config"

describe("businessConfig", () => {
  it("preserves public plan and credit package identifiers", () => {
    expect(businessConfig.plans.map((plan) => plan.id)).toEqual(["free", "pro", "lifetime"])
    expect(businessConfig.creditPackages.map((item) => item.id)).toEqual([
      "basic",
      "standard",
      "premium",
      "enterprise",
    ])
  })

  it("finds configured prices without treating empty ids as valid", () => {
    expect(findPlanByPriceId("")).toBeUndefined()
    expect(findPlanByPriceId("does-not-exist")).toBeUndefined()
  })

  it("derives browser paymentConfig consistently from businessConfig", () => {
    const plans = getPlans()
    expect(plans.map((plan) => plan.id)).toEqual(businessConfig.plans.map((plan) => plan.id))
    const proBusiness = businessConfig.plans.find((plan) => plan.id === "pro")!
    const proBrowser = plans.find((plan) => plan.id === "pro")!
    expect(proBrowser.prices.map((price) => price.amount)).toEqual(
      proBusiness.prices.map((price) => Math.round(price.amount * 100))
    )
  })
})
