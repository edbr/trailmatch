"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-24 w-full border-t border-border bg-card text-card-foreground">
      {/* Main content grid */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-[auto_auto_auto_1fr] gap-10 md:gap-20 text-sm">
        {/* Left: logo / identity */}
        <div className="flex flex-col items-start">
          <Image
            src="/logo.svg"
            alt="TrailMatch logo"
            width={140}
            height={140}
            className="object-contain mb-4"
          />
          <p className="text-muted-foreground text-sm max-w-xs">
            Discover your next trail — curated by nature, powered by AI.
          </p>
        </div>

        {/* Works / Explore links */}
        <div className="flex flex-col space-y-2">
          <h4 className="text-base font-semibold mb-3 text-foreground">Explore</h4>
          {["Top Trails", "Nearby", "Vibes", "Regions", "Articles"].map((label) => (
            <Link
              key={label}
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* About / Support links */}
        <div className="flex flex-col space-y-2">
          <h4 className="text-base font-semibold mb-3 text-foreground">About</h4>
          {["Our Story", "Press", "Contact", "Privacy", "Terms"].map((label) => (
            <Link
              key={label}
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Spacer (aligns grid on desktop) */}
        <div></div>
      </div>

{/* Bottom bar */}
<div className="border-t border-border/50 py-6 px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
  <p className="mb-3 md:mb-0">
    © {new Date().getFullYear()} TrailMatch — Designed by{" "}
    <Link
      href="https://edbelluti.com"
      target="_blank"
      className="font-medium hover:text-foreground transition-colors"
    >
      Eduardo Belluti
    </Link>
    .
  </p>

  <div className="flex gap-6 uppercase tracking-wide">
    <Link
      href="https://linkedin.com/in/edbelluti"
      target="_blank"
      className="hover:text-foreground transition-colors"
    >
      LinkedIn
    </Link>
    <Link
      href="https://edbelluti.com"
      target="_blank"
      className="hover:text-foreground transition-colors"
    >
      Website
    </Link>
    <Link
      href="https://github.com/edbr"
      target="_blank"
      className="hover:text-foreground transition-colors"
    >
      GitHub
    </Link>
  </div>
</div>

    </footer>
  )
}
