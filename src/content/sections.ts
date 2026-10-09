import type { AppTheme } from '../theme/theme'

export type Tone = keyof AppTheme['colors']['tones']

export type Section = {
  slug: string
  path: string
  title: string
  prompt: string
  tone: Tone
}

export const sections: Section[] = [
  { slug: 'about', path: '/about', title: 'About', prompt: 'Meet the Psych', tone: 'blush' },
  { slug: 'services', path: '/services', title: 'Services', prompt: 'How can you help me?', tone: 'sand' },
  { slug: 'resources', path: '/resources', title: 'Resources', prompt: 'Guides & articles', tone: 'sage' },
  { slug: 'booking', path: '/booking', title: 'Booking', prompt: 'I’d like to book a session', tone: 'clay' },
]

export function getSection(slug: string): Section {
  const section = sections.find((s) => s.slug === slug)
  if (!section) throw new Error(`Unknown section: ${slug}`)
  return section
}
