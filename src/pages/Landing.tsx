import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { motion, type Variants } from 'motion/react'
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

export function Landing() {
  const [returningFrom] = useState(getLastSection)

  useEffect(() => {
    document.title = siteName
  }, [])

  return (
    <Wrapper variants={container} initial="hidden" animate="visible" exit="exit">
      <Brand variants={item}>{siteName}</Brand>

      <Main>
        <Heading variants={item}>
          Hi there.
          <Muted>What brings you here today?</Muted>
        </Heading>

        <Grid>
          {sections.map((section) => {
            const isMorphingBack = section.slug === returningFrom

            return (
              <PromptCard
                key={section.slug}
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
  gap: ${({ theme }) => theme.space[8]};
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
