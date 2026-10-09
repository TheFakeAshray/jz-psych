import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.space[4]};

  ${({ theme }) => theme.media.md} {
    padding-inline: ${({ theme }) => theme.space[8]};
  }
`
