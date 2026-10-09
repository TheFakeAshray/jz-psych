import { useState } from 'react'
import { Dialog, VisuallyHidden } from 'radix-ui'
import styled, { keyframes } from 'styled-components'
import { Container } from './Container'
import { Button } from './Button'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <Bar>
      <Inner>
        <Brand href="#top">JZ Psych</Brand>

        <DesktopNav aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <Button href="#contact">Get in touch</Button>
        </DesktopNav>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <MenuButton aria-label="Open menu">
              <MenuIcon />
            </MenuButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Overlay />
            <Drawer>
              <VisuallyHidden.Root>
                <Dialog.Title>Menu</Dialog.Title>
                <Dialog.Description>Site navigation</Dialog.Description>
              </VisuallyHidden.Root>
              <DrawerHeader>
                <Brand href="#top" onClick={() => setOpen(false)}>
                  JZ Psych
                </Brand>
                <Dialog.Close asChild>
                  <MenuButton aria-label="Close menu">
                    <CloseIcon />
                  </MenuButton>
                </Dialog.Close>
              </DrawerHeader>
              <MobileNav aria-label="Main">
                {navLinks.map((link) => (
                  <MobileNavLink key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </MobileNavLink>
                ))}
              </MobileNav>
              <Button href="#contact" onClick={() => setOpen(false)}>
                Get in touch
              </Button>
            </Drawer>
          </Dialog.Portal>
        </Dialog.Root>
      </Inner>
    </Bar>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Inner = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.layout.headerHeight};
`

const Brand = styled.a`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`

const DesktopNav = styled.nav`
  display: none;

  ${({ theme }) => theme.media.md} {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[6]};
  }
`

const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  ${({ theme }) => theme.media.md} {
    display: none;
  }
`

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(42, 33, 29, 0.4);
  animation: ${fadeIn} 200ms ease;
`

const Drawer = styled(Dialog.Content)`
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 21;
  width: min(85vw, 360px);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[8]};
  padding: 0 ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[8]};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${slideIn} 250ms ease;
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.layout.headerHeight};
`

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
`

const MobileNavLink = styled.a`
  padding: ${({ theme }) => theme.space[4]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 500;
  text-decoration: none;
`
