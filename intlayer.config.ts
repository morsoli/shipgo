import { type IntlayerConfig } from 'intlayer';
import { resolveLocaleConfig } from "./locale.config";

const localeConfig = resolveLocaleConfig(process.env);

const config: IntlayerConfig = {
  internationalization: {
    locales: localeConfig.locales,
    defaultLocale: localeConfig.defaultLocale,
  },
  routing: {
    mode: "prefix-no-default",
    storage: ["cookie", "localStorage"],
  },
  content: {
    watch: true,
    contentDir: ['src/config/locale'],
  },
};

export default config;
