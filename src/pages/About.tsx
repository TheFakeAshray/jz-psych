import { PageShell, Prose } from '../components/PageShell'
import { getSection } from '../content/sections'

export function About() {
  return (
    <PageShell section={getSection('about')}>
      <Prose>
        <p>Placeholder introduction to the practitioner — qualifications, experience and what drew them to psychology.</p>
        <p>Placeholder copy about the clinic’s approach and what someone can expect from their first session.</p>
        <h2>Our approach</h2>
        <p>Placeholder copy about therapeutic approaches used, e.g. CBT, ACT or schema therapy.</p>
      </Prose>
    </PageShell>
  )
}
