import { consola } from "consola"

function serialize(value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack }
  }
  return value
}

function structured(level: "info" | "warn" | "error", message: string, details: unknown[]) {
  console[level](
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: "shipgo",
      message,
      details: details.map(serialize),
    })
  )
}

const developmentLogger = consola.withTag("app")

export const logger = {
  info(message: string, ...details: unknown[]) {
    if (process.env.NODE_ENV === "production") structured("info", message, details)
    else developmentLogger.info(message, ...details)
  },
  warn(message: string, ...details: unknown[]) {
    if (process.env.NODE_ENV === "production") structured("warn", message, details)
    else developmentLogger.warn(message, ...details)
  },
  error(message: string, ...details: unknown[]) {
    if (process.env.NODE_ENV === "production") structured("error", message, details)
    else developmentLogger.error(message, ...details)
  },
}
