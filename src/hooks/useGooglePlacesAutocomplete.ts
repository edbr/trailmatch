"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    google: typeof google
  }
}

/**
 * Hook: Initializes Google Places Autocomplete on an input element.
 *
 * @param inputRef - Ref to the input element
 * @param setLat - Setter for latitude string
 * @param setLon - Setter for longitude string
 * @param setTypedLocation - Updates the live typed location
 * @param setConfirmedLocation - Updates when user confirms a location
 * @param fetchUnsplashImage - Fetches a background image for the location
 */
export function useGooglePlacesAutocomplete(
  inputRef: React.RefObject<HTMLInputElement | null>,
  setLat: (val: string) => void,
  setLon: (val: string) => void,
  setTypedLocation: (val: string) => void,
  setConfirmedLocation: (val: string) => void,
  fetchUnsplashImage: (query: string) => void
) {
  useEffect(() => {
    if (!inputRef.current) return

    let autocomplete: google.maps.places.Autocomplete | null = null
    let intervalId: NodeJS.Timeout | null = null

    const initAutocomplete = () => {
      if (!window.google?.maps?.places?.Autocomplete || !inputRef.current) return

      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
      })

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete?.getPlace()
        if (!place?.geometry?.location) return

        const lat = place.geometry.location.lat()
        const lon = place.geometry.location.lng()
        setLat(lat.toString())
        setLon(lon.toString())

        const name =
          place.name?.toLowerCase().replace(/\s+/g, "-") || "trail"
        setTypedLocation(name)
        setConfirmedLocation(name)
        fetchUnsplashImage(name)
      })
    }

    // Retry until the Google API is ready
    intervalId = setInterval(() => {
      if (window.google?.maps?.places?.Autocomplete) {
        clearInterval(intervalId!)
        initAutocomplete()
      }
    }, 300)

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (autocomplete) google.maps.event.clearInstanceListeners(autocomplete)
    }
  }, [
    inputRef,
    setLat,
    setLon,
    setTypedLocation,
    setConfirmedLocation,
    fetchUnsplashImage,
  ])
}
