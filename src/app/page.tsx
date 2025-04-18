"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

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
        async (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          setLat(lat.toString())
          setLon(lon.toString())
          const city = await reverseGeocode(lat, lon)
          if (city) {
            setLocationInput(city)
          }
        },
        () => console.log("Geolocation denied or failed.")
      )
    }
  }, [])

  const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
      )
      const data = await res.json()
      const result = data.results?.[0]
  
      if (result) {
        const components = result.address_components
        const city = components.find((c: { types: string[]; long_name: string }) =>
          c.types.includes("locality") || c.types.includes("sublocality")
        )?.long_name
        return city || result.formatted_address
      }
  
      return null
    } catch (err) {
      console.error("Reverse geocoding failed", err)
      return null
    }
  }
  

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

  const [bgImage, setBgImage] = useState<string | null>(null)

useEffect(() => {
  const fetchImage = async () => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=lake+tahoe&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      )
      
      const data = await res.json()
      setBgImage(data.urls.full)
    } catch (err) {
      console.error("Failed to fetch Unsplash image", err)
    }
  }

  fetchImage()
}, [])


  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* 🌄 Background image */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
    <div className="absolute inset-0 bg-black/30 z-0" />

      {/* 👇 Fade-in animation wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="w-full">
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
  
              <div className="flex flex-wrap gap-2 justify-center mt-4 text-sm text-muted-foreground">
                <Button variant="outline" size="sm">🏔️ Mountain</Button>
                <Button variant="outline" size="sm">🌊 Lake</Button>
                <Button variant="outline" size="sm">🌲 Forest</Button>
                <Button variant="outline" size="sm">🎯 Random</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </motion.div>
    </main>
  )  
}
