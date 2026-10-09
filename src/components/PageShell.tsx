import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import styled from 'styled-components'
import { setLastSection } from '../content/lastSection'
import { siteName } from '../content/site'
import type { Section, Tone } from '../content/sections'
import { ease, morph } from '../theme/motion'
import { theme } from '../theme/theme'
import { Container } from './Container'

type PageShellProps = {
  section: Section
  children: ReactNode
  backTo?: string
  backLabel?: string
  label?: string
  title?: string
}

export function PageShell({ section, children, backTo = '/', backLabel = 'Back', label, title }: PageShellProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const heading = title ?? section.prompt
  const eyebrow = label ?? section.title

  useEffect(() => {
    setLastSection(section.slug)
    document.title = `${title ?? section.title} · ${siteName}`
    shellRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [section.slug, section.title, title])

  return (
    <Shell
      layoutId={`section-${section.slug}`}
      layoutCrossfade={false}
      transition={morph}
      exit={{ opacity: 0, transition: { duration: 0.3, ease } }}
      style={{ borderRadius: theme.layout.screenRadius + 1 }}
      $tone={section.tone}
    >
      <Scroller ref={shellRef}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5, ease } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
      >
        <Content>
          <BackLink to={backTo}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            {backLabel}
          </BackLink>
          <Label>{eyebrow}</Label>
          <Title ref={headingRef} tabIndex={-1}>
            {heading}
          </Title>
          {children}
        </Content>
      </motion.div>
      </Scroller>
    </Shell>
  )
}

// Bleeds 1px past the frame so the frame's clip, not the shell's own antialiased edge,
// forms the visible corner; otherwise a light hairline shows at the rounded corners.
const Shell = styled(motion.div)<{ $tone: Tone }>`
  position: absolute;
  inset: -1px;
  z-index: 1;
  background: ${({ theme, $tone }) => theme.colors.tones[$tone].bg};
  color: ${({ theme, $tone }) => theme.colors.tones[$tone].fg};
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

const Content = styled(Container)`
  max-width: 760px;
  padding-block: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[12]};

  ${({ theme }) => theme.media.md} {
    padding-top: ${({ theme }) => theme.space[8]};
    padding-bottom: ${({ theme }) => theme.space[16]};
  }
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
