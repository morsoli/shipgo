import "dotenv/config"
import postgres from "postgres"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")

const shouldApply = process.argv.includes("--apply")
const sql = postgres(process.env.DATABASE_URL, { prepare: false })
try {
  const rows = await sql`
    select id, user_id, external_invoice_id, status, settled, created_at
    from shipgo_billing_order
    where (settled = true and status not in ('active', 'completed', 'trialing'))
       or external_invoice_id is null
    order by created_at desc
  `
  console.table(rows)
  if (shouldApply) {
    const result = await sql`
      update shipgo_billing_order
      set status = 'completed', updated_at = now()
      where settled = true and status not in ('active', 'completed', 'trialing')
    `
    console.log(`Updated ${result.count} settled billing orders to completed.`)
  } else {
    console.log("Dry run only. Review rows and pass --apply to normalize settled order statuses.")
  }
} finally {
  await sql.end()
}
