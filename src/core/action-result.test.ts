import { describe, expect, it } from "vitest"
import { z } from "zod"
import { actionFailure, actionSuccess, validationFailure } from "./action-result"

describe("action results", () => {
  it("uses a stable success and error envelope", () => {
    expect(actionSuccess({ id: "1" })).toEqual({ success: true, data: { id: "1" } })
    expect(actionFailure("FORBIDDEN", "Forbidden")).toEqual({
      success: false,
      error: { code: "FORBIDDEN", message: "Forbidden" },
    })
  })

  it("maps zod field errors", () => {
    const parsed = z.object({ email: z.email() }).safeParse({ email: "invalid" })
    if (parsed.success) throw new Error("Expected validation failure")
    const result = validationFailure(parsed.error)
    expect(result.success).toBe(false)
    if (result.success) throw new Error("Expected failure")
    expect(result.error).toMatchObject({ code: "VALIDATION_ERROR" })
  })
})
