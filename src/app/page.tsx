"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import BackgroundImage from "@/components/BackgroundImage"
import TrailSearchCard from "@/components/TrailSearchCard"
import { MostVisitedTrailheads } from "@/components/MostVisitedTrailheads"
import OutdoorNews from "@/components/OutdoorNews"

import { useS3HeroImage } from "@/hooks/useS3HeroImage"
import { useUnsplashImage } from "@/hooks/useUnsplashImage"
import { useGeolocationWithReverseGeocode } from "@/hooks/useGeolocationWithReverseGeocode"
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete"

export default function Home() {
  const router = useRouter()

  // 🗺️ Location + image state
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [typedLocation, setTypedLocation] = useState("")
  const [, setConfirmedLocation] = useState("")
  const [error, setError] = useState("")
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [initialImageFetched, setInitialImageFetched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 🏔️ Hooks for background images
  const { fetchS3Image } = useS3HeroImage(setBgImage)
  const { fetchUnsplashImage } = useUnsplashImage(setBgImage)

  // 1️⃣ Show fast S3 hero first
  useEffect(() => {
    if (!initialImageFetched) {
      fetchS3Image()
      setInitialImageFetched(true)
    }
  }, [fetchS3Image, initialImageFetched])

  // 2️⃣ Reverse geocode user location → fetch Unsplash city image
  useGeolocationWithReverseGeocode(
    initialImageFetched,
    setInitialImageFetched,
    fetchUnsplashImage,
    setLat,
    setLon
  )

  // 3️⃣ Enable Google Places Autocomplete
  useGooglePlacesAutocomplete(
    inputRef,
    setLat,
    setLon,
    setTypedLocation,
    setConfirmedLocation,
    fetchUnsplashImage // ✅ update hero image on search
  )

  // 4️⃣ Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedLocation && !lat) {
      setError("Enter a location or allow geolocation.")
      return
    }

    router.push(`/results/${typedLocation || "location"}?lat=${lat}&lon=${lon}`)
  }

  // 🧭 Render
  return (
    <>
      <Header />

      {/* 🏞️ Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden">
        {/* Background */}
        <BackgroundImage src={bgImage} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />

        {/* Search */}
        <div className="relative z-20 w-full max-w-3xl px-6 sm:px-8">
          <TrailSearchCard
            typedLocation={typedLocation}
            setTypedLocation={setTypedLocation}
            inputRef={inputRef}
            error={error}
            handleSubmit={handleSubmit}
          />
        </div>
      </section>

      {/* 🌍 Dynamic Content */}
      <MostVisitedTrailheads />
      <OutdoorNews />
      <Footer />
    </>
  )
}
