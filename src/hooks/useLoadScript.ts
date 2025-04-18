// hooks/useLoadScript.ts
import { useEffect, useState } from "react"

export function useLoadGoogleScript() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (document.getElementById("google-maps")) {
      setLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
    script.async = true
    script.id = "google-maps"
    script.onload = () => setLoaded(true)

    document.body.appendChild(script)
  }, [])

  return loaded
}
