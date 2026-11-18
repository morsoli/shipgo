import { closeDb } from "../src/db"
import { runCreditMaintenance } from "../src/services/credit-distribution.service"

try {
  const result = await runCreditMaintenance()
  console.log(JSON.stringify(result, null, 2))
} finally {
  await closeDb()
}
