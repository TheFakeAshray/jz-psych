import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Frame } from './components/Frame'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Resources } from './pages/Resources'
import { Booking } from './pages/Booking'

function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <Frame>
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Frame>
    </MotionConfig>
  )
}

export default App
