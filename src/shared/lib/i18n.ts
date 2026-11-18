import { defineI18n } from "fumadocs-core/i18n"
import { resolveLocaleConfig } from "@/../locale.config"

export const localeConfig = resolveLocaleConfig(import.meta.env)

export const i18n = defineI18n({
  defaultLanguage: localeConfig.defaultLocale,
  languages: localeConfig.locales,
  hideLocale: "default-locale",
})
