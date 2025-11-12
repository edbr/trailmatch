"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toPng } from "html-to-image"

type Trail = {
  id: string
  name: string
  location: string
  lat: number
  lon: number
  rating?: number
  mapUrl: string
  distance?: number
  elevation?: number
  difficulty?: string
}

// 🏷️ Simple keyword-based tag generator
const getTrailTags = (name: string): string[] => {
  const tags: string[] = []
  const lower = name.toLowerCase()

  if (lower.includes("lake") || lower.includes("falls") || lower.includes("ridge"))
    tags.push("✨ Scenic")
  if (lower.includes("loop") || lower.includes("trail"))
    tags.push("🥾 Good Walk")
  if (lower.includes("dog") || lower.includes("pet"))
    tags.push("🐾 Dog Friendly")
  if (lower.includes("easy") || lower.includes("family") || lower.includes("park"))
    tags.push("🧒 Kid Safe")

  return tags
}

export default function TrailCard({ trail }: { trail: Trail }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [distanceText, setDistanceText] = useState<string | null>(null)
  const [isNearby, setIsNearby] = useState(false)

  // 🌍 Format and detect proximity
  useEffect(() => {
    if (typeof trail.distance !== "number") return
    const miles = trail.distance * 0.621371
    setDistanceText(`${miles.toFixed(1)} mi`)
    setIsNearby(miles <= 2)
  }, [trail.distance])

  // 📸 Share card or download fallback
  const handleShare = async () => {
    if (!cardRef.current) return

    try {
      const dataUrl = await toPng(cardRef.current)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `${trail.name}.png`, { type: blob.type })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: trail.name,
          text: `Check out this trail: ${trail.name}`,
        })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(trail.mapUrl)
        alert("Trail link copied to clipboard!")
      } else {
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = `${trail.name}.png`
        link.click()
      }
    } catch (err) {
      console.error("Error sharing card:", err)
    }
  }

  return (
    <div ref={cardRef}>
      <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/60 bg-background/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{trail.name}</CardTitle>
            {distanceText && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {distanceText}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {trail.location} {trail.rating && `· ⭐ ${trail.rating.toFixed(1)}`}
          </p>

          {/* 🏷️ Tags */}
          <div className="flex flex-wrap gap-2 mt-2 text-xs font-medium text-muted-foreground">
            {getTrailTags(trail.name).map((tag) => (
              <span
                key={tag}
                className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {isNearby && (
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                🧭 Near You
              </span>
            )}
            {trail.elevation && (
              <span className="bg-muted px-2 py-0.5 rounded-full">
                ⛰️ {trail.elevation} ft
              </span>
            )}
            {trail.difficulty && (
              <span className="bg-muted px-2 py-0.5 rounded-full">
                🎚️ {trail.difficulty}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Image
            unoptimized
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${trail.lat},${trail.lon}&zoom=13&size=600x300&maptype=terrain&markers=color:red%7C${trail.lat},${trail.lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
            alt={`Map preview for ${trail.name}`}
            width={600}
            height={300}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800"
            }}
            className="w-full h-auto rounded-xl border border-border object-cover shadow-sm"
          />

          <div className="flex items-center justify-between">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${trail.lat},${trail.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline text-[hsl(var(--secondary))] hover:text-[hsl(var(--accent))]"
            >
              Open in Maps →
            </a>
            <Button variant="outline" size="sm" onClick={handleShare}>
              📸 Share Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
