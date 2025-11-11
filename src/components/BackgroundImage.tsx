"use client"

import { useEffect, useState } from "react"

interface BackgroundImageProps {
  src: string | null
}

/**
 * Absolutely flicker-free background image component.
 * - Preloads next image fully before swapping.
 * - Only one DOM node is ever rendered.
 * - Single fade-in handled after decode().
 */
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
    img.decode
      ? img.decode().then(() => swapBackground(src))
      : (img.onload = () => swapBackground(src))

    function swapBackground(url: string) {
      // swap instantly, then fade in
      setBgStyle((prev) => ({
        ...prev,
        backgroundImage: `url(${url})`,
        opacity: 0, // reset fade
      }))

      requestAnimationFrame(() =>
        setBgStyle((prev) => ({
          ...prev,
          opacity: 1,
        }))
      )
    }
  }, [src])

  return (
    <div
      className="absolute inset-0 w-full h-full bg-black/30 overflow-hidden"
      style={bgStyle}
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-15 bg-[url('/noise.png')] bg-repeat" />
    </div>
  )
}
