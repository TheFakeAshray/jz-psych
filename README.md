# JZ Psych

Mobile-first website for the JZ Psych clinic.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [styled-components](https://styled-components.com) for styling
- [Radix UI](https://www.radix-ui.com) primitives (`radix-ui` package)
- [Motion](https://motion.dev) for animation, [React Router](https://reactrouter.com) for pages

## Structure

The site is a single, non-scrolling landing screen inside a terracotta frame (`src/components/Frame.tsx`). Each prompt card on the landing page (`src/pages/Landing.tsx`) shares a Motion `layoutId` with its page's `PageShell`, so tapping a card morphs it into the full page and Back morphs it home. Sections are defined in `src/content/sections.ts`.

To add a section: add it to `sections`, create a page in `src/pages` that wraps its content in `PageShell`, and add a route in `src/App.tsx`.

Hosting needs a single-page-app fallback (serve `index.html` for unknown paths) so links like `/about` work on refresh.

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Theming

All design tokens live in `src/theme/theme.ts`. The terracotta palette there is a placeholder — update the `palette` values and everything that uses `theme.colors.*` follows.

Styles are mobile first: write the small-screen styles by default and layer larger layouts with `theme.media.sm | md | lg` (min-width queries).
