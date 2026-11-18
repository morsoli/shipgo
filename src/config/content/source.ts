import { docs } from "fumadocs-mdx:collections/server"
import { loader } from "fumadocs-core/source"
import * as LucideIcons from "lucide-react"
import { createElement } from "react"
import { i18n } from "../../shared/lib/i18n"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
  icon(iconName) {
    if (!iconName) return undefined
    const IconComponent = (LucideIcons as Record<string, any>)[iconName]
    if (IconComponent) return createElement(IconComponent)
    return undefined
  },
})
