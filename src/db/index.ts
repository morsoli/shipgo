import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

export * from "./schema"

import { schema } from "./schema"

export type DbSchema = typeof schema
export type Database = PostgresJsDatabase<DbSchema>
export type DbTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0]

let _db: Database | null = null
let _client: postgres.Sql | null = null

export const isDatabaseEnabled = !!process.env.DATABASE_URL

export function getDb(): Database | null {
  if (!isDatabaseEnabled) {
    return null
  }
  if (!_db) {
    _client = postgres(process.env.DATABASE_URL!, { prepare: false })
    _db = drizzle(_client, { schema })
  }
  return _db
}

export function requireDb(): Database {
  const database = getDb()
  if (!database) {
    throw new Error("Database is not configured. Please set DATABASE_URL environment variable.")
  }
  return database
}

export async function closeDb(): Promise<void> {
  if (_client) {
    await _client.end()
    _client = null
    _db = null
  }
}

export const db = new Proxy({} as Database, {
  get(_, prop) {
    return requireDb()[prop as keyof Database]
  },
})
