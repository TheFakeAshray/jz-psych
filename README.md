# JZ Psych

Mobile-first website for the JZ Psych clinic.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [styled-components](https://styled-components.com) for styling
- [Radix UI](https://www.radix-ui.com) primitives (`radix-ui` package)

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Theming

All design tokens live in `src/theme/theme.ts`. The terracotta palette there is a placeholder — update the `palette` values and everything that uses `theme.colors.*` follows.

Styles are mobile first: write the small-screen styles by default and layer larger layouts with `theme.media.sm | md | lg` (min-width queries).
