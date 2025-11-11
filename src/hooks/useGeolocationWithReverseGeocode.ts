"use client"

import { useEffect } from "react"

interface AddressComponent {
  types: string[]
  long_name: string
  short_name: string
}

export function useGeolocationWithReverseGeocode(
  initialImageFetched: boolean,
  setInitialImageFetched: (v: boolean) => void,
  fetchUnsplashImage: (query: string) => void,
  setLat: (lat: string) => void,
  setLon: (lon: string) => void
) {
  useEffect(() => {
    const reverseGeocode = async (lat: number, lon: number): Promise<string | null> => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
        )
        const data = await res.json()
        const result = data.results?.[0]
        if (!result) return null

        const components = result.address_components as AddressComponent[]
        const city = components.find((c) =>
          c.types.includes("locality") || c.types.includes("sublocality")
        )?.long_name

        return city || result.formatted_address
      } catch (err) {
        console.error("Reverse geocoding failed", err)
        return null
      }
    }

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude
        const userLon = pos.coords.longitude
        setLat(userLat.toString())
        setLon(userLon.toString())

        localStorage.setItem("userLat", userLat.toString())
        localStorage.setItem("userLon", userLon.toString())

        const city = await reverseGeocode(userLat, userLon)
        if (city && !initialImageFetched) {
          fetchUnsplashImage(city)
          setInitialImageFetched(true)
        }
      },
      () => console.log("Geolocation denied or failed.")
    )
  }, [fetchUnsplashImage, initialImageFetched, setInitialImageFetched, setLat, setLon])
}
