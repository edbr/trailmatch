"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export interface Trail {
  id?: string
  name: string
  location?: string
  photoUrl: string
  mapUrl?: string
}

interface MostVisitedTrailheadsProps {
  trailheads?: Trail[]
  loading?: boolean
}

export function MostVisitedTrailheads({
  trailheads: externalTrails,
  loading: externalLoading = false,
}: MostVisitedTrailheadsProps) {
  const [trailheads, setTrailheads] = useState<Trail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (externalTrails && externalTrails.length > 0) {
      setTrailheads(externalTrails)
      setLoading(externalLoading)
      return
    }

    const fetchTrailheads = async () => {
      try {
        const res = await fetch("/api/trailheads")
        const data = await res.json()

        if (data?.results) {
          const places: Trail[] = data.results.slice(0, 8).map((p: { place_id: string; name: string; vicinity?: string; photos?: { photo_reference: string }[] }) => ({
            id: p.place_id,
            name: p.name,
            location: p.vicinity || "Unknown",
            photoUrl: p.photos?.[0]
              ? `/api/place-photo?ref=${p.photos[0].photo_reference}&maxwidth=800`
              : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
            mapUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
          }))
          setTrailheads(places)
        }
      } catch (err) {
        console.error("Failed to fetch trailheads", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrailheads()
  }, [externalTrails, externalLoading])

  if (loading) {
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>Loading trailheads...</p>
      </section>
    )
  }

  if (!trailheads.length) return null

  return (
    <motion.section
      id="trail-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full py-20 bg-background border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="mb-10 text-center text-3xl font-semibold md:text-4xl">
          {externalTrails && externalTrails.length
            ? "Search Results"
            : "Popular Trailheads"}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trailheads.map((trail, i) => (
            <motion.a
              key={trail.id || trail.name}
              href={trail.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="block"
            >
              <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-border pt-0 transition-shadow duration-300 hover:shadow-md">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={trail.photoUrl}
                    alt={trail.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>

                <CardContent className="p-4 pt-3">
                  <h3 className="text-lg font-semibold">{trail.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {trail.location}
                  </p>
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-medium text-[hsl(var(--support))] bg-[hsl(var(--accent))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--background))] transition-colors">
                    Get&nbsp;Directions&nbsp;→
                  </span>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
