"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
export const dynamic = "force-dynamic"

export default function Home() {
  const router = useRouter()
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toString())
          setLon(pos.coords.longitude.toString())
        },
        () => console.log("Geolocation denied or failed.")
      )
    }
  }, [])

  const geocodeFallback = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationInput
      )}&key=${apiKey}`
    )
    const data = await res.json()
    const result = data.results?.[0]
    if (result) {
      const loc = result.geometry.location
      setLat(loc.lat.toString())
      setLon(loc.lng.toString())
      return loc
    } else {
      throw new Error("Location not found")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!lat || !lon) {
        if (!locationInput) {
          setError("Enter a location or allow geolocation.")
          return
        }
        const result = await geocodeFallback()
        router.push(`/results?lat=${result.lat}&lon=${result.lng}`)
      } else {
        router.push(`/results?lat=${lat}&lon=${lon}`)
      }
    } catch {
      setError("We couldn't find that location.")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🎒 TrailMatch</CardTitle>
          <p className="text-sm text-muted-foreground">
            Find trails near your location or search by place.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Enter city or point of interest"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Find Trails
            </Button>
          </CardContent>
        </form>
      </Card>
    </main>
  )
}
