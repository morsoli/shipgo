import { describe, expect, it } from "vitest"
import { assertCheckoutUrlOrigin, checkoutSchema } from "./payment.service"

describe("payment service", () => {
  it("rejects untrusted checkout URLs", () => {
    const result = checkoutSchema.safeParse({
      priceId: "price_123",
      successUrl: "javascript:alert(1)",
      cancelUrl: "https://shipgo.test/cancel",
    })
    expect(result.success).toBe(false)
  })

  it("accepts valid checkout input", () => {
    const result = checkoutSchema.safeParse({
      priceId: "price_123",
      successUrl: "https://shipgo.test/payment",
      cancelUrl: "https://shipgo.test/pricing",
    })
    expect(result.success).toBe(true)
  })

  it("blocks checkout redirects to another origin", () => {
    expect(() =>
      assertCheckoutUrlOrigin({
        successUrl: "https://attacker.test/success",
        cancelUrl: "http://localhost:3000/pricing",
      })
    ).toThrow("application origin")
  })
})
