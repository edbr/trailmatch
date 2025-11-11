"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function OutdoorNews() {
  const [news, setNews] = useState<
    { title?: string; link?: string; date?: string }[]
  >([])

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then(setNews)
      .catch(() => {
        // fallback content if API fails
        setNews([
          {
            title: "Explore the Best Fall Hiking Trails 🍂",
            link: "#",
            date: "Nov 2025",
          },
          {
            title: "Trail Etiquette: Sharing Paths with Bikers 🚴‍♀️",
            link: "#",
            date: "Nov 2025",
          },
        ])
      })
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex justify-center w-full px-4 mt-24 sm:mt-32"
    >
      <Card
        className="
          w-full max-w-4xl
          backdrop-blur-md
          bg-card/90 text-foreground
          border border-border
          rounded-2xl shadow-xl
          transition-colors
          dark:(bg-card/70 border-border/50)
        "
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-foreground">
            🗞️ Outdoor News
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Fresh stories from the outdoors.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {news.length > 0 ? (
            news.map((item, i) => (
              <div
                key={i}
                className="space-y-1 border-b border-border/50 pb-3 last:border-none"
              >
                <p className="text-base font-medium text-foreground">
                  {item.title || "Untitled"}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    Read more →
                  </a>
                )}
                {item.date && (
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Loading fresh stories...
            </p>
          )}
        </CardContent>
      </Card>
    </motion.section>
  )
}
