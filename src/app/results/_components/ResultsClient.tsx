"use client"

import { useEffect, useState, useRef, FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import ResultsSearchBar from "@/components/ResultsSearchBar"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

type Trail = {
  id: string
  name: string
  location: string
  lat: number
  lon: number
  rating?: number
  mapUrl: string
  photoUrl?: string
}

interface Props {
  location?: string
}

export default function ResultsClient({ location }: Props) {
  const searchParams = useSearchParams()
  const latParam = searchParams.get("lat")
  const lonParam = searchParams.get("lon")

  const [trails, setTrails] = useState<Trail[]>([])
  const [loading, setLoading] = useState(false)
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [distance, setDistance] = useState(25)
  const [typedLocation, setTypedLocation] = useState(location || "")
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch trail data
  const fetchTrails = async (lat: string, lon: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/trails?lat=${lat}&lon=${lon}&radius=${distance}`)
      const data = await res.json()
      setTrails(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Trail fetch error:", err)
      setTrails([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (latParam && lonParam) fetchTrails(latParam, lonParam)
    const storedBg = localStorage.getItem("bgImage")
    if (storedBg) setBgImage(storedBg)
  }, [latParam, lonParam])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Search:", typedLocation, distance)
    // Future: trigger a new geocode → fetchTrails(newLat, newLon)
  }

  return (
    <main className="min-h-screen flex flex-col bg-background relative">
      <Header />

      <ResultsSearchBar
        location={typedLocation}
        setLocation={setTypedLocation}
        distance={distance}
        setDistance={setDistance}
        onSearch={handleSearch}
        loading={loading}
        inputRef={inputRef}
      />

      {/* Hero background */}
      <AnimatePresence>
        {bgImage && (
          <motion.div
            key={bgImage}
            className="fixed inset-0 bg-cover bg-center opacity-50 pointer-events-none"
            style={{ backgroundImage: `url(${bgImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none z-0" />

      {/* Results section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 flex-1">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Trails near {typedLocation || "you"}
          </h1>
          <Link href="/">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-center py-10">
            Loading trails near {typedLocation}...
          </p>
        ) : trails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trails.map((trail, i) => (
              <motion.a
                key={trail.id || `${trail.name}-${i}`}
                href={trail.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="block"
              >
                <Card className="flex flex-col h-full overflow-hidden rounded-lg border border-border hover:shadow-lg transition-shadow duration-300 bg-[hsl(var(--background))]/95 pt-0">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={
                        trail.photoUrl ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800"
                      }
                      alt={trail.name}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 ">
                    <h3 className="font-semibold text-lg">{trail.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {trail.location || "Unknown location"}
                    </p>
                    <span className="inline-block rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--support))] text-xs font-medium px-3 py-1 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--background))] transition-colors">
                      Get&nbsp;Directions&nbsp;→
                    </span>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No trails found nearby.
          </p>
        )}
      </section>

      <Footer />
    </main>
  )
}
