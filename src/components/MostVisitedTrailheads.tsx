"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface Trailhead {
  name: string
  vicinity: string
  photoUrl?: string
}

export function MostVisitedTrailheads() {
  const [trailheads, setTrailheads] = useState<Trailhead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrailheads = async () => {
      try {
        const res = await fetch("/api/trailheads")
        const data = await res.json()
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

        if (data?.results) {
          const places = data.results.slice(0, 8).map((place: any) => ({
            name: place.name,
            vicinity: place.formatted_address,
            photoUrl: place.photos?.[0]
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
              : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
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
  }, [])

  if (loading) {
    return (
      <section className="py-20 text-center text-muted-foreground">
        <p>Loading top trailheads...</p>
      </section>
    )
  }

  return (
    <section className="w-full py-20 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center">
          Most Visited Trailheads Near You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trailheads.map((trail, i) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              trail.name
            )}`

            return (
              <motion.a
                key={trail.name}
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="block"
              >
              <Card className="flex flex-col h-full rounded-lg overflow-hidden border border-border hover:shadow-md transition-shadow duration-300 pt-0">
                <div className="relative aspect-[4/3] w-full">
                    <Image
                    src={trail.photoUrl!}
                    alt={trail.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    />
                </div>

               <CardContent className="p-4 pt-3">
                        <h3 className="font-semibold text-lg">{trail.name}</h3>
                        <p className="mb-3 text-sm text-muted-foreground">{trail.vicinity}</p>

                        <div className="flex flex-wrap gap-2">
                            <span
                            className="
                                inline-block
                                rounded-full
                                px-3 py-1
                                text-xs font-medium
                                text-[hsl(var(--support))]
                                bg-[hsl(var(--accent))]
                                transition-colors
                                hover:bg-[hsl(var(--secondary))]
                                hover:text-[hsl(var(--background))]
                            "
                            >
                            Get&nbsp;Directions&nbsp;→
                            </span>
                        </div>
                        </CardContent>
                </Card>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
