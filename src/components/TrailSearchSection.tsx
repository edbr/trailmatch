"use client"

import { useState, useRef, FormEvent } from "react"
import TrailSearchCard from "@/components/TrailSearchCard"
import { MostVisitedTrailheads, Trail } from "@/components/MostVisitedTrailheads"

export default function TrailSearchSection() {
  const [trails, setTrails] = useState<Trail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [typedLocation, setTypedLocation] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 👇 Call our fixed endpoint (no `.results` wrapper)
      const res = await fetch(`/api/trails?location=${typedLocation}`)
      const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        setTrails(data)
      } else {
        setError("No trails found. Try a nearby town or park.")
      }
    } catch (err) {
      console.error("❌ Trail fetch error:", err)
      setError("Failed to fetch trails.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full flex flex-col items-center justify-center">
      {/* Search input card */}
      <TrailSearchCard
        typedLocation={typedLocation}
        setTypedLocation={setTypedLocation}
        inputRef={inputRef}
        error={error}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      {/* Results */}
      <div className="mt-16 w-full max-w-6xl">
        <MostVisitedTrailheads trailheads={trails} loading={loading} />
      </div>
    </section>
  )
}
