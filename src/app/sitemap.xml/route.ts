// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://matchtrail.com"

  const pages = [
    "",            // homepage
    "/results",    // you can later dynamically list locations here
  ]

  const urls = pages.map((path) => {
    return `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>
    `.trim()
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls}
</urlset>`.trim()

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
