import styled from 'styled-components'
import { PageShell, Prose } from '../components/PageShell'
import { getSection } from '../content/sections'

export function Booking() {
  return (
    <PageShell section={getSection('booking')}>
      <Prose>
        <p>Online booking is coming soon. In the meantime, get in touch and we’ll find a time that works.</p>
      </Prose>
      <Details>
        <div>
          <dt>Phone</dt>
          <dd>Placeholder</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>Placeholder</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>Placeholder</dd>
        </div>
      </Details>
    </PageShell>
  )
}

const Details = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  margin-top: ${({ theme }) => theme.space[8]};

  dt {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  dd {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`
