import { afterEach, describe, expect, it } from "vitest"
import { assertAdminWriteAllowed, banUserSchema, sanitizeDemoUser } from "./admin-user.service"

const originalDemoMode = process.env.ADMIN_DEMO_MODE

afterEach(() => {
  process.env.ADMIN_DEMO_MODE = originalDemoMode
})

describe("admin user service", () => {
  it("redacts identifying fields for demo users", () => {
    const date = new Date("2026-01-01T00:00:00.000Z")
    const result = sanitizeDemoUser(
      {
        id: "real-id",
        name: "Real Name",
        email: "real@example.com",
        image: "https://example.com/avatar.png",
        emailVerified: true,
        role: "user",
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: date,
        updatedAt: date,
      },
      2
    )

    expect(result.id).toBe("demo-user-3")
    expect(result.email).toBe("demo-user-3@example.com")
    expect(result.image).toBeNull()
  })

  it("blocks writes in demo mode", () => {
    process.env.ADMIN_DEMO_MODE = "true"
    expect(() => assertAdminWriteAllowed()).toThrow("read-only")
  })

  it("validates ban expiry and reason", () => {
    const result = banUserSchema.parse({ reason: "Abuse", expiresAt: "2026-07-01" })
    expect(result.reason).toBe("Abuse")
    expect(result.expiresAt).toBeInstanceOf(Date)
  })
})
