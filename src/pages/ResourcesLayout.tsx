import { Navigate, Outlet, useParams } from 'react-router'
import { PageShell } from '../components/PageShell'
import { findArticle, getIssue } from '../content/resources'
import { getSection } from '../content/sections'

export function ResourcesLayout() {
  const { slug } = useParams()
  const article = slug ? findArticle(slug) : undefined

  if (slug && !article) return <Navigate to="/resources" replace />

  return (
    <PageShell
      section={getSection('resources')}
      backTo={article ? '/resources' : '/'}
      backLabel={article ? 'All resources' : 'Back'}
      label={article ? (article.issue ? getIssue(article.issue).title : 'Writing') : undefined}
      title={article?.title}
    >
      <Outlet />
    </PageShell>
  )
}
