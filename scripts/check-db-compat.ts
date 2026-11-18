import "dotenv/config"
import postgres from "postgres"
import { findMissingRequired } from "./db-compat"

const expectedTables = [
  "account",
  "apikey",
  "session",
  "shipgo_billing_order",
  "shipgo_credit_ledger",
  "shipgo_credit_wallet",
  "user",
  "verification",
] as const

const requiredColumns: Record<(typeof expectedTables)[number], string[]> = {
  user: [
    "id",
    "name",
    "email",
    "normalized_email",
    "email_verified",
    "image",
    "role",
    "banned",
    "ban_reason",
    "ban_expires",
    "billing_customer_id",
    "created_at",
    "updated_at",
  ],
  session: [
    "id",
    "token",
    "user_id",
    "expires_at",
    "created_at",
    "updated_at",
    "ip_address",
    "user_agent",
    "impersonated_by",
  ],
  account: [
    "id",
    "account_id",
    "provider_id",
    "user_id",
    "access_token",
    "refresh_token",
    "id_token",
    "access_token_expires_at",
    "refresh_token_expires_at",
    "scope",
    "password",
    "created_at",
    "updated_at",
  ],
  verification: ["id", "identifier", "value", "expires_at", "created_at", "updated_at"],
  apikey: [
    "id",
    "name",
    "start",
    "prefix",
    "key",
    "user_id",
    "refill_interval",
    "refill_amount",
    "last_refill_at",
    "enabled",
    "rate_limit_enabled",
    "rate_limit_time_window",
    "rate_limit_max",
    "request_count",
    "remaining",
    "last_request",
    "expires_at",
    "created_at",
    "updated_at",
    "permissions",
    "metadata",
  ],
  shipgo_billing_order: [
    "id",
    "user_id",
    "provider",
    "price_id",
    "billing_mode",
    "order_kind",
    "billing_interval",
    "customer_id",
    "subscription_id",
    "checkout_session_id",
    "external_invoice_id",
    "status",
    "settled",
    "period_start_at",
    "period_end_at",
    "cancel_at_period_end",
    "trial_start_at",
    "trial_end_at",
    "created_at",
    "updated_at",
  ],
  shipgo_credit_wallet: ["id", "user_id", "balance", "created_at", "updated_at"],
  shipgo_credit_ledger: [
    "id",
    "user_id",
    "entry_type",
    "summary",
    "delta",
    "available_delta",
    "billing_order_id",
    "expires_at",
    "expired_processed_at",
    "created_at",
    "updated_at",
  ],
}

const requiredIndexes = [
  "session_token_unique",
  "shipgo_account_external_idx",
  "shipgo_account_provider_idx",
  "shipgo_account_user_idx",
  "shipgo_apikey_key_idx",
  "shipgo_apikey_user_idx",
  "shipgo_billing_order_customer_idx",
  "shipgo_billing_order_external_invoice_id_unique",
  "shipgo_billing_order_invoice_idx",
  "shipgo_billing_order_kind_idx",
  "shipgo_billing_order_mode_idx",
  "shipgo_billing_order_price_idx",
  "shipgo_billing_order_session_idx",
  "shipgo_billing_order_settled_idx",
  "shipgo_billing_order_status_idx",
  "shipgo_billing_order_subscription_idx",
  "shipgo_billing_order_user_idx",
  "shipgo_credit_ledger_expires_idx",
  "shipgo_credit_ledger_type_idx",
  "shipgo_credit_ledger_user_idx",
  "shipgo_credit_wallet_user_id_unique",
  "shipgo_credit_wallet_user_idx",
  "shipgo_session_token_idx",
  "shipgo_session_user_idx",
  "shipgo_user_billing_customer_idx",
  "shipgo_user_id_idx",
  "shipgo_user_role_idx",
  "user_email_unique",
  "user_normalized_email_unique",
] as const

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")

const sql = postgres(process.env.DATABASE_URL, { prepare: false })
try {
  const rows = await sql<{ table_name: string }[]>`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `
  const actual = new Set(rows.map((row) => row.table_name))
  const missing = findMissingRequired(expectedTables, actual)
  if (missing.length) throw new Error(`Missing required tables: ${missing.join(", ")}`)

  const columns = await sql<{ table_name: string; column_name: string }[]>`
    select table_name, column_name from information_schema.columns
    where table_schema = 'public' and table_name in ${sql(expectedTables)}
  `
  const available = new Map<string, Set<string>>()
  for (const column of columns) {
    const set = available.get(column.table_name) ?? new Set<string>()
    set.add(column.column_name)
    available.set(column.table_name, set)
  }
  const missingColumns = expectedTables.flatMap((table) =>
    findMissingRequired(requiredColumns[table], available.get(table) ?? new Set()).map(
      (column) => `${table}.${column}`
    )
  )
  if (missingColumns.length) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`)
  }

  const indexes = await sql<{ indexname: string }[]>`
    select indexname from pg_indexes where schemaname = 'public'
  `
  const availableIndexes = new Set(indexes.map((index) => index.indexname))
  const missingIndexes = findMissingRequired(requiredIndexes, availableIndexes)
  if (missingIndexes.length) {
    throw new Error(`Missing required indexes: ${missingIndexes.join(", ")}`)
  }
  console.log(
    `Compatibility check passed (${expectedTables.length} required core tables, ${columns.length} core-table columns inspected, ${requiredIndexes.length} required indexes).`
  )
} finally {
  await sql.end()
}
