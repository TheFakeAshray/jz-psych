import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts.heading};
    line-height: 1.2;
    font-weight: 600;
  }

  img, picture, svg {
    display: block;
    max-width: 100%;
  }

  a {
    color: inherit;
  }

  button, input, textarea, select {
    font: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`
