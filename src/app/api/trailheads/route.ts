import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat") || "37.7749" // Default: SF
    const lon = searchParams.get("lon") || "-122.4194"
    const radius = searchParams.get("radius") || "25000" // 25km

    const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY
    if (!apiKey) throw new Error("Missing GOOGLE_PLACES_SERVER_KEY")

    // We’ll try trail-related searches first, then parks if needed
    const searchCombos = [
      { keyword: "trailhead", type: "point_of_interest" },
      { keyword: "hiking trail", type: "point_of_interest" },
      { keyword: "nature trail", type: "point_of_interest" },
      { keyword: "park", type: "park" },
    ]

    let results: any[] = []
    let lastStatus = "ZERO_RESULTS"

    for (const combo of searchCombos) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&keyword=${encodeURIComponent(
        combo.keyword
      )}&type=${combo.type}&key=${apiKey}`

      const res = await fetch(url)
      const data = await res.json()
      lastStatus = data.status

      if (data.status === "OK" && data.results.length > 0) {
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
      (place: any) =>
        place.photos &&
        !/(hotel|store|gas|restaurant|church|real estate|school)/i.test(place.name)
    )

    return NextResponse.json({ results: filtered })
  } catch (error) {
    console.error("❌ Failed to fetch trailheads:", error)
    return NextResponse.json({ error: "Failed to fetch trailheads" }, { status: 500 })
  }
}
