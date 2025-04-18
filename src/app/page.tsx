"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"

export const dynamic = "force-dynamic"

/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google
  }
}


interface AddressComponent {
  types: string[]
  long_name: string
  short_name: string
}

export default function Home() {
  const router = useRouter()
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [error, setError] = useState("")
  const [bgImage, setBgImage] = useState<string>("/fallback.jpg")
  const inputRef = useRef<HTMLInputElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
        )
        const data = await res.json()
        const result = data.results?.[0]
        if (!result) return null

        const components = result.address_components as AddressComponent[]
        const city = components.find((c: AddressComponent) =>
          c.types.includes("locality") || c.types.includes("sublocality")
        )?.long_name

        return city || result.formatted_address
      } catch (err) {
        console.error("Reverse geocoding failed", err)
        return null
      }
    }

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude
        const userLon = pos.coords.longitude
        setLat(userLat.toString())
        setLon(userLon.toString())
        localStorage.setItem("userLat", userLat.toString())
        localStorage.setItem("userLon", userLon.toString())
        const city = await reverseGeocode(userLat, userLon)
        if (city) setLocationInput(city)
      },
      () => console.log("Geolocation denied or failed.")
    )
  }, [])

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    )

    if (existingScript) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return

    const googleMaps = window.google
    if (!googleMaps?.maps?.places?.Autocomplete) return

    const autocomplete = new googleMaps.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"]
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace() as google.maps.places.PlaceResult
      if (!place.geometry || !place.geometry.location) return

      const placeLat = place.geometry.location.lat()
      const placeLon = place.geometry.location.lng()
      setLat(placeLat.toString())
      setLon(placeLon.toString())
      setLocationInput(place.formatted_address || place.name || "")
    })
  }, [scriptLoaded])

  useEffect(() => {
    const fetchImage = async () => {
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
        if (data?.urls?.full) setBgImage(data.urls.full)
      } catch (err) {
        console.error("Unsplash failed. Using fallback image:", err)
        setBgImage("/fallback.jpg")
      }
    }

    fetchImage()
  }, [locationInput])

  const geocodeFallback = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationInput)}&key=${apiKey}`
    )
    const data = await res.json()
    const result = data.results?.[0]
    if (!result) throw new Error("Location not found")

    const loc = result.geometry.location
    setLat(loc.lat.toString())
    setLon(loc.lng.toString())
    return loc
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (locationInput.trim()) {
        const loc = await geocodeFallback()
        router.push(`/results?lat=${loc.lat}&lon=${loc.lng}`)
      } else if (lat && lon) {
        router.push(`/results?lat=${lat}&lon=${lon}`)
      } else {
        setError("Enter a location or allow geolocation.")
      }
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