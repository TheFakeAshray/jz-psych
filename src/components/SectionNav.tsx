import { NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import styled from 'styled-components'
import { sections, type Tone } from '../content/sections'
import { ease } from '../theme/motion'

function isCurrent(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function SectionNav() {
  const { pathname } = useLocation()
  const others = sections.filter((section) => !isCurrent(pathname, section.path))

  return (
    <Rail
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <List aria-label="Other sections">
        <AnimatePresence initial={false} mode="popLayout">
          {others.map((section) => (
            <Item
              key={section.slug}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease }}
            >
              <SectionLink to={section.path} $tone={section.tone}>
                {section.title}
              </SectionLink>
            </Item>
          ))}
        </AnimatePresence>
      </List>
    </Rail>
  )
}

const box = '7.5rem'

const Rail = styled(motion.nav)`
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: ${({ theme }) => theme.space[3]};
  translate: -50% 0;
  width: max-content;
  max-width: calc(100% - ${({ theme }) => theme.space[6]});

  ${({ theme }) => theme.media.side} {
    top: 0;
    bottom: 0;
    left: ${({ theme }) => theme.space[4]};
    translate: none;
    width: ${box};
    max-width: none;
    height: fit-content;
    margin-block: auto;
  }
`

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, ${box}));
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ theme }) => theme.media.side} {
    grid-template-columns: ${box};
  }
`

const Item = styled(motion.li)`
  display: flex;
  min-width: 0;
`

const SectionLink = styled(NavLink)<{ $tone: Tone }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  min-width: 0;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme, $tone }) => theme.colors.tones[$tone].bg};
  color: ${({ theme, $tone }) => theme.colors.tones[$tone].fg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;

  &:hover {
    filter: brightness(1.06);
  }

  ${({ theme }) => theme.media.side} {
    min-height: 72px;
  }
`
