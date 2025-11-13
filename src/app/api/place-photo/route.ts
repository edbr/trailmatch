import { NextResponse } from "next/server"

export const runtime = "edge" // ⚡️faster streaming and lower latency

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ref = searchParams.get("ref")
    const maxwidth = searchParams.get("maxwidth") || "800"
    const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY

    if (!ref || !apiKey) {
      return NextResponse.json(
        { error: "Missing photo reference or API key" },
        { status: 400 }
      )
    }

    // 1️⃣ Build the Place Photo URL (Google will redirect)
    const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${ref}&key=${apiKey}`

    // 2️⃣ Request HEAD only — follow redirect manually
    const headRes = await fetch(googleUrl, { method: "HEAD", redirect: "manual" })
    const redirectUrl = headRes.headers.get("location")

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "Photo redirect URL missing" },
        { status: 404 }
      )
    }

    // 3️⃣ Proxy directly without buffering (stream)
    const imageRes = await fetch(redirectUrl, { cache: "force-cache" })
    if (!imageRes.ok) {
      return NextResponse.json(
        { error: "Image fetch failed" },
        { status: imageRes.status }
      )
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg"
    const stream = imageRes.body

    return new NextResponse(stream, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    console.error("❌ Failed to fetch photo:", err)
    return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 })
  }
}
