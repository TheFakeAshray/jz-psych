import { useRef } from 'react'
import { Link, useLocation } from 'react-router'
import styled from 'styled-components'
import { PageShell, Prose } from '../components/PageShell'
import { getSection } from '../content/sections'

const steps = {
  existing: {
    path: '/booking/existing',
    title: 'Existing Patient',
    body: 'Placeholder for the questions asked of someone who already comes to the clinic.',
  },
  new: {
    path: '/booking/new',
    title: 'New Patient',
    body: 'Placeholder for the questions asked before a first appointment.',
  },
} as const

type StepId = keyof typeof steps

function stepFromPath(pathname: string): StepId | null {
  const path = pathname.replace(/\/$/, '')
  if (path === steps.existing.path) return 'existing'
  if (path === steps.new.path) return 'new'
  return null
}

function depthOf(pathname: string) {
  return stepFromPath(pathname) ? 1 : 0
}

export function BookingLayout() {
  const { pathname } = useLocation()
  const stepId = stepFromPath(pathname)
  const step = stepId ? steps[stepId] : null
  const depth = depthOf(pathname)
  const prevDepth = useRef(depth)
  const direction = useRef(1)
  if (depth !== prevDepth.current) {
    direction.current = depth > prevDepth.current ? 1 : -1
    prevDepth.current = depth
  }

  return (
    <PageShell
      section={getSection('booking')}
      backTo={step ? '/booking' : '/'}
      backLabel={step ? 'Booking' : 'Back'}
      title={step?.title}
      slideKey={pathname}
      slideDirection={direction.current}
    >
      {step ? (
        <Prose>
          <p>{step.body}</p>
        </Prose>
      ) : (
        <BookingChoice />
      )}
    </PageShell>
  )
}

function BookingChoice() {
  return (
    <Choices aria-label="Patient type">
      <Tile to={steps.existing.path}>
        <TileTitle>{steps.existing.title}</TileTitle>
        <Arrow />
      </Tile>
      <Tile to={steps.new.path}>
        <TileTitle>{steps.new.title}</TileTitle>
        <Arrow />
      </Tile>
    </Choices>
  )
}

function Arrow() {
  return (
    <ArrowIcon width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </ArrowIcon>
  )
}

const Choices = styled.nav`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Tile = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  min-width: 0;
  min-height: 4.75rem;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.tones.clay.card};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    filter: brightness(1.06);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  }
`

const TileTitle = styled.span`
  min-width: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  line-height: 1.25;

  ${({ theme }) => theme.media.lg} {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`

const ArrowIcon = styled.svg`
  flex: none;
`
