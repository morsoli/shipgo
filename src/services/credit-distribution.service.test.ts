import { describe, expect, it } from "vitest"
import { utcMonthBounds } from "./credit-distribution.service"

describe("credit distribution", () => {
  it("uses stable UTC month boundaries", () => {
    const result = utcMonthBounds(new Date("2026-12-31T23:59:59.000Z"))
    expect(result.start.toISOString()).toBe("2026-12-01T00:00:00.000Z")
    expect(result.next.toISOString()).toBe("2027-01-01T00:00:00.000Z")
  })
})
