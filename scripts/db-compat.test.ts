import { describe, expect, it } from "vitest"
import { findMissingRequired } from "./db-compat"

describe("findMissingRequired", () => {
  it("allows product-specific additions while preserving core requirements", () => {
    expect(
      findMissingRequired(["user", "shipgo_billing_order"], new Set(["user", "shipgo_billing_order", "project"]))
    ).toEqual([])
  })

  it("reports a missing core requirement", () => {
    expect(
      findMissingRequired(["user", "shipgo_billing_order"], new Set(["user", "project"]))
    ).toEqual(["shipgo_billing_order"])
  })
})
