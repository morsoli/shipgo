import { describe, expect, it } from "vitest"
import { resolveLocaleConfig } from "./locale.config"

describe("locale configuration", () => {
  it("defaults to both shipped locales with English unprefixed", () => {
    expect(resolveLocaleConfig({})).toMatchObject({
      defaultLocale: "en",
      locales: ["en", "zh"],
    })
  })

  it("supports a configured subset and validates the default locale", () => {
    expect(
      resolveLocaleConfig({
        VITE_ENABLED_LOCALES: "zh",
        VITE_DEFAULT_LOCALE: "zh",
      })
    ).toMatchObject({
      defaultLocale: "zh",
      locales: ["zh"],
    })

    expect(
      resolveLocaleConfig({
        VITE_ENABLED_LOCALES: "zh,invalid",
        VITE_DEFAULT_LOCALE: "en",
      })
    ).toMatchObject({
      defaultLocale: "zh",
      locales: ["zh"],
    })
  })
})
