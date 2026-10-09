// Placeholder terracotta palette — swap these values once the final colours are chosen.
const palette = {
  terracotta: {
    50: '#fbf3ef',
    100: '#f5e1d7',
    200: '#ebc2ae',
    300: '#dd9c7f',
    400: '#cf7856',
    500: '#c2603d',
    600: '#a84d30',
    700: '#8a3e29',
    800: '#6d3324',
    900: '#4f261c',
  },
  sand: {
    50: '#fbf8f4',
    100: '#f4ede4',
    200: '#e8dccb',
  },
  sage: {
    300: '#a9b8a0',
    500: '#6f8466',
  },
  ink: {
    900: '#2a211d',
    700: '#4a3d37',
    500: '#776860',
  },
  white: '#ffffff',
}

// A lighter tint of a page background, for cards sitting on that page.
const lift = (color: string) => `color-mix(in srgb, ${color}, ${palette.white} 38%)`

export const theme = {
  colors: {
    background: palette.sand[50],
    surface: palette.white,
    surfaceMuted: palette.sand[100],
    border: palette.sand[200],
    text: palette.ink[900],
    textMuted: palette.ink[500],
    primary: palette.terracotta[500],
    primaryHover: palette.terracotta[600],
    primarySoft: palette.terracotta[100],
    onPrimary: palette.white,
    accent: palette.sage[500],
    tones: {
      blush: { bg: palette.terracotta[100], fg: palette.ink[900], card: lift(palette.terracotta[100]) },
      sand: { bg: palette.sand[200], fg: palette.ink[900], card: lift(palette.sand[200]) },
      sage: { bg: palette.sage[300], fg: palette.ink[900], card: lift(palette.sage[300]) },
      clay: { bg: palette.terracotta[700], fg: palette.white, card: lift(palette.terracotta[700]) },
    },
    palette,
  },
  fonts: {
    body: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
    heading: `'Fraunces', Georgia, 'Times New Roman', serif`,
  },
  fontSizes: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.375rem',
    '2xl': '1.75rem',
    '3xl': 'clamp(2rem, 6vw, 3rem)',
  },
  space: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
  },
  radii: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    pill: '999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(42, 33, 29, 0.06)',
    md: '0 6px 20px rgba(42, 33, 29, 0.08)',
  },
  layout: {
    maxWidth: '1120px',
    frame: '10px',
    frameLg: '16px',
    screenRadius: 14,
    // Numeric so Motion can correct border radius during layout animations.
    cardRadius: 20,
  },
  // Mobile first: style for small screens by default, then use these as min-width queries.
  media: {
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    // The 760px column leaves a clear left margin beside the section boxes.
    side: '@media (min-width: 1200px)',
  },
} as const

export type AppTheme = typeof theme
