import { beforeEach, describe, expect, it, vi } from "vitest"

const findCurrentBillingOrder = vi.fn()
const findPlanByPriceId = vi.fn()

vi.mock("@/repositories/payment.repository", () => ({ findCurrentBillingOrder }))
vi.mock("@/config/business-config", () => ({ findPlanByPriceId }))

describe("premium access", () => {
  beforeEach(() => {
    findCurrentBillingOrder.mockReset()
    findPlanByPriceId.mockReset()
  })

  it("requires a current paid non-free plan", async () => {
    const { hasPremiumAccess } = await import("./premium.service")
    findCurrentBillingOrder.mockResolvedValueOnce(null)
    await expect(hasPremiumAccess("user-1")).resolves.toBe(false)

    findCurrentBillingOrder.mockResolvedValueOnce({ priceId: "price-free" })
    findPlanByPriceId.mockReturnValueOnce({ isFree: true })
    await expect(hasPremiumAccess("user-1")).resolves.toBe(false)

    findCurrentBillingOrder.mockResolvedValueOnce({ priceId: "price-pro" })
    findPlanByPriceId.mockReturnValueOnce({ isFree: false })
    await expect(hasPremiumAccess("user-1")).resolves.toBe(true)
  })
})
