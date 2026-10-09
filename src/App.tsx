import styled from 'styled-components'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Container } from './components/Container'
import { Button } from './components/Button'

const services = [
  { title: 'Individual therapy', body: 'One-on-one sessions tailored to your goals.' },
  { title: 'Anxiety & stress', body: 'Practical, evidence-based strategies for everyday life.' },
  { title: 'Telehealth', body: 'Secure video sessions from wherever you are.' },
]

function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero>
          <Container>
            <Eyebrow>Psychology clinic</Eyebrow>
            <HeroTitle>A calm, supportive space to talk.</HeroTitle>
            <Lead>Placeholder intro copy for the clinic — who you help and how.</Lead>
            <Actions>
              <Button href="#contact">Get in touch</Button>
              <Button href="#services" $variant="secondary">
                Our services
              </Button>
            </Actions>
          </Container>
        </Hero>

        <Section id="services">
          <Container>
            <SectionTitle>Services</SectionTitle>
            <Grid>
              {services.map((service) => (
                <Card key={service.title}>
                  <CardTitle>{service.title}</CardTitle>
                  <p>{service.body}</p>
                </Card>
              ))}
            </Grid>
          </Container>
        </Section>

        <Section id="about" $muted>
          <Container>
            <SectionTitle>About</SectionTitle>
            <Lead>Placeholder copy about the practitioner and the clinic’s approach.</Lead>
          </Container>
        </Section>

        <Section id="contact">
          <Container>
            <SectionTitle>Contact</SectionTitle>
            <Lead>Placeholder contact details — phone, email and location.</Lead>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}

export default App

const Hero = styled.section`
  padding-block: ${({ theme }) => theme.space[12]};
  background: ${({ theme }) => theme.colors.primarySoft};

  ${({ theme }) => theme.media.md} {
    padding-block: ${({ theme }) => theme.space[16]};
  }
`

const Eyebrow = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const HeroTitle = styled.h1`
  max-width: 18ch;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
`

const Lead = styled.p`
  max-width: 60ch;
  margin-top: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};

  ${({ theme }) => theme.media.sm} {
    flex-direction: row;
  }
`

const Section = styled.section<{ $muted?: boolean }>`
  padding-block: ${({ theme }) => theme.space[12]};
  background: ${({ theme, $muted }) => ($muted ? theme.colors.surfaceMuted : 'transparent')};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
`

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.space[6]};
  }
`

const Card = styled.article`
  padding: ${({ theme }) => theme.space[6]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
`
