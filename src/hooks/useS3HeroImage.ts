"use client"

import { useCallback, useEffect } from "react"
import { preloadImage } from "@/lib/preloadImage"

// All your public S3 hero images
const heroImages = [
  "https://trailmatch.s3.us-east-2.amazonaws.com/alain-bonnardeaux-Zd6h7n442Og-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/allphoto-bangkok-HIzHy1FS_GI-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/anes-el-bardoudi-IAGXZM7Av24-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/clemens-van-lay-U87mkpuPlJ0-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/cristian-vieriu-vEArMceumaI-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/daniel-diemer-dlJ_Igwm6A4-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/davi-costa-4lWIQ43CCmM-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/engjell-gjepali-M0OIyN5u8ZM-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/florian-wehde-8bjnP3yhNTg-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/giuseppe-mondi-K0VLuATuQ9o-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/ignacio-estevo-xAMfQn0tWoE-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/josh-hild-qCL7YbQ8DkE-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/luis-diego-aguilar-DEnsSdJHVkk-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/maksym-harbar-2tm8_o9OOrY-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/manuel-cosentino-n--CMLApjfI-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/matt-busse-nhltCS68spc-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/miris-navarro-fDnlXYa3hLs-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/nienke-burgers-0uN0N4q-W-o-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/paul-berthelon-bravo-XlRqfmEjO0E-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/raph-howald-GSCtoEEqntQ-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/sam-chang-L6xHmv2R3G4-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/sergey-pesterev-i-P1lmY_e1w-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/shawn-dd_hrEMsF2o-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/tim-oun-eX0bG2fSDys-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/tom-dils-ZEraBEoSRSw-unsplash.jpg",
  "https://trailmatch.s3.us-east-2.amazonaws.com/transly-translation-agency-IcWOh2prgu4-unsplash.jpg",
]

export function useS3HeroImage(setBgImage: (url: string) => void) {
  const fetchS3Image = useCallback(async () => {
    try {
      const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)]
      await preloadImage(randomImage)
      setBgImage(randomImage)
    } catch (err: any) {
      console.error("S3 hero image fetch error:", err?.message || err)
    }
  }, [setBgImage])

  useEffect(() => {
    fetchS3Image()
  }, [fetchS3Image])

  return { fetchS3Image }
}
