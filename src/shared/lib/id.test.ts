import { describe, expect, it } from "vitest"
import { createShipGoId, type ShipGoIdScope } from "./id"

describe("createShipGoId", () => {
  it("generates scoped ShipGo identifiers with expected prefixes", () => {
    const scopes: ShipGoIdScope[] = ["ord", "wal", "ldg", "req"]
    for (const scope of scopes) {
      const id = createShipGoId(scope)
      expect(id).toMatch(new RegExp(`^sg_${scope}_[0-9a-f]{32}$`))
    }
  })

  it("generates unique identifiers across repeated invocations", () => {
    const ids = new Set(Array.from({ length: 50 }, () => createShipGoId("ord")))
    expect(ids.size).toBe(50)
  })
})
