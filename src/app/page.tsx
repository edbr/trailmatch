"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import TrailSearchCard from "@/components/TrailSearchCard"
import OutdoorNews from "@/components/OutdoorNews"
import { Footer } from "@/components/Footer"
import Header from "@/components/Header"
import BackgroundImage from "@/components/BackgroundImage"
import { MostVisitedTrailheads } from "@/components/MostVisitedTrailheads"

import { useS3HeroImage } from "@/hooks/useS3HeroImage"
import { useUnsplashImage } from "@/hooks/useUnsplashImage"
import { useGeolocationWithReverseGeocode } from "@/hooks/useGeolocationWithReverseGeocode"
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete"

export default function Home() {
  const router = useRouter()
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")
  const [error, setError] = useState("")
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [typedLocation, setTypedLocation] = useState("")
  const [initialImageFetched, setInitialImageFetched] = useState(false)
  const [, setConfirmedLocation] = useState("")

  const { fetchS3Image } = useS3HeroImage(setBgImage)
  const { fetchUnsplashImage } = useUnsplashImage(setBgImage)

  // 1️⃣ Show fast S3 background first
  useEffect(() => {
    if (!initialImageFetched) {
      fetchS3Image()
      setInitialImageFetched(true)
    }
  }, [fetchS3Image, initialImageFetched])

  // 2️⃣ Handle geolocation image when permission granted
  useGeolocationWithReverseGeocode(
    initialImageFetched,
    setInitialImageFetched,
    fetchUnsplashImage, // Unsplash when user allows location
    setLat,
    setLon
  )

  // 3️⃣ Load Google Places script
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

  // 4️⃣ Unsplash on typed search
  useGooglePlacesAutocomplete(
    scriptLoaded,
    inputRef,
    setLat,
    setLon,
    setTypedLocation,
    setConfirmedLocation,
    fetchUnsplashImage
  )

  // 5️⃣ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedLocation && !lat)
      return setError("Enter a location or allow geolocation.")
    router.push(`/results/${typedLocation || "location"}?lat=${lat}&lon=${lon}`)
  }

  return (
    <>
      <Header />

      {/* 🏔️ Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden">
        {/* Background + fade */}
        <BackgroundImage src={bgImage} />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />

        {/* Centered card */}
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
      <MostVisitedTrailheads />
      {/* Rest of page */}
      <OutdoorNews />
      <Footer />
    </>
  )
}
