import styled from 'styled-components'
import { Container } from './Container'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <Wrapper>
      <Container>
        <Text>© {year} JZ Psych. All rights reserved.</Text>
        <Text>
          If you are in crisis, call Lifeline on <a href="tel:131114">13 11 14</a> or emergency
          services on <a href="tel:000">000</a>.
        </Text>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  padding-block: ${({ theme }) => theme.space[8]};
  background: ${({ theme }) => theme.colors.palette.terracotta[900]};
  color: ${({ theme }) => theme.colors.palette.sand[100]};
`

const Text = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};

  & + & {
    margin-top: ${({ theme }) => theme.space[2]};
  }
`
