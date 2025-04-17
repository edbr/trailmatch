export function getTagIcon(tag: string) {
  switch (tag) {
    case "dog-friendly":
      return "🐶"
    case "kid-friendly":
    case "family-friendly":
      return "🧒"
    case "scenic":
      return "🌄"
    case "shaded":
      return "🌲"
    case "easy":
      return "🟢"
    case "moderate":
      return "🟡"
    case "challenging":
      return "🔴"
    default:
      return "🏞️"
  }
}
