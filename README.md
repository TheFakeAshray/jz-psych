# Jacinta Eve Psychology

Mobile-first website for Jacinta Eve Psychology. The project and package name stay `jz-psych`.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [styled-components](https://styled-components.com) for styling
- [Radix UI](https://www.radix-ui.com) primitives (`radix-ui` package)
- [Motion](https://motion.dev) for animation, [React Router](https://reactrouter.com) for pages

## Structure

The site is a single, non-scrolling landing screen inside a terracotta frame (`src/components/Frame.tsx`). Each prompt card on the landing page (`src/pages/Landing.tsx`) shares a Motion `layoutId` with its page's `PageShell`, so tapping a card morphs it into the full page and Back morphs it home. Sections are defined in `src/content/sections.ts`.

To add a section: add it to `sections`, create a page in `src/pages` that wraps its content in `PageShell`, and add a route in `src/App.tsx`.

Resources live in `src/content/resources.ts`. Guides are PDFs grouped by issue (parenting, grief, relationships, anxiety, depression). Put a file in `public/resources/` and set its `file` path to turn on the download. Articles are writing; each one is listed on the resources page and published at `/resources/<slug>`.

The site deploys to GitHub Pages on every push to `main` (`.github/workflows/pages.yml`). The built site is also copied to `404.html` so routes like `/about` still load when refreshed.

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Theming

All design tokens live in `src/theme/theme.ts`. The terracotta palette there is a placeholder — update the `palette` values and everything that uses `theme.colors.*` follows.

Styles are mobile first: write the small-screen styles by default and layer larger layouts with `theme.media.sm | md | lg` (min-width queries).
