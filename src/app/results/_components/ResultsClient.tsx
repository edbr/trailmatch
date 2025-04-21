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

interface Props {
  location?: string
}

export default function ResultsClient({ location }: Props) {
  const searchParams = useSearchParams()
  const latParam = searchParams.get("lat")
  const lonParam = searchParams.get("lon")

  const [trails, setTrails] = useState<Trail[]>([])
  const [loading, setLoading] = useState(true)
  const [bgImage, setBgImage] = useState<string | null>(null)

  useEffect(() => {
    if (!latParam || !lonParam) {
      console.warn("❗ Missing lat/lon, skipping API fetch")
      setLoading(false)
      return
    }

    const lat = latParam
    const lon = lonParam

    const fetchTrails = async () => {
      try {
        console.log("📡 Fetching trails for:", { lat, lon })
        const res = await fetch(`/api/trails?lat=${lat}&lon=${lon}`)

        if (!res.ok) {
          const errorText = await res.text()
          console.error("❌ Trail API request failed:", res.status, errorText)
          setLoading(false)
          return
        }

        const data = await res.json()
        if (!Array.isArray(data)) {
          console.error("⚠️ API returned unexpected format:", data)
          setTrails([])
          setLoading(false)
          return
        }

        console.log("✅ Trails fetched:", data)
        setTrails(data)
      } catch (err) {
        console.error("🚨 Error fetching trails:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrails()

    const storedBg = localStorage.getItem("bgImage")
    if (storedBg) {
      setBgImage(storedBg)
    }
  }, [latParam, lonParam, location])

  const hasCoords = latParam && lonParam

  if (!hasCoords && !location) {
    return (
      <main className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-muted-foreground">Missing location data.</p>
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

      <div className="fixed inset-0 bg-black/30 z-0 pointer-events-none" />

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
