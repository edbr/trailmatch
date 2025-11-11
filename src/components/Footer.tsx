"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-24 w-full border-t border-border bg-card text-card-foreground">
      {/* Main content grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 text-sm sm:px-8 md:grid-cols-[auto_auto_auto_1fr] md:gap-20 md:py-20">
        {/* Logo + tagline */}
        <div className="flex flex-col items-start">
          <Image
            src="/logo.svg"
            alt="TrailMatch logo"
            width={140}
            height={140}
            className="mb-4 object-contain"
          />
          <p className="max-w-xs text-sm text-muted-foreground">
            Discover your next trail — curated by nature, powered by AI.
          </p>
        </div>

        {/* Explore links */}
        <nav
          aria-label="Explore links"
          className="flex flex-col space-y-2 text-muted-foreground"
        >
          <h4 className="mb-3 text-base font-semibold text-foreground">
            Explore
          </h4>
          {["Top Trails", "Nearby", "Vibes", "Regions", "Articles"].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="text-sm transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        {/* About links */}
        <nav
          aria-label="About links"
          className="flex flex-col space-y-2 text-muted-foreground"
        >
          <h4 className="mb-3 text-base font-semibold text-foreground">
            About
          </h4>
          {["Our Story", "Press", "Contact", "Privacy", "Terms"].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="text-sm transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        {/* Spacer for grid alignment */}
        <div />
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between border-t border-border/50 px-6 py-6 text-xs text-muted-foreground sm:px-8 md:flex-row">
        <p className="mb-3 text-center md:mb-0 md:text-left">
          © {new Date().getFullYear()} TrailMatch — Designed by{" "}
          <Link
            href="https://edbelluti.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-foreground"
          >
            Eduardo Belluti
          </Link>
          .
        </p>

        <div className="flex gap-6 uppercase tracking-wide">
          <Link
            href="https://linkedin.com/in/edbelluti"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </Link>
          <Link
            href="https://edbelluti.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Website
          </Link>
          <Link
            href="https://github.com/edbr"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
