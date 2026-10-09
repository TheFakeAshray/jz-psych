import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Frame } from './components/Frame'
import { SectionNav } from './components/SectionNav'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { ResourcesLayout } from './pages/ResourcesLayout'
import { Resources } from './pages/Resources'
import { Article } from './pages/Article'
import { Booking } from './pages/Booking'

// Articles live under /resources/:slug and should keep the resources frame mounted,
// so the key is the top-level section rather than the full path.
function frameKey(pathname: string) {
  const [section] = pathname.split('/').filter(Boolean)
  return section ? `/${section}` : '/'
}

function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <Frame>
        <AnimatePresence>
          {frameKey(location.pathname) !== '/' && <SectionNav key="sections" />}
        </AnimatePresence>
        <AnimatePresence>
          <Routes location={location} key={frameKey(location.pathname)}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<ResourcesLayout />}>
              <Route index element={<Resources />} />
              <Route path=":slug" element={<Article />} />
            </Route>
            <Route path="/booking" element={<Booking />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Frame>
    </MotionConfig>
  )
}

export default App
