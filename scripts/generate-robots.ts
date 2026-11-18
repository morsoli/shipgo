import fs from "node:fs"
import path from "node:path"
import "dotenv/config"

const baseUrl = (process.env.VITE_APP_URL || process.env.APP_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
)

const robots = `User-agent: *
Allow: /
Disallow: /*?*q=
Disallow: /admin/*
Disallow: /api/*

Sitemap: ${baseUrl}/sitemap.xml
`

fs.writeFileSync(path.join(process.cwd(), "public/robots.txt"), robots)
console.log(`Generated public/robots.txt for ${baseUrl}`)
