"use client"

import { useCallback } from "react"
import { preloadImage } from "@/lib/preloadImage"

export function useUnsplashImage(setBgImage: (url: string) => void) {
  const fetchUnsplashImage = useCallback(async (query: string) => {
    try {
      const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      if (!key) throw new Error("Missing Unsplash key")

      const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${key}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Unsplash fetch failed: ${res.status}`)

      const data = await res.json()
      const imageUrl = data?.urls?.full

      if (imageUrl) {
        await preloadImage(imageUrl)
        setBgImage(imageUrl)
        if (typeof window !== "undefined") {
          localStorage.setItem("bgImage", imageUrl)
        }
      }
    } catch (err) {
      console.error("Unsplash fetch error:", err)
    }
  }, [setBgImage])

  return { fetchUnsplashImage }
}
