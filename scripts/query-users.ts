import "dotenv/config"
import postgres from "postgres"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")

const search = process.argv.slice(2).join(" ").trim()
const sql = postgres(process.env.DATABASE_URL, { prepare: false })
try {
  const rows = search
    ? await sql`
        select id, name, email, role, banned, created_at
        from "user"
        where email ilike ${`%${search}%`} or name ilike ${`%${search}%`}
        order by created_at desc
        limit 100
      `
    : await sql`
        select id, name, email, role, banned, created_at
        from "user"
        order by created_at desc
        limit 100
      `
  console.table(rows)
} finally {
  await sql.end()
}

