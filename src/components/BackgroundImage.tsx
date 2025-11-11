"use client"

import { useEffect, useState } from "react"

interface BackgroundImageProps {
  src: string | null
}

export default function BackgroundImage({ src }: BackgroundImageProps) {
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({
    opacity: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "none",
    transition: "opacity 0.6s ease-out",
  })

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.src = src

    const handleLoad = () => {
      // swap instantly, then fade in
      setBgStyle((prev) => ({
        ...prev,
        backgroundImage: `url(${src})`,
        opacity: 0, // reset fade
      }))
      requestAnimationFrame(() =>
        setBgStyle((prev) => ({
          ...prev,
          opacity: 1,
        }))
      )
    }

    // decode() isn’t always available (Safari)
    if ("decode" in img && typeof img.decode === "function") {
      img.decode().then(handleLoad).catch(() => handleLoad())
    } else {
      img.onload = handleLoad
    }
  }, [src])

  return (
    <div
      className="absolute inset-0 w-full h-full bg-black/40 overflow-hidden"
      style={bgStyle}
    >
      <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-15 bg-[url('/noise.png')] bg-repeat" />
    </div>
  )
}
