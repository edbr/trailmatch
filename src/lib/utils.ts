import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const waitForGoogleMaps = (): Promise<void> =>
  new Promise((resolve) => {
    if (window.google?.maps?.places) {
      resolve()
    } else {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    }
  })
