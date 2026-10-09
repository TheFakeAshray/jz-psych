import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'motion/react'
import styled from 'styled-components'
import { setLastSection } from '../content/lastSection'
import { siteName } from '../content/site'
import type { Section, Tone } from '../content/sections'
import { ease, morph } from '../theme/motion'
import { paperTexture } from '../theme/paper'
import { theme } from '../theme/theme'
import { Container } from './Container'

type PageShellProps = {
  section: Section
  children: ReactNode
  backTo?: string
  backLabel?: string
  label?: string
  title?: string
  // When set, the page body slides between keys instead of fading in once.
  // Positive direction brings the next view in from the right.
  slideKey?: string
  slideDirection?: number
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, zIndex: 1 }),
  center: { x: '0%', opacity: 1, zIndex: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    zIndex: 0,
    pointerEvents: 'none' as const,
  }),
}

const slideTransition = { duration: 0.75, ease }
// Content waits 0.25s, then fades for 0.5s. Back stays quiet until that settles.
const pageEntranceMs = 750

// Set when a navigation cuts an in-flight transition, so the page that lands
// shows its text immediately instead of fading in over an empty shell.
export const TransitionCutContext = createContext(false)

export function PageShell({
  section,
  children,
  backTo = '/',
  backLabel = 'Back',
  label,
  title,
  slideKey,
  slideDirection = 1,
}: PageShellProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const grainShift = useMotionValue(0)
  const grainPosition = useMotionTemplate`${grainShift}px 0px`
  const grainSeen = useRef(slideKey)
  const grainAnim = useRef<{ stop: () => void } | null>(null)
  const reduceMotion = useReducedMotion()
  const cut = useContext(TransitionCutContext)
  const heading = title ?? section.prompt
  const eyebrow = label ?? section.title
  const sliding = slideKey !== undefined
  const busyUntil = useRef(0)
  const slideBook = useRef({ key: slideKey, skip: false, generation: 0 })
  const [, setSlideClock] = useState(0)
  if (sliding && slideBook.current.key !== slideKey) {
    const skip = reduceMotion !== true && performance.now() < busyUntil.current
    if (reduceMotion !== true) busyUntil.current = performance.now() + slideTransition.duration * 1000
    slideBook.current = {
      key: slideKey,
      skip,
      generation: slideBook.current.generation + (skip ? 1 : 0),
    }
  }
  const { skip: skipSlide, generation: slideGeneration } = slideBook.current
  const entranceKey = sliding ? `slide:${slideKey}` : `page:${section.slug}`
  const [entrance, setEntrance] = useState(entranceKey)
  const [backReady, setBackReady] = useState(false)
  if (entrance !== entranceKey) {
    setEntrance(entranceKey)
    setBackReady(false)
  }

  useEffect(() => {
    setLastSection(section.slug)
    document.title = `${title ?? section.title} · ${siteName}`
    const scroller = sliding
      ? shellRef.current?.querySelector<HTMLElement>(`[data-slide-key="${CSS.escape(slideKey)}"]`)
      : shellRef.current
    scroller?.scrollTo({ top: 0 })
    const headingEl = scroller?.querySelector('h1')
    if (headingEl instanceof HTMLElement) headingEl.focus({ preventScroll: true })

    if (!sliding || reduceMotion || grainSeen.current === slideKey) return
    grainSeen.current = slideKey
    grainAnim.current?.stop()
    if (slideBook.current.skip) return
    const distance = shellRef.current?.clientWidth ?? 0
    grainAnim.current = animate(grainShift, grainShift.get() + (slideDirection > 0 ? -distance : distance), slideTransition)
  }, [section.slug, section.title, title, slideKey, sliding, reduceMotion, slideDirection, grainShift])

  useEffect(() => {
    if (reduceMotion || (sliding && skipSlide)) {
      setBackReady(true)
      return
    }
    const wait = sliding ? slideTransition.duration * 1000 : cut ? 200 : pageEntranceMs
    const timeout = window.setTimeout(() => setBackReady(true), wait)
    return () => window.clearTimeout(timeout)
  }, [entrance, reduceMotion, sliding, skipSlide, cut])

  useEffect(() => {
    if (!sliding) return
    const timeout = window.setTimeout(() => {
      const panels = [...(shellRef.current?.querySelectorAll('[data-slide-key]') ?? [])]
      const visible = panels.some((el) => {
        const box = el.getBoundingClientRect()
        return Number.parseFloat(getComputedStyle(el).opacity) > 0.5 && box.left < window.innerWidth - 8 && box.right > 8
      })
      if (panels.length < 2 && visible) return
      slideBook.current = { ...slideBook.current, skip: true, generation: slideBook.current.generation + 1 }
      setSlideClock((tick) => tick + 1)
    }, 1200)
    return () => window.clearTimeout(timeout)
  }, [slideKey, sliding])

  const body = (
    <PageBody
      backTo={backTo}
      backLabel={backLabel}
      backReady={backReady}
      eyebrow={eyebrow}
      heading={heading}
      clearNav={sliding}
    >
      {children}
    </PageBody>
  )

  return (
    <Shell
      layoutId={`section-${section.slug}`}
      layoutCrossfade={false}
      transition={morph}
      style={{ borderRadius: theme.layout.screenRadius + 1 }}
      $tone={section.tone}
    >
      {sliding ? (
        <SlideStage ref={shellRef} $tone={section.tone} style={reduceMotion ? undefined : { backgroundPosition: grainPosition }}>
          {reduceMotion ? (
            <SlidePanel data-slide-key={slideKey} $tone={section.tone}>
              {body}
            </SlidePanel>
          ) : (
            <AnimatePresence key={slideGeneration} initial={false} custom={slideDirection}>
              <SlidePanel
                key={slideKey}
                data-slide-key={slideKey}
                custom={slideDirection}
                variants={slideVariants}
                initial={skipSlide ? false : 'enter'}
                animate="center"
                exit="exit"
                transition={slideTransition}
                $tone={section.tone}
              >
                {body}
              </SlidePanel>
            </AnimatePresence>
          )}
        </SlideStage>
      ) : (
        <Scroller ref={shellRef}>
          <motion.div
            initial={cut ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: cut ? { duration: 0.2, ease } : { delay: 0.25, duration: 0.5, ease } }}
          >
            {body}
          </motion.div>
        </Scroller>
      )}
    </Shell>
  )
}

