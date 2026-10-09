import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router'
import { cubicBezier, motion, useAnimationFrame, useMotionValue, useReducedMotion, type Variants } from 'motion/react'
import styled from 'styled-components'
import { getLastSection } from '../content/lastSection'
import { siteName } from '../content/site'
import { sections, type Tone } from '../content/sections'
import { ease, morph } from '../theme/motion'
import { theme } from '../theme/theme'

const container: Variants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const cardIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// The card morphing back from its page must stay opaque, and its text waits until the
// morph settles so it isn't shown stretched mid-animation.
const cardMorphingBack: Variants = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const contentAfterMorph: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.4, duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const floatDelay = [0, 0.8, 1.6, 0.4]
const floatDuration = [5.6, 6.4, 5.2, 6.8]
const floatAmplitude = 8
const floatEase = cubicBezier(0.42, 0, 0.58, 1)

// Same curve as y: [0, -8, 0] with easeInOut. Driven from one clock so a hovered
// card can freeze, then catch the phase it would have had if it never paused.
function floatY(elapsedMs: number, durationMs: number, delayMs: number) {
  const elapsed = elapsedMs - delayMs
  if (elapsed <= 0) return 0

  const cycle = (elapsed % durationMs) / durationMs
  if (cycle <= 0.5) return -floatAmplitude * floatEase(cycle / 0.5)
  return -floatAmplitude * (1 - floatEase((cycle - 0.5) / 0.5))
}

export function Landing() {
  const [returningFrom] = useState(getLastSection)
  const reduceMotion = useReducedMotion()
  const floatOrigin = useRef(performance.now())

  useEffect(() => {
    document.title = siteName
  }, [])

  return (
    <Wrapper variants={container} initial="hidden" animate="visible" exit="exit">
      <Brand variants={item}>{siteName}</Brand>

      <Main>
        <Heading variants={item}>
          Welcome, glad you're here.
          <Muted>What brings you in today?</Muted>
        </Heading>

        <Grid>
          {sections.map((section, index) => {
            const isMorphingBack = section.slug === returningFrom

            return (
              <FloatingCard
                key={section.slug}
                duration={floatDuration[index]}
                delay={(isMorphingBack ? 0.7 : 0.85) + floatDelay[index]}
                still={!!reduceMotion}
                origin={floatOrigin}
              >
                <PromptCard
                  to={section.path}
                  layoutId={`section-${section.slug}`}
                  layoutCrossfade={false}
                  transition={morph}
                  variants={isMorphingBack ? cardMorphingBack : cardIn}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ borderRadius: theme.layout.cardRadius }}
                  $tone={section.tone}
                >
                  <CardContent variants={isMorphingBack ? contentAfterMorph : item}>
                    <Label>{section.title}</Label>
                    <Prompt>{section.prompt}</Prompt>
                    <Arrow />
                  </CardContent>
                </PromptCard>
              </FloatingCard>
            )
          })}
        </Grid>
      </Main>

      <Crisis variants={item}>
        In crisis? Call Lifeline <a href="tel:131114">13 11 14</a> or <a href="tel:000">000</a>.
      </Crisis>
    </Wrapper>
  )
}

function FloatingCard({
  duration,
  delay,
  still,
  origin,
  children,
}: {
  duration: number
  delay: number
  still: boolean
  origin: RefObject<number>
  children: ReactNode
}) {
  const y = useMotionValue(0)
  const paused = useRef(false)
  const catchingUp = useRef(false)
  const config = useRef({ duration, delay, still })
  config.current = { duration, delay, still }

  useAnimationFrame(
    useCallback((_timestamp, delta) => {
      const { duration: durationSec, delay: delaySec, still: holdStill } = config.current
      if (holdStill) {
        if (y.get() !== 0) y.set(0)
        return
      }

      const live = floatY(performance.now() - origin.current, durationSec * 1000, delaySec * 1000)
      if (paused.current) return

      if (catchingUp.current) {
        const next = y.get() + (live - y.get()) * (1 - Math.exp(-(delta || 16) / 130))
        if (Math.abs(next - live) < 0.1) {
          y.set(live)
          catchingUp.current = false
        } else {
          y.set(next)
        }
        return
      }

      y.set(live)
    }, [origin, y]),
  )

  return (
    <Float
      style={{ y }}
      onMouseEnter={() => {
        if (config.current.still) return
        paused.current = true
        catchingUp.current = false
      }}
      onMouseLeave={() => {
        if (!paused.current) return
        paused.current = false
        catchingUp.current = true
      }}
    >
      {children}
    </Float>
  )
}

function Arrow() {
  return (
    <ArrowIcon width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </ArrowIcon>
  )
}

const MotionLink = motion.create(Link)

const Wrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  overflow-y: auto;

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[12]};
  }
`

const Brand = styled(motion.p)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.75rem;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-inline: auto;
`

const Heading = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`

const Muted = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
`

const Float = styled(motion.div)`
  display: flex;
  min-width: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space[3]};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.space[4]};
  }
`

const PromptCard = styled(MotionLink)<{ $tone: Tone }>`
  display: flex;
  flex: 1;
  min-height: clamp(132px, 22dvh, 200px);
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme, $tone }) => theme.colors.tones[$tone].bg};
  color: ${({ theme, $tone }) => theme.colors.tones[$tone].fg};
  text-decoration: none;

  ${({ theme }) => theme.media.lg} {
    min-height: 260px;
    padding: ${({ theme }) => theme.space[6]};
  }
`

const CardContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
`

const Prompt = styled.span`
  margin-top: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  line-height: 1.25;

  ${({ theme }) => theme.media.lg} {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`

const ArrowIcon = styled.svg`
  margin-top: auto;
  align-self: flex-end;
`

const Crisis = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`
