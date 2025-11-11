"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"


export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
                 px-36 py-4 bg-gradient-to-b from-black/60 to-black/10 backdrop-blur-md border-b"
    >
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logoWhite.svg"
            alt="TrailMatch logo"
            width={136}
            height={136}
            priority
          />
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            About
          </Link>
          <Link
            href="/explore"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/contact"
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* CTA */}
      <Button
        size="sm"
        variant="secondary"
        className="bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 backdrop-blur-sm"
      >
        Sign In
      </Button>
    </header>
  )
}
