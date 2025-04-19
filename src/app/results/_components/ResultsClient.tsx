"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TrailCard from "@/components/TrailCard"
import { AnimatePresence, motion } from "framer-motion"

type Trail = {
  id: string
  name: string
  location: string
  lat: number
  lon: number
  rating?: number
  mapUrl: string
}

export default function ResultsClient() {
  const searchParams = useSearchParams()
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  const [trails, setTrails] = useState<Trail[]>([])
  const [loading, setLoading] = useState(true)
  const [bgImage, setBgImage] = useState<string | null>(null)

  useEffect(() => {
    if (!lat || !lon) return

    const fetchTrails = async () => {
      const res = await fetch(`/api/trails?lat=${lat}&lon=${lon}`)
      const data = await res.json()
      setTrails(data)
      setLoading(false)
    }

    fetchTrails()

    const storedBg = localStorage.getItem("bgImage")
    setBgImage(storedBg || "/fallback.jpg")
  }, [lat, lon])

  if (!lat || !lon) {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-muted-foreground">Missing coordinates.</p>
        <Link href="/">
          <Button className="mt-4">← Back to Search</Button>
        </Link>
      </main>
    )
  }

  if (loading) {
    return <main className="p-6 text-center">Loading trails...</main>
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen px-6 py-12 overflow-x-hidden overflow-y-auto"
    >
      {/* Fixed background */}
      <AnimatePresence>
        {bgImage && (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-cover bg-center opacity-80 pointer-events-none"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-0 pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white drop-shadow">Nearby Trails</h1>
          <Link href="/">
            <Button variant="outline">← Back to Search</Button>
          </Link>
        </div>

        {trails.length === 0 ? (
          <p className="text-white/80">No trails found near this location.</p>
        ) : (
          trails.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))
        )}
      </div>
    </motion.main>
  )
}
