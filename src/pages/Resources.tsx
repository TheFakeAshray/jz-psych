import styled from 'styled-components'
import { Button } from '../components/Button'
import { PageShell, Prose } from '../components/PageShell'
import { getSection } from '../content/sections'

type Resource = {
  title: string
  description: string
  // Path to a PDF in /public, e.g. '/resources/grounding.pdf'
  file?: string
}

const resources: Resource[] = [
  { title: 'Grounding techniques', description: 'Placeholder — quick exercises for moments of high anxiety.' },
  { title: 'Sleep hygiene guide', description: 'Placeholder — small changes for better rest.' },
  { title: 'Thought record worksheet', description: 'Placeholder — a CBT tool for noticing unhelpful thinking.' },
]

export function Resources() {
  return (
    <PageShell section={getSection('resources')}>
      <Prose>
        <p>Free guides and worksheets you can download and use any time.</p>
      </Prose>
      <List>
        {resources.map((resource) => (
          <Item key={resource.title}>
            <div>
              <ItemTitle>{resource.title}</ItemTitle>
              <p>{resource.description}</p>
            </div>
            {resource.file ? (
              <Button asChild variant="secondary">
                <a href={resource.file} download>
                  Download PDF
                </a>
              </Button>
            ) : (
              <Button variant="secondary" disabled>
                Coming soon
              </Button>
            )}
          </Item>
        ))}
      </List>
    </PageShell>
  )
}

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};
  padding: 0;
  list-style: none;
`

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};

  ${({ theme }) => theme.media.sm} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const ItemTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
`
