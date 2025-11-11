"use client"

import { FormEvent, RefObject } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

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
          bg-[hsl(var(--background))]
          border border-border
          shadow-xl
          rounded-xl
          transition
          dark:(bg-[hsl(var(--support))]/90 border-border/60)
        "
      >
        <CardHeader className="text-center pb-2">
           <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="TrailMatch logo"
            width={236}
            height={236}
            priority
          />
        </Link>

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
              placeholder="Enter a city, town, village ..."
              className="
                h-12 rounded-md border border-input bg-[hsl(var(--background))] text-foreground placeholder:text-muted-foreground
                focus:ring-2 focus:ring-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))]
                transition
                dark:(bg-[hsl(var(--support))] border-border)
              "
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              className="
                w-full
                py-5 text-base font-medium rounded-md transition
                bg-[hsl(var(--accent))]
                text-[hsl(var(--support))]
                hover:bg-[hsl(var(--secondary))]
                hover:text-[hsl(var(--background))]
                shadow-[0_0_20px_rgba(215,255,0,0.3)]
              "
            >
              Find Trails
            </Button>

            <Label htmlFor="vibe" className="block pt-2 text-foreground">
              Choose by vibe:
            </Label>

            <div className="flex flex-wrap justify-center mt-4 gap-3 text-sm text-muted-foreground">
              {[
                "🏔️ Mountain Vibes",
                "🌊 Lake",
                "🌲 Into the Forest",
                "🎯 Surprise me",
              ].map((label) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="
                    rounded-full px-5 py-2 border border-border transition-transform duration-200
                    bg-[hsl(var(--background))]
                    text-[hsl(var(--secondary))]
                    hover:scale-105 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--support))]
                  "
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </form>
      </Card>
    </motion.section>
  )
}
