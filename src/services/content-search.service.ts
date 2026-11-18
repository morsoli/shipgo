import { create, insertMultiple, search } from "@orama/orama"
import { createTokenizer as createMandarinTokenizer } from "@orama/tokenizers/mandarin"
import { source } from "@/config/content/source"

const schema = {
  title: "string",
  description: "string",
  content: "string",
  url: "string",
} as const

type Locale = "en" | "zh"

function buildIndex(locale: Locale) {
  const database = create({
    schema,
    ...(locale === "zh" ? { components: { tokenizer: createMandarinTokenizer() } } : {}),
  })

  insertMultiple(
    database,
    source.getPages(locale).map((page) => ({
      title: page.data.title,
      description: page.data.description ?? "",
      content: [
        ...page.data.structuredData.headings.map((heading) => heading.content),
        ...page.data.structuredData.contents.map((content) => content.content),
      ].join("\n"),
      url: page.url,
    }))
  )

  return database
}

const indexes = {
  en: buildIndex("en"),
  zh: buildIndex("zh"),
}

export async function searchContent(term: string, locale: Locale) {
  const result = await search(indexes[locale], {
    term,
    properties: ["title", "description", "content"],
    limit: 20,
    boost: { title: 3, description: 2 },
    ...(locale === "zh" ? { threshold: 0, tolerance: 0 } : {}),
  })

  return result.hits.map((hit) => {
    const document = hit.document as Record<string, string>
    return {
      id: document.url,
      type: "page",
      content: document.title,
      url: document.url,
    }
  })
}
