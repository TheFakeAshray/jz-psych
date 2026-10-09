import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './theme/GlobalStyle'
import { theme } from './theme/theme'
import App from './App.tsx'

// Vite's BASE_URL has a trailing slash; React Router's basename must not.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