function PageBody({
  backTo,
  backLabel,
  backReady,
  eyebrow,
  heading,
  clearNav,
  children,
}: {
  backTo: string
  backLabel: string
  backReady: boolean
  eyebrow: string
  heading: string
  clearNav: boolean
  children: ReactNode
}) {
  return (
    <Content $clearNav={clearNav}>
      <BackLink
        to={backTo}
        aria-disabled={backReady ? undefined : true}
        tabIndex={backReady ? undefined : -1}
        onClick={(event) => {
          if (!backReady) event.preventDefault()
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        {backLabel}
      </BackLink>
      <Label>{eyebrow}</Label>
      <Title tabIndex={-1}>{heading}</Title>
      <div>{children}</div>
    </Content>
  )
}

// Bleeds 1px past the frame so the frame's clip, not the shell's own antialiased edge,
// forms the visible corner; otherwise a light hairline shows at the rounded corners.
const Shell = styled(motion.div)<{ $tone: Tone }>`
  position: absolute;
  inset: -1px;
  z-index: 1;
  background-color: ${({ theme, $tone }) => theme.colors.tones[$tone].bg};
  color: ${({ theme, $tone }) => theme.colors.tones[$tone].fg};
  ${paperTexture}
`

const SlideStage = styled(motion.div)<{ $tone: Tone }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: ${({ theme, $tone }) => theme.colors.tones[$tone].bg};
  ${paperTexture}
`

const SlidePanel = styled(motion.div)<{ $tone: Tone }>`
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  color: ${({ theme, $tone }) => theme.colors.tones[$tone].fg};
  scrollbar-width: thin;
  background: transparent;
`

const Scroller = styled.div`
  position: absolute;
  inset: 0 0 5.25rem;
  overflow-y: auto;
  scrollbar-width: thin;

  ${({ theme }) => theme.media.side} {
    inset: 0;
  }
`

const Content = styled(Container)<{ $clearNav?: boolean }>`
  max-width: 760px;
  padding-block: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[12]};

  ${({ theme }) => theme.media.md} {
    padding-top: ${({ theme }) => theme.space[8]};
    padding-bottom: ${({ theme }) => theme.space[16]};
  }

  ${({ $clearNav, theme }) =>
    $clearNav &&
    `
      padding-bottom: calc(${theme.space[12]} + 5.25rem);

      ${theme.media.side} {
        padding-bottom: ${theme.space[16]};
      }
    `}
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-height: 44px;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: 1px solid currentColor;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 500;
  text-decoration: none;
`

const Label = styled.p`
  margin-top: ${({ theme }) => theme.space[12]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
`

const Title = styled.h1`
  margin-top: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes['3xl']};

  &:focus {
    outline: none;
  }
`

export const Prose = styled.div`
  margin-top: ${({ theme }) => theme.space[8]};
  font-size: ${({ theme }) => theme.fontSizes.lg};

  & > * + * {
    margin-top: ${({ theme }) => theme.space[4]};
  }

  h2 {
    margin-top: ${({ theme }) => theme.space[8]};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`
