import { describe, expect, it } from "vitest"
import { contactSchema } from "@/services/contact.service"
import { newsletterEmailSchema } from "@/services/newsletter.service"

describe("integration input validation", () => {
  it("validates newsletter and contact input", () => {
    expect(newsletterEmailSchema.parse("hello@example.com")).toBe("hello@example.com")
    expect(newsletterEmailSchema.safeParse("invalid").success).toBe(false)
    expect(
      contactSchema.safeParse({
        name: "Jane",
        email: "jane@example.com",
        message: "I need help configuring payments.",
        locale: "en",
      }).success
    ).toBe(true)
  })
})
