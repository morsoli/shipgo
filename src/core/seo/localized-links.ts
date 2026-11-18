import type { AppLocale } from "@/../locale.config"
import { localeConfig } from "@/shared/lib/i18n"

export function localeFromPath(pathname: string): AppLocale {
  const prefix = pathname.split("/").filter(Boolean)[0]
  return (
    localeConfig.locales.find(
      (locale) => locale !== localeConfig.defaultLocale && locale === prefix
    ) ?? localeConfig.defaultLocale
  )
}

function pathWithoutLocale(pathname: string) {
  const locale = localeFromPath(pathname)
  if (locale === localeConfig.defaultLocale) return pathname || "/"
  return pathname === `/${locale}` ? "/" : pathname.replace(new RegExp(`^/${locale}/`), "/")
}

function pathForLocale(pathname: string, locale: AppLocale) {
  const basePath = pathWithoutLocale(pathname)
  if (locale === localeConfig.defaultLocale) return basePath
  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`
}

export function localizedLinks(baseUrl: string, pathname: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "")
  const canonicalPath = pathname === "" ? "/" : pathname
  const alternates = localeConfig.locales.map((locale) => ({
    locale,
    hrefLang: localeConfig.metadata[locale].hreflang,
    href: `${normalizedBase}${pathForLocale(canonicalPath, locale)}`,
  }))

  return {
    locale: localeFromPath(pathname),
    canonical: canonicalPath === "/" ? normalizedBase || "/" : `${normalizedBase}${canonicalPath}`,
    default: `${normalizedBase}${pathForLocale(canonicalPath, localeConfig.defaultLocale)}`,
    alternates,
    english: `${normalizedBase}${pathForLocale(canonicalPath, "en")}`,
    chinese: `${normalizedBase}${pathForLocale(canonicalPath, "zh")}`,
  }
}
