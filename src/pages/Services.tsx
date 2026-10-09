import styled from 'styled-components'
import { PageShell, Prose } from '../components/PageShell'
import { getSection } from '../content/sections'

const services = [
  { title: 'Individual therapy', body: 'One-on-one sessions tailored to your goals.' },
  { title: 'Anxiety & stress', body: 'Practical, evidence-based strategies for everyday life.' },
  { title: 'Telehealth', body: 'Secure video sessions from wherever you are.' },
]

export function Services() {
  return (
    <PageShell section={getSection('services')}>
      <Prose>
        <p>Placeholder intro about the kinds of concerns the clinic works with.</p>
      </Prose>
      <List>
        {services.map((service) => (
          <Card key={service.title}>
            <CardTitle>{service.title}</CardTitle>
            <p>{service.body}</p>
          </Card>
        ))}
      </List>
    </PageShell>
  )
}

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};
`

const Card = styled.article`
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.tones.sand.card};
`

const CardTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`
