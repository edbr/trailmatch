"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    google: typeof google
  }
}

export function useGooglePlacesAutocomplete(
  scriptLoaded: boolean,
  inputRef: React.RefObject<HTMLInputElement | null>,
  setLat: (val: string) => void,
  setLon: (val: string) => void,
  setTypedLocation: (val: string) => void,
  setConfirmedLocation: (val: string) => void,
  fetchUnsplashImage: (query: string) => void
) {
  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return
    const googleMaps = window.google
    if (!googleMaps?.maps?.places?.Autocomplete) return

    const autocomplete = new googleMaps.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"]
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace() as google.maps.places.PlaceResult
      if (!place.geometry?.location) return

      const placeLat = place.geometry.location.lat()
      const placeLon = place.geometry.location.lng()
      setLat(placeLat.toString())
      setLon(placeLon.toString())

      const locationName = (place.name || "trail").toLowerCase().replace(/\s+/g, "-")
      setTypedLocation(locationName)
      setConfirmedLocation(locationName)
      fetchUnsplashImage(locationName)
    })
  }, [scriptLoaded, fetchUnsplashImage, inputRef, setLat, setLon, setTypedLocation, setConfirmedLocation])
}
