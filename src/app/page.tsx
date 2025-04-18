"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"

export const dynamic = "force-dynamic"

declare global {
  interface Window {
    google: any
  }
}

export default function Home() {
  const router = useRouter()
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [error, setError] = useState("")
  const [bgImage, setBgImage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          setLat(lat.toString())
          setLon(lon.toString())
          localStorage.setItem("userLat", lat.toString())
          localStorage.setItem("userLon", lon.toString())
          const city = await reverseGeocode(lat, lon)
          if (city) {
            setLocationInput(city)
          }
        },
        () => console.log("Geolocation denied or failed.")
      )
    }
  }, [])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"]
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return

      const lat = place.geometry.location.lat()
      const lon = place.geometry.location.lng()
      setLat(lat.toString())
      setLon(lon.toString())
      setLocationInput(place.formatted_address || place.name)
    })
  }, [scriptLoaded])

  useEffect(() => {
    const fetchImage = async () => {
      // Always set fallback initially to prevent blank background
      setBgImage("/fallback.jpg")
  
      try {
        const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
        if (!key) throw new Error("Missing Unsplash access key")
  
        const query = locationInput || "lake tahoe"
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${key}`
        )
  
        if (!res.ok) throw new Error("Unsplash API request failed")
  
        const data = await res.json()
        if (data?.urls?.full) {
          setBgImage(data.urls.full)
        }
      } catch (err) {
        console.error("🔻 Unsplash failed. Using fallback image:", err)
        setBgImage("/fallback.jpg")
      }
    }
  
    fetchImage()
  }, [locationInput])
  
  

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
        const city = components.find((c: any) =>
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
    setError("")
    try {
      if (locationInput && locationInput.trim() !== "") {
        const result = await geocodeFallback()
        router.push(`/results?lat=${result.lat}&lon=${result.lng}`)
        return
      }
      if (lat && lon) {
        router.push(`/results?lat=${lat}&lon=${lon}`)
        return
      }
      setError("Enter a location or allow geolocation.")
    } catch {
      setError("We couldn't find that location.")
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <AnimatePresence mode="wait">
        {bgImage && (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/30 z-0" />

      {locationInput && (
        <div className="absolute top-4 right-4 z-10 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
          {locationInput}
        </div>
      )}

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
                ref={inputRef}
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
