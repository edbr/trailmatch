import { NextResponse } from "next/server"

interface GooglePlace {
  place_id: string
  name: string
  vicinity?: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  photos?: { photo_reference: string }[]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const miles = Number(searchParams.get("radius")) || 25
    const radius = miles * 1609 // convert miles → meters

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY
    if (!apiKey) throw new Error("Missing GOOGLE_PLACES_SERVER_KEY")

    // 1️⃣ Multiple search passes to capture more trailheads
    const searchCombos = [
      { keyword: "trailhead", type: "point_of_interest" },
      { keyword: "hiking trail", type: "point_of_interest" },
      { keyword: "nature trail", type: "point_of_interest" },
      { keyword: "park", type: "park" },
      { keyword: "preserve", type: "point_of_interest" },
    ]

    let results: GooglePlace[] = []

    for (const combo of searchCombos) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&keyword=${encodeURIComponent(
        combo.keyword
      )}&type=${combo.type}&key=${apiKey}`

      const res = await fetch(url)
      const data: { status: string; results?: GooglePlace[] } = await res.json()

      console.log(`🔍 ${combo.keyword}: ${data.results?.length || 0} (${data.status})`)
      if (data.status === "OK" && data.results) {
        results.push(...data.results)
      }
    }

    // 2️⃣ Deduplicate by place_id
    results = Array.from(new Map(results.map((p) => [p.place_id, p])).values())

    // 3️⃣ Filter trail-related names
    results = results.filter(
      (p) =>
        /(trail|trailhead|path|nature|park|preserve)/i.test(p.name) &&
        !/(hotel|store|gas|restaurant|school|church|office|real estate|golf|parking)/i.test(p.name)
    )

    if (results.length === 0) {
      console.warn("⚠️ No trail-like results found.")
      return NextResponse.json({ error: "ZERO_RESULTS" }, { status: 404 })
    }

    // 4️⃣ Convert to frontend format
    const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371
      const toRad = (x: number) => (x * Math.PI) / 180
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }

    const trails = results.map((place: GooglePlace) => {
      const latNum = place.geometry.location.lat
      const lonNum = place.geometry.location.lng
      const difficulties = ["Easy", "Moderate", "Hard"]
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)]
      const elevation = Math.floor(300 + Math.random() * 1200)

      return {
        id: place.place_id,
        name: place.name,
        location: place.vicinity || "Unknown",
        lat: latNum,
        lon: lonNum,
        rating: place.rating || 0,
        distance: haversine(Number(lat), Number(lon), latNum, lonNum),
        elevation,
        difficulty: randomDifficulty,
        mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        photoUrl: place.photos?.[0]
          ? `/api/place-photo?ref=${place.photos[0].photo_reference}&maxwidth=800`
          : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
      }
    })

    return NextResponse.json(trails.sort((a, b) => a.distance - b.distance))
  } catch (error) {
    console.error("🚨 Error fetching trails:", error)
    return NextResponse.json({ error: "Failed to fetch trails" }, { status: 500 })
  }
}
