"use client"

import { FormEvent, RefObject, useState } from "react"
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
  loading?: boolean
}

export default function TrailSearchCard({
  typedLocation,
  setTypedLocation,
  inputRef,
  error,
  handleSubmit,
  loading = false,
}: TrailSearchCardProps) {
  const [vibe, setVibe] = useState("")

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center w-full px-0 sm:px-6 mt-16 sm:mt-28"
    >
      <Card className="w-full max-w-md sm:max-w-2xl bg-[hsl(var(--background))] border border-border shadow-lg rounded-2xl backdrop-blur-md dark:(bg-[hsl(var(--support))]/90 border-border/60)">
        {/* Logo header */}
        <CardHeader className="text-center pb-2 pt-4 sm:pt-0">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="TrailMatch logo"
              width={160}
              height={160}
              priority
              className="w-32 sm:w-44 h-auto"
            />
          </Link>
        </CardHeader>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-busy={loading}
          className="px-0 sm:px-0 pb-8"
        >
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Location input */}
            <div>
              <Label
                htmlFor="location"
                className="text-base text-foreground font-medium"
              >
                Add your location:
              </Label>

              <Input
                id="location"
                name="location"
                ref={inputRef}
                value={typedLocation}
                onChange={(e) => setTypedLocation(e.target.value)}
                placeholder="Enter a city, town, or park..."
                className="mt-2 h-14 w-full rounded-md border border-input text-lg
                           bg-[hsl(var(--background))] text-foreground placeholder:text-muted-foreground
                           focus:ring-2 focus:ring-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))]
                           transition dark:(bg-[hsl(var(--support))] border-border)"
              />

              {error && (
                <p className="mt-2 text-sm text-destructive text-center">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-semibold rounded-md
                         bg-[hsl(var(--accent))] text-[hsl(var(--support))]
                         hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--background))]
                         transition-all duration-200 shadow-[0_0_20px_rgba(215,255,0,0.3)]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Finding trails..." : "Find Trails"}
            </Button>

            {/* Vibe Dropdown */}
            <div>
              <Label
                htmlFor="vibe"
                className="block text-base font-medium text-foreground pt-1"
              >
                Choose by vibe:
              </Label>

              <select
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="mt-3 w-full h-14 rounded-md border border-border bg-[hsl(var(--background))]
                           text-[hsl(var(--secondary))] px-3 text-base
                           focus:ring-2 focus:ring-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))]
                           transition-colors duration-150"
              >
                <option value="">Select a vibe...</option>
                <option value="mountain">🏔️ Mountain Vibes</option>
                <option value="lake">🌊 Lake</option>
                <option value="forest">🌲 Into the Forest</option>
                <option value="surprise">🎯 Surprise me</option>
              </select>
            </div>
          </CardContent>
        </form>
      </Card>
    </motion.section>
  )
}
