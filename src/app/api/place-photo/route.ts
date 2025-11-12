import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ref = searchParams.get("ref")
    const maxwidth = searchParams.get("maxwidth") || "800"

    // 🧠 IMPORTANT: use the SERVER key (not NEXT_PUBLIC)
    const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY

    if (!ref || !apiKey) {
      console.error("Missing photo reference or API key")
      return NextResponse.json({ error: "Missing photo reference or API key" }, { status: 400 })
    }

    // 1️⃣ Call the Place Photo endpoint
    const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${ref}&key=${apiKey}`

    // 2️⃣ Google returns a 302 redirect → follow it manually
    const res = await fetch(googleUrl, { redirect: "manual" })

    if (res.status === 302) {
      const redirectUrl = res.headers.get("location")
      if (redirectUrl) {
        const imageRes = await fetch(redirectUrl)
        const contentType = imageRes.headers.get("content-type") || "image/jpeg"
        const buffer = Buffer.from(await imageRes.arrayBuffer())

        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400", // 1 day cache
          },
        })
      }
    }

    // 3️⃣ Handle unexpected results
    console.error("Google photo fetch failed:", res.status, res.statusText)
    return NextResponse.json({ error: "Google photo fetch failed" }, { status: res.status })
  } catch (err) {
    console.error("❌ Failed to fetch photo:", err)
    return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 })
  }
}
