// src/lib/preloadImage.ts
export function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = (err) => reject(new Error(`Failed to load image: ${url}`))
    img.crossOrigin = "anonymous"
    img.src = url
  })
}
