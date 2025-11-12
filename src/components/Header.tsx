"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                 px-6 sm:px-12 md:px-24 lg:px-36 py-3
                 bg-gradient-to-b from-black/70 to-black/20 backdrop-blur-md border-b border-white/10"
    >
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Image
          src="/logoWhite.svg"
          alt="TrailMatch logo"
          width={110}
          height={110}
          priority
          className="w-24 sm:w-28 md:w-32 h-auto"
        />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
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

      {/* Desktop CTA */}
      <div className="hidden md:block">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 backdrop-blur-sm"
        >
          Sign In
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10
                     flex flex-col items-center gap-4 py-6 md:hidden"
        >
          <Link
            href="/about"
            className="text-white/90 hover:text-white text-base transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/explore"
            className="text-white/90 hover:text-white text-base transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            href="/contact"
            className="text-white/90 hover:text-white text-base transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Button>
        </div>
      )}
    </header>
  )
}
