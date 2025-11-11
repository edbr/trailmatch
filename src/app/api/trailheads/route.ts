import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  const query = "most popular trailheads in the world"

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    )

    if (!res.ok) throw new Error("Failed to fetch trailheads")

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Trailhead API error:", err)
    return NextResponse.json({ error: "Failed to fetch trailheads" }, { status: 500 })
  }
}
