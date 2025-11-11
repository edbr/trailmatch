"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
                 px-8 py-4 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white text-lg tracking-wide hover:text-green-300 transition-colors"
        >
          🥾 <span>TrailMatch</span>
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
