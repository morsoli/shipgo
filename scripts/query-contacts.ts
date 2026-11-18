import "dotenv/config"
import { getNewsletterStatus } from "../src/services/newsletter.service"

const emails = process.argv.slice(2)
if (emails.length === 0) throw new Error("Pass one or more email addresses")

for (const email of emails) {
  try {
    console.log(JSON.stringify({ email, subscribed: await getNewsletterStatus(email) }))
  } catch (error) {
    console.error(
      JSON.stringify({
        email,
        error: error instanceof Error ? error.message : "Unable to query contact",
      })
    )
  }
}

