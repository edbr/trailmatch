"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="footer-note">
      Made with ❤️ by{" "}
      <Link
        href="https://edbelluti.com"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        Eduardo Belluti
      </Link>
    </footer>
  )
}
