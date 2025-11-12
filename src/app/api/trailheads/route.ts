import { NextResponse } from "next/server"

// Define an interface for Google Places results
interface GooglePlace {
  place_id: string
  name: string
  vicinity?: string
  geometry?: { location: { lat: number; lng: number } }
  rating?: number
  photos?: { photo_reference: string }[]
  types?: string[]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat") || "37.7749" // Default: SF
    const lon = searchParams.get("lon") || "-122.4194"
    const radius = searchParams.get("radius") || "25000" // 25 km

    const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY
    if (!apiKey) throw new Error("Missing GOOGLE_PLACES_SERVER_KEY")

    const searchCombos = [
      { keyword: "trailhead", type: "point_of_interest" },
      { keyword: "hiking trail", type: "point_of_interest" },
      { keyword: "nature trail", type: "point_of_interest" },
      { keyword: "park", type: "park" },
    ]

    let results: GooglePlace[] = []
    let lastStatus = "ZERO_RESULTS"

    for (const combo of searchCombos) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&keyword=${encodeURIComponent(
        combo.keyword
      )}&type=${combo.type}&key=${apiKey}`

      const res = await fetch(url)
      const data: { status: string; results?: GooglePlace[] } = await res.json()
      lastStatus = data.status

      if (data.status === "OK" && data.results && data.results.length > 0) {
        results = data.results
        break
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: lastStatus, message: "No trails found nearby" },
        { status: 404 }
      )
    }

    // ✅ Filter out irrelevant places & only keep those with photos
    const filtered = results.filter(
      (place: GooglePlace) =>
        place.photos &&
        !/(hotel|store|gas|restaurant|church|real estate|school)/i.test(place.name)
    )

    return NextResponse.json({ results: filtered })
  } catch (error) {
    console.error("❌ Failed to fetch trailheads:", error)
    return NextResponse.json(
      { error: "Failed to fetch trailheads" },
      { status: 500 }
    )
  }
}
