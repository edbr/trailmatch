"use client"

import { useState, FormEvent, RefObject } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete"

interface Props {
  location: string
  setLocation: (val: string) => void
  distance: number
  setDistance: (val: number) => void
  loading: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onSearch: (e: FormEvent<HTMLFormElement>) => void
}

export default function ResultsSearchBar({
  location,
  setLocation,
  distance,
  setDistance,
  loading,
  inputRef,
  onSearch, // ✅ properly destructured
}: Props) {
  const router = useRouter()
  const [lat, setLat] = useState("")
  const [lon, setLon] = useState("")


  // ✅ Initialize autocomplete
  useGooglePlacesAutocomplete( inputRef!, setLat, setLon, setLocation, setLocation, () => {})

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!lat || !lon) return
    router.push(`/results/${encodeURIComponent(location)}?lat=${lat}&lon=${lon}&radius=${distance}`)
    onSearch(e) // ✅ call external handler if provided
  }

  return (
    <header className="w-full sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 py-3"
      >
        {/* ✅ Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logoWhite.svg" alt="TrailMatch logo" width={142} height={142} priority />
        </Link>

        {/* ✅ Search bar */}
        <div
          className="
            flex flex-1 items-center gap-2 bg-[hsl(var(--background))]
            border border-border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all
          "
        >
          <Input
            ref={inputRef}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search trailheads, parks, or cities..."
            className="h-10 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">within</span>
            <Input
              type="number"
              min={1}
              max={200}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-16 h-8 rounded-md border border-input bg-transparent text-center text-sm"
            />
            <span className="text-sm text-muted-foreground">mi</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="
              h-10 px-6 rounded-full font-medium
              bg-[hsl(var(--accent))]
              text-[hsl(var(--support))]
              hover:bg-[hsl(var(--secondary))]
              hover:text-[hsl(var(--background))]
              shadow-[0_0_15px_rgba(215,255,0,0.3)]
              disabled:opacity-60
            "
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
    </header>
  )
}
