"use client"

import { FormEvent, RefObject } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface TrailSearchCardProps {
  typedLocation: string
  setTypedLocation: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
  error: string
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function TrailSearchCard({
  typedLocation,
  setTypedLocation,
  inputRef,
  error,
  handleSubmit,
}: TrailSearchCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center w-full px-4 mt-32 sm:mt-40 md:mt-48"
    >
      <Card
        className="
          w-full max-w-5xl
          backdrop-blur-md
          bg-card/90
          border border-border
          shadow-xl
          rounded-xl
          transition
          dark:(bg-card/70 border-border/50)
        "
      >
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-semibold text-foreground">
            Trail Match
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Find trailheads near you
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Label htmlFor="location" className="text-foreground">
              Add your location:
            </Label>

            <Input
              id="location"
              name="location"
              ref={inputRef}
              value={typedLocation}
              onChange={(e) => setTypedLocation(e.target.value)}
              placeholder="Enter a trailhead, park, or town"
              className="
                h-12 rounded-md border border-input bg-input/70 text-foreground placeholder:text-muted-foreground
                focus:ring-2 focus:ring-ring focus:border-ring transition
                dark:(bg-input/30 border-border)
              "
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              className="
                w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-5 text-base transition
                dark:(bg-primary/80 hover:bg-primary)
              "
            >
              Find Trails
            </Button>

            <Label htmlFor="vibe" className="block pt-2 text-foreground">
              Choose by vibe:
            </Label>

            <div className="flex flex-wrap gap-3 justify-center mt-4 text-sm text-muted-foreground">
              {["🏔️ Mountain Vibes", "🌊 Lake", "🌲 Into the Forest", "🎯 Surprise me"].map(
                (label) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="sm"
                    className="
                      border border-border hover:scale-105 transition-transform
                      bg-accent/50 hover:bg-accent
                      text-accent-foreground
                      rounded-full px-5 py-2
                    "
                  >
                    {label}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </motion.section>
  )
}
