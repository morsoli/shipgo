import { describe, expect, it } from "vitest"
import { evaluateActionAccess } from "@/shared/middleware/auth.middleware"

describe("server action permission guards", () => {
  it("requires an authenticated user", () => {
    expect(evaluateActionAccess(null, { authenticated: true })).toMatchObject({
      success: false,
      error: { code: "UNAUTHORIZED" },
    })
  })

  it("requires the existing admin role", () => {
    expect(evaluateActionAccess({ user: { role: "user" } }, { admin: true })).toMatchObject({
      success: false,
      error: { code: "FORBIDDEN" },
    })
    expect(evaluateActionAccess({ user: { role: "admin" } }, { admin: true })).toBeNull()
  })

  it("blocks writes in demo administration mode", () => {
    expect(
      evaluateActionAccess({ user: { role: "admin" } }, { admin: true, demoReadonly: true }, true)
    ).toMatchObject({
      success: false,
      error: { code: "DEMO_READONLY" },
    })
  })
})
