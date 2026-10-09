import { useParams } from 'react-router'
import styled from 'styled-components'
import { Prose } from '../components/PageShell'
import { findArticle, formatPublished } from '../content/resources'

export function Article() {
  const { slug } = useParams()
  const article = findArticle(slug ?? '')
  if (!article) return null

  return (
    <Prose>
      <Published>
        <time dateTime={article.published}>{formatPublished(article.published)}</time>
      </Published>
      {article.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </Prose>
  )
}

const Published = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`
