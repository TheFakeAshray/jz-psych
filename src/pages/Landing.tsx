import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useAnimationFrame, useReducedMotion, type Variants } from 'motion/react'
import styled, { css } from 'styled-components'
import aboutSvg from '../assets/about.svg?raw'
import resourcesSvg from '../assets/resources.svg?raw'
import bookingSvg from '../assets/booking.svg?raw'
import servicesSvg from '../assets/services.svg?raw'
import { arrowNudge, Drawing } from '../components/Drawing'
import { FloatingCard } from '../components/FloatingCard'
import { getLastSection, setLastSection } from '../content/lastSection'
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
}

const cardIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
}

const floatDelay = [0, 0.8, 1.6, 0.4]
const floatDuration = [5.6, 6.4, 5.2, 6.8]

const cardDrawings: Partial<Record<string, string>> = {
  about: aboutSvg,
  services: servicesSvg,
  resources: resourcesSvg,
  booking: bookingSvg,
}

export function Landing() {
  const [returningFrom] = useState(getLastSection)
  const reduceMotion = useReducedMotion()
  const floatOrigin = useRef(performance.now())
  const intro = !returningFrom
  const drawnSections = sections.filter((section) => cardDrawings[section.slug])

  useEffect(() => {
    document.title = siteName
  }, [])

  return (
    <Wrapper variants={intro ? container : undefined} initial={intro ? 'hidden' : false} animate={intro ? 'visible' : undefined} exit="exit">
      <Brand variants={intro ? item : undefined}>{siteName}</Brand>

      <Main>
        <HeadingRow>
          <Heading variants={intro ? item : undefined}>
            Welcome,
            <Muted>What brings you here?</Muted>
          </Heading>
          {/* <RollingCard still={!!reduceMotion} variants={intro ? item : undefined} /> */}
        </HeadingRow>

        <Grid>
          {sections.map((section, index) => {
            const isMorphingBack = section.slug === returningFrom
            const drawing = cardDrawings[section.slug]
            const order = drawing ? drawnSections.findIndex((item) => item.slug === section.slug) : undefined

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
                  onClick={() => setLastSection(section.slug)}
                  layoutId={`section-${section.slug}`}
                  layoutCrossfade={false}
                  transition={morph}
                  variants={intro && !isMorphingBack ? cardIn : undefined}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ borderRadius: theme.layout.cardRadius }}
                  $tone={section.tone}
                >
                  {drawing && (
                    <CardDrawing svg={drawing} order={order} count={drawnSections.length} $card={section.slug} />
                  )}
                  <CardContent variants={intro && !isMorphingBack ? item : undefined}>
                    <Label>{section.title}</Label>
                    <Prompt>{section.prompt}</Prompt>
                    <Arrow order={order} count={drawnSections.length} />
                  </CardContent>
                </PromptCard>
              </FloatingCard>
            )
          })}
        </Grid>
      </Main>

      <Crisis variants={intro ? item : undefined}>
        In crisis? Call Lifeline <a href="tel:131114">13 11 14</a> or <a href="tel:000">000</a>.
      </Crisis>
    </Wrapper>
  )
}

function Arrow({ order, count }: { order?: number; count: number }) {
  const reduceMotion = useReducedMotion()
  const icon = useRef<SVGSVGElement>(null)
  const config = useRef({ order, count, still: false })
  config.current = { order, count, still: reduceMotion === true }

  useAnimationFrame(
    useCallback(() => {
      const node = icon.current
      if (!node) return
      const { order: card, count: cards, still } = config.current
      const nudge = still || card === undefined ? 0 : arrowNudge(card, cards)
      node.style.transform = nudge ? `translateX(${nudge * 8}px)` : ''
    }, []),
  )

  return (
    <ArrowIcon ref={icon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

const HeadingRow = styled.div`
  ${({ theme }) => theme.media.lg} {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[8]};
    padding-right: ${({ theme }) => theme.space[8]};
  }
`

const Heading = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`

const Muted = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
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

const CardDrawing = styled(Drawing)<{ $card: string }>`
  mix-blend-mode: overlay;
  width: 58%;
  height: 62%;
  left: 0;
  bottom: -1rem;

  ${({ $card }) =>
    $card === 'booking' &&
    css`
      opacity: 0.4;
    `}
`

const PromptCard = styled(MotionLink)<{ $tone: Tone }>`
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
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
  position: relative;
  z-index: 1;
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
