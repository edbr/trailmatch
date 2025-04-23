"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"
import OutdoorNews from "@/app/_components/OutdoorNews"

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
  const [error, setError] = useState("")
  const [bgImage, setBgImage] = useState<string>("/fallback.jpg")
  const inputRef = useRef<HTMLInputElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [typedLocation, setTypedLocation] = useState("")
  const [, setConfirmedLocation] = useState("")
  const [initialImageFetched, setInitialImageFetched] = useState(false)

  const fetchUnsplashImage = useCallback(async (query: string) => {
    try {
      const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${key}`

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Unsplash fetch failed with status: ${res.status}`)
      }

      const data = await res.json()
      const imageUrl = data?.urls?.full

      if (imageUrl) {
        await preloadImage(imageUrl)
        setBgImage(imageUrl)
        if (typeof window !== "undefined") {
          localStorage.setItem("bgImage", imageUrl)
        }
      }
    } catch (err) {
      console.error("Unsplash fetch error:", err)
    }
  }, [])

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
        if (city && !initialImageFetched) {
          fetchUnsplashImage(city)
          setInitialImageFetched(true)
        }
      },
      () => console.log("Geolocation denied or failed.")
    )
  }, [fetchUnsplashImage, initialImageFetched])

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
      const locationName = (place.name || "trail").toLowerCase().replace(/\s+/g, "-")
      setTypedLocation(locationName)
      setConfirmedLocation(locationName)
      fetchUnsplashImage(locationName)
    })
  }, [scriptLoaded, fetchUnsplashImage])

  const preloadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = reject
      img.src = url
    })
  }

  const geocodeFallback = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(typedLocation)}&key=${apiKey}`
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
      if (typedLocation.trim()) {
        const loc = await geocodeFallback()
        router.push(`/results/${typedLocation}?lat=${loc.lat}&lon=${loc.lng}`)
      } else if (lat && lon) {
        router.push(`/results/${typedLocation || "location"}?lat=${lat}&lon=${lon}`)
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
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/30 z-0" />

      {typedLocation && (
        <div className="absolute top-4 right-4 z-10 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
          {typedLocation}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="w-full backdrop-blur-md bg-white/80 border border-white/20 shadow-lg rounded-2xl">
        <CardHeader>
            <CardTitle>🎒 Trail Match</CardTitle>
            <p className="text-sm">
            Find trailheads near you
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Label htmlFor="location">Add your location:</Label>
              <Input   className="rounded-lg border border-white/60 bg-white/90 text-black placeholder-gray-500 shadow-md focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                id="location"
                name="location"
                placeholder="Enter a trailhead, park, or town"
                value={typedLocation}
                onChange={(e) => setTypedLocation(e.target.value)}
                ref={inputRef}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg">
                Find Trails
              </Button>
              <br></br>
              <Label htmlFor="location">Choose by vibe:</Label>
              <div className="flex flex-wrap gap-2 justify-center mt-4 text-sm text-muted-foreground">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">🏔️ Mountain Vibes</Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">🌊 Lake</Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">🌲 Into the Forest</Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">🎯 Surprise me</Button>
              </div>
            </CardContent>
          </form>
        </Card>
        <OutdoorNews />

        <p className="mt-4 text-center text-sm text-white/70"> Made with ❤️ by{" "}
        <a
          href="https://edbelluti.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Eduardo Belluti
        </a>
      </p>

      </motion.div>
    </main>
  )
}
