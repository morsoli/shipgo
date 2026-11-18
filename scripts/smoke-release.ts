import "dotenv/config"

const baseUrl =
  process.env.SMOKE_BASE_URL ||
  process.env.APP_URL ||
  process.env.VITE_APP_URL ||
  "http://localhost:3000"

async function expectStatus(path: string, init: RequestInit, expected: number) {
  const response = await fetch(`${baseUrl}${path}`, init)
  if (response.status !== expected) {
    throw new Error(`${path} returned ${response.status}; expected ${expected}`)
  }
  console.log(`${path}: ${response.status}`)
  return response
}

async function expectText(path: string, expected: string) {
  const response = await expectStatus(path, { method: "GET" }, 200)
  const body = await response.text()
  if (!body.includes(expected)) {
    throw new Error(`${path} did not include ${JSON.stringify(expected)}`)
  }
}

async function expectRedirect(path: string, location: string) {
  const response = await expectStatus(path, { method: "GET", redirect: "manual" }, 307)
  if (response.headers.get("location") !== location) {
    throw new Error(`${path} redirected to ${response.headers.get("location")}; expected ${location}`)
  }
}

await expectStatus("/api/ping", { method: "GET" }, 200)
await expectText("/", '<html lang="en"')
await expectText("/zh", '<html lang="zh"')
await expectText("/robots.txt", `Sitemap: ${baseUrl}/sitemap.xml`)
await expectText("/sitemap.xml", `<loc>${baseUrl}/zh`)
await expectRedirect("/dashboard", "/login")
await expectRedirect("/zh/dashboard", "/zh/login")
await expectStatus("/api/credit/history", { method: "GET" }, 401)
await expectStatus(
  "/api/webhooks/stripe",
  { method: "POST", headers: { "stripe-signature": "invalid" }, body: "{}" },
  400
)
await expectStatus(
  "/api/webhooks/creem",
  { method: "POST", headers: { "creem-signature": "00" }, body: "{}" },
  400
)

console.log("Release smoke checks passed.")
