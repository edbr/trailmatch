"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"


type Trail = {
  id: string
  name: string
  location: string
  lat: number
  lon: number
  rating?: number
  mapUrl: string
  tags?: string []
}

export default function ResultsClient() {
  const searchParams = useSearchParams()
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  const [trails, setTrails] = useState<Trail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!lat || !lon) return
    const fetchTrails = async () => {
      const res = await fetch(`/api/trails?lat=${lat}&lon=${lon}`)
      const data = await res.json()
      setTrails(data)
      setLoading(false)
    }

    fetchTrails()
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

  const getTrailTags = (name: string): string[] => {
    const tags: string[] = []
  
    const lower = name.toLowerCase()
  
    if (lower.includes("lake") || lower.includes("falls") || lower.includes("ridge")) {
      tags.push("✨ Scenic")
    }
    if (lower.includes("loop") || lower.includes("trail")) {
      tags.push("🥾 Good Walk")
    }
    if (lower.includes("dog") || lower.includes("pet")) {
      tags.push("🐾 Dog Friendly")
    }
    if (lower.includes("easy") || lower.includes("family") || lower.includes("park")) {
      tags.push("🧒 Kid Safe")
    }
  
    return tags
  }
  

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nearby Trails</h1>
        <Link href="/">
          <Button variant="outline">← Back to Search</Button>
        </Link>
      </div>

      {trails.length === 0 ? (
        <p className="text-muted-foreground">No trails found near this location.</p>
      ) : (
        trails.map((trail, i) => (
          <motion.div
          key={trail.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.4, delay: i * 0.05  }} // add `i` to your map loop if needed
        >   
          <Card className="transition-all" key={trail.id}>
            <CardHeader>
              <CardTitle>{trail.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {trail.location} · {trail.rating ? `⭐ ${trail.rating}` : ""}
              </p>
              <div className="flex gap-2 flex-wrap text-xs font-medium text-muted-foreground">
            {getTrailTags(trail.name).map((tag) => (
            <span key={tag} className="bg-muted px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
</div>
            </CardHeader>
            <CardContent className="space-y-2">
            <Image
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${trail.lat},${trail.lon}&zoom=14&size=600x300&maptype=terrain&markers=color:red%7C${trail.lat},${trail.lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
              alt={`Map preview for ${trail.name}`}
              width={600}
              height={300}
              className="rounded-xl w-full object-cover border shadow-sm"
            />
              <a
                href={trail.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline"
              >
                Open in Maps →
              </a>
            </CardContent>
          </Card>
          </motion.div>
        ))
      )}
    </main>
  )
}