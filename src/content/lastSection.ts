// Remembers the most recently opened section so the landing page knows which card is morphing back.
let lastSection: string | null = null

export function getLastSection() {
  return lastSection
}

export function setLastSection(slug: string) {
  lastSection = slug
}
