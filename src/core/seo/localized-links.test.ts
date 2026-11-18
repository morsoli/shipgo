import { describe, expect, it } from "vitest"
import { localeFromPath, localizedLinks } from "./localized-links"

describe("localized SEO links", () => {
  it("keeps English unprefixed and Chinese under /zh", () => {
    expect(localizedLinks("https://shipgo.test/", "/blog/post")).toMatchObject({
      locale: "en",
      canonical: "https://shipgo.test/blog/post",
      default: "https://shipgo.test/blog/post",
      english: "https://shipgo.test/blog/post",
      chinese: "https://shipgo.test/zh/blog/post",
    })
    expect(localizedLinks("https://shipgo.test", "/zh/blog/post")).toMatchObject({
      locale: "zh",
      canonical: "https://shipgo.test/zh/blog/post",
      default: "https://shipgo.test/blog/post",
      english: "https://shipgo.test/blog/post",
      chinese: "https://shipgo.test/zh/blog/post",
    })
    expect(localizedLinks("https://shipgo.test", "/blog/post").alternates).toEqual([
      { locale: "en", hrefLang: "en", href: "https://shipgo.test/blog/post" },
      { locale: "zh", hrefLang: "zh-CN", href: "https://shipgo.test/zh/blog/post" },
    ])
  })

  it("detects only the supported Chinese path prefix", () => {
    expect(localeFromPath("/zh")).toBe("zh")
    expect(localeFromPath("/zh/docs")).toBe("zh")
    expect(localeFromPath("/zh-cn/docs")).toBe("en")
  })
})
