"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function OutdoorNews() {
  const [news, setNews] = useState<
    { title?: string; link?: string; date?: string }[]
  >([])

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then(setNews)
  }, [])

  return (
    <Card className="mt-8 backdrop-blur-md bg-white/90 text-black shadow-lg border border-white/20 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          🗞️ Outdoor News
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fresh stories from the outdoors.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, i) => (
          <div key={i} className="space-y-1 border-b pb-3 last:border-none">
            <p className="text-base font-medium">{item.title || "Untitled"}</p>
            <a
              href={item.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 hover:underline"
            >
              Read more →
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
