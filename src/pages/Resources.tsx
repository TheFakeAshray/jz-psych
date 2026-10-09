import { Link } from 'react-router'
import { Accordion } from 'radix-ui'
import styled, { keyframes } from 'styled-components'
import { Button } from '../components/Button'
import {
  articles,
  formatPublished,
  getIssue,
  guidesFor,
  issues,
} from '../content/resources'

export function Resources() {
  return (
    <>
      <Intro>Free PDF guides, grouped by what you’re facing, and longer pieces of writing.</Intro>

      <GroupTitle>Guides</GroupTitle>
      <IssueList type="multiple">
        {issues.map((issue) => {
          const issueGuides = guidesFor(issue.slug)

          return (
            <Issue key={issue.slug} value={issue.slug}>
              <IssueHeading>
                <IssueTrigger>
                  <IssueName>{issue.title}</IssueName>
                  <IssueCount>
                    {issueGuides.length} {issueGuides.length === 1 ? 'PDF' : 'PDFs'}
                  </IssueCount>
                  <Chevron />
                </IssueTrigger>
              </IssueHeading>
              <IssueBody>
                <IssueInner>
                  <IssueDescription>{issue.description}</IssueDescription>
                  <GuideList>
                    {issueGuides.map((guide) => (
                      <Guide key={guide.title}>
                        <div>
                          <GuideTitle>{guide.title}</GuideTitle>
                          <p>{guide.description}</p>
                        </div>
                        {guide.file ? (
                          <Button asChild variant="secondary">
                            <a href={publicPath(guide.file)} download>
                              Download PDF
                            </a>
                          </Button>
                        ) : (
                          <Pending>PDF coming soon</Pending>
                        )}
                      </Guide>
                    ))}
                  </GuideList>
                </IssueInner>
              </IssueBody>
            </Issue>
          )
        })}
      </IssueList>

      <GroupTitle>Writing</GroupTitle>
      {articles.length === 0 ? (
        <Empty>Articles will appear here.</Empty>
      ) : (
        <ArticleList>
          {articles.map((article) => (
            <ArticleLink key={article.slug} to={`/resources/${article.slug}`}>
              <ArticleMeta>
                {article.issue ? <span>{getIssue(article.issue).title}</span> : <span>Writing</span>}
                <time dateTime={article.published}>{formatPublished(article.published)}</time>
              </ArticleMeta>
              <ArticleTitle>{article.title}</ArticleTitle>
              <p>{article.summary}</p>
            </ArticleLink>
          ))}
        </ArticleList>
      )}
    </>
  )
}

function publicPath(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function Chevron() {
  return (
    <ChevronIcon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </ChevronIcon>
  )
}

const open = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`

const Intro = styled.p`
  margin-top: ${({ theme }) => theme.space[8]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const GroupTitle = styled.h2`
  margin-top: ${({ theme }) => theme.space[12]};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
`

const IssueList = styled(Accordion.Root)`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
`

const Issue = styled(Accordion.Item)`
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.tones.sage.card};
`

const IssueHeading = styled(Accordion.Header)`
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
`

const IssueTrigger = styled(Accordion.Trigger)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  width: 100%;
  min-height: 64px;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &[data-state='open'] svg {
    transform: rotate(180deg);
  }
`

const IssueName = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
`

const IssueCount = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
`

const ChevronIcon = styled.svg`
  flex: none;
  transition: transform 200ms ease;
`

const IssueBody = styled(Accordion.Content)`
  overflow: hidden;

  &[data-state='open'] {
    animation: ${open} 200ms ease;
  }
`

const IssueInner = styled.div`
  padding: 0 ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[6]};
`

const IssueDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`

const GuideList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[4]};
  padding: 0;
  list-style: none;
`

const Guide = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.sm} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const GuideTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

const Pending = styled.span`
  flex: none;
  align-self: flex-start;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  border: 1px solid currentColor;
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;

  ${({ theme }) => theme.media.sm} {
    align-self: center;
  }
`

const Empty = styled.p`
  margin-top: ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.textMuted};
`

const ArticleList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
`

const ArticleLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.tones.sage.card};
  text-decoration: none;

  &:hover h3 {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const ArticleMeta = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

const ArticleTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`
