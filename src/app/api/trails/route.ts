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

  function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180
  
    const R = 6371 // km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // distance in km
  }
  
  
  const trails = (data.results as GooglePlace[])
  .map((place) => {
    const latNum = place.geometry.location.lat
    const lonNum = place.geometry.location.lng

    return {
      id: place.place_id,
      name: place.name,
      location: place.vicinity || "Unknown location",
      lat: latNum,
      lon: lonNum,
      rating: place.rating,
      distance: haversineDistance(Number(lat), Number(lon), latNum, lonNum),
      mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }
  })
  .sort((a, b) => a.distance - b.distance)

  

  return NextResponse.json(trails)
}
