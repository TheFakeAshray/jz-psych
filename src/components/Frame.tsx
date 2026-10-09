import type { ReactNode } from 'react'
import styled from 'styled-components'

export function Frame({ children }: { children: ReactNode }) {
  return (
    <Border>
      <Screen>{children}</Screen>
    </Border>
  )
}

const Border = styled.div`
  position: fixed;
  inset: 0;
  padding: ${({ theme }) => theme.layout.frame};
  background: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.layout.frameLg};
  }
`

const Screen = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.screenRadius}px;
  background: ${({ theme }) => theme.colors.background};
  isolation: isolate;
`
