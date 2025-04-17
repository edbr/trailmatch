import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const radius = searchParams.get("radius") || "20000"
  const keyword = searchParams.get("keyword") || "trail"

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&keyword=${keyword}&key=${apiKey}`

  const res = await fetch(endpoint)
  const data = await res.json()

  console.log("Google Places API raw response:", JSON.stringify(data, null, 2)) // 🔍 Log full result

  if (!data.results || !Array.isArray(data.results)) {
    return NextResponse.json({ error: "Unexpected API response" }, { status: 500 })
  }

  type GooglePlace = {
    place_id: string
    name: string
    vicinity: string
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
    rating?: number
  }
  
  const trails = (data.results as GooglePlace[]).map((place) => ({
    id: place.place_id,
    name: place.name,
    location: place.vicinity || "Unknown location",
    lat: place.geometry.location.lat,
    lon: place.geometry.location.lng,
    rating: place.rating,
    mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
  }))
  

  return NextResponse.json(trails)
}
