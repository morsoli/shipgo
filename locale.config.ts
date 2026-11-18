export const AVAILABLE_LOCALES = ["en", "zh"] as const

export type AppLocale = (typeof AVAILABLE_LOCALES)[number]

const localeMetadata: Record<
  AppLocale,
  { displayName: string; hreflang: string }
> = {
  en: { displayName: "English", hreflang: "en" },
  zh: { displayName: "中文", hreflang: "zh-CN" },
}

function isAppLocale(value: string): value is AppLocale {
  return AVAILABLE_LOCALES.includes(value as AppLocale)
}

export function resolveLocaleConfig(env: Record<string, string | undefined>) {
  const configured = (env.VITE_ENABLED_LOCALES ?? "")
    .split(",")
    .map((locale) => locale.trim())
    .filter(isAppLocale)
  const locales = configured.length > 0 ? [...new Set(configured)] : [...AVAILABLE_LOCALES]
  const requestedDefault = env.VITE_DEFAULT_LOCALE ?? "en"
  const defaultLocale = isAppLocale(requestedDefault) && locales.includes(requestedDefault)
    ? requestedDefault
    : locales[0]

  return {
    defaultLocale,
    locales,
    metadata: localeMetadata,
  }
}
