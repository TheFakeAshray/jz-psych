import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type TargetAndTransition } from 'motion/react'
import styled from 'styled-components'
import { Frame } from './components/Frame'
import { TransitionCutContext } from './components/PageShell'
import { SectionNav } from './components/SectionNav'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { ResourcesLayout } from './pages/ResourcesLayout'
import { Resources } from './pages/Resources'
import { Article } from './pages/Article'
import { BookingLayout } from './pages/Booking'
import { ease } from './theme/motion'

// Articles live under /resources/:slug and should keep the resources frame mounted,
// so the key is the top-level section rather than the full path.
function frameKey(pathname: string) {
  const [section] = pathname.split('/').filter(Boolean)
  return section ? `/${section}` : '/'
}

const sectionSlide = { duration: 0.6, ease }

function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const key = frameKey(location.pathname)
  const busyUntil = useRef(0)
  const presenceGeneration = useRef(0)
  // Recorded once per key so a strict-mode rerender doesn't treat the same
  // change as an interruption and skip the slide.
  const decision = useRef({ key, slide: false, generation: 0, cut: false })
  const [, setPresenceTick] = useState(0)
  if (decision.current.key !== key) {
    const now = performance.now()
    const fromSection = decision.current.key !== '/' && key !== '/'
    const interrupt = now < busyUntil.current
    const slide = fromSection && !interrupt && reduceMotion !== true
    if (reduceMotion !== true) {
      busyUntil.current = now + (slide ? sectionSlide.duration * 1000 : 700)
    }
    if (interrupt) presenceGeneration.current += 1
    decision.current = { key, slide, generation: presenceGeneration.current, cut: interrupt }
  }
  const { slide, generation, cut } = decision.current
  const holdRef = useRef(false)
  holdRef.current = slide

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const switches = [...document.querySelectorAll('[data-section-switch]')]
      const visible = switches.some((el) => {
        const heading = el.querySelector('h1')
        if (!heading) return false
        const box = heading.getBoundingClientRect()
        let opacity = 1
        let node: Element | null = heading
        while (node && node !== document.body) {
          opacity = Math.min(opacity, Number.parseFloat(getComputedStyle(node).opacity))
          node = node.parentElement
        }
        return opacity > 0.2 && box.height > 8 && box.bottom > 0 && box.top < window.innerHeight
      })
      if (switches.length < 2 && visible) return
      presenceGeneration.current += 1
      decision.current = { ...decision.current, slide: false, cut: true, generation: presenceGeneration.current }
      setPresenceTick((tick) => tick + 1)
    }, 1200)
    return () => window.clearTimeout(timeout)
  }, [key])

  return (
    <MotionConfig reducedMotion="user">
      <TransitionCutContext.Provider value={cut}>
      <Frame>
        <AnimatePresence>
          {key !== '/' && <SectionNav key="sections" />}
        </AnimatePresence>
        <AnimatePresence key={generation} initial={false}>
          <SectionSwitch
            key={key}
            data-section-switch=""
            initial={slide ? { y: '-100%' } : false}
            animate={{ y: '0%', zIndex: 2 }}
            exit={
              (() =>
                holdRef.current
                  ? { y: '100%', opacity: 1, zIndex: 0, pointerEvents: 'none' as const, transition: sectionSlide }
                  : { y: '0%', opacity: 1, zIndex: 0, pointerEvents: 'auto' as const, transition: { duration: 0.01 } }) as unknown as TargetAndTransition
            }
            transition={sectionSlide}
          >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<ResourcesLayout />}>
              <Route index element={<Resources />} />
              <Route path=":slug" element={<Article />} />
            </Route>
            <Route path="/booking" element={<BookingLayout />}>
              <Route index element={null} />
              <Route path="existing" element={null} />
              <Route path="new" element={null} />
              <Route path="*" element={<Navigate to="/booking" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </SectionSwitch>
        </AnimatePresence>
      </Frame>
      </TransitionCutContext.Provider>
    </MotionConfig>
  )
}

const SectionSwitch = styled(motion.div)`
  position: absolute;
  inset: 0;
`

export default App
