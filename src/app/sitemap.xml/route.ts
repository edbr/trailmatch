import { NextResponse } from "next/server"

export async function GET() {
  const domain = "https://matchtrail.com"
  const staticRoutes = ["", "/about", "/results"]
  const dynamicLocations = ["tahoe", "los-angeles", "bend", "moab", "boulder"] // example slugs

  const urls = [
    ...staticRoutes.map((path) => `${domain}${path}`),
    ...dynamicLocations.map((slug) => `${domain}/results/${slug}`),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `<url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
  </url>`
    )
    .join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
