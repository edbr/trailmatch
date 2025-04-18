"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toPng } from "html-to-image"

const userLat = typeof window !== "undefined" ? localStorage.getItem("userLat") : null
const userLon = typeof window !== "undefined" ? localStorage.getItem("userLon") : null

type Trail = {
  id: string
  name: string
  location: string
  lat: number
  lon: number
  rating?: number
  mapUrl: string
  distance?: number
}

export default function TrailCard({ trail }: { trail: Trail }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [distanceText, setDistanceText] = useState<string | null>(null)
  const [isNearby, setIsNearby] = useState(false)

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

  useEffect(() => {
    if (!trail || typeof trail.distance !== "number") return
  
    const miles = trail.distance * 0.621371
    setDistanceText(`${miles.toFixed(1)} mi`)
    if (miles <= 2) {
      setIsNearby(true)
    }
  }, [trail?.distance])
  

  const handleShare = async () => {
    if (!cardRef.current) return
    const dataUrl = await toPng(cardRef.current)
    const blob = await (await fetch(dataUrl)).blob()

    const filesArray = [
      new File([blob], `${trail.name}.png`, {
        type: blob.type,
        lastModified: new Date().getTime(),
      }),
    ]

    if (navigator.share && navigator.canShare({ files: filesArray })) {
      try {
        await navigator.share({
          files: filesArray,
          title: trail.name,
          text: `Check out this trail: ${trail.name}`,
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      // fallback if share not supported
      const link = document.createElement("a")
      link.download = `${trail.name}.png`
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div ref={cardRef}>
      <Card className="transition-all">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{trail.name}</CardTitle>
            {distanceText && (
              <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                {distanceText}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {trail.location} · {trail.rating ? `⭐ ${trail.rating}` : ""}
          </p>
          <div className="flex gap-2 flex-wrap text-xs font-medium text-muted-foreground">
            {getTrailTags(trail.name).map((tag) => (
              <span key={tag} className="bg-muted px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
            {isNearby && (
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                🧭 Near You
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Image
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${trail.lat},${trail.lon}&zoom=14&size=600x300&maptype=terrain&markers=color:red%7C${trail.lat},${trail.lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`}
            alt={`Map preview for ${trail.name}`}
            width={600}
            height={300}
            className="rounded-xl w-full object-cover border shadow-sm"
          />
          <div className="flex justify-between items-center">
            <a
              href={trail.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline"
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
