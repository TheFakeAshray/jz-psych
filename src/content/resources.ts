// Guides are PDFs grouped by issue. Put the file in public/resources/ and set `file`
// to its path, for example '/resources/grounding.pdf'. Leave `file` out until the PDF
// exists and the page shows "PDF coming soon".
//
// Articles are longer pieces of writing. Add one to `articles` and it is listed under
// Writing and published at /resources/<slug>.

export const issues = [
  {
    slug: 'parenting',
    title: 'Parenting support',
    description: 'Guides for the everyday pressures of raising children.',
  },
  {
    slug: 'grief',
    title: 'Grief',
    description: 'Guides for living with loss.',
  },
  {
    slug: 'relationships',
    title: 'Relationships',
    description: 'Guides for communication, conflict and connection.',
  },
  {
    slug: 'anxiety',
    title: 'Anxiety',
    description: 'Guides for worry, panic and feeling on edge.',
  },
  {
    slug: 'depression',
    title: 'Depression',
    description: 'Guides for low mood and getting through heavy days.',
  },
] as const

export type IssueSlug = (typeof issues)[number]['slug']

export type Guide = {
  title: string
  description: string
  issue: IssueSlug
  file?: string
}

export type Article = {
  slug: string
  title: string
  summary: string
  published: string
  issue?: IssueSlug
  paragraphs: string[]
}

export const guides: Guide[] = [
  {
    issue: 'parenting',
    title: 'Talking with children about big feelings',
    description: 'Placeholder — a short guide for naming emotions with kids.',
  },
  {
    issue: 'grief',
    title: 'The first weeks after a loss',
    description: 'Placeholder — what the early days can feel like, and what helps.',
  },
  {
    issue: 'relationships',
    title: 'Having a hard conversation',
    description: 'Placeholder — a worksheet for preparing a difficult talk.',
  },
  {
    issue: 'anxiety',
    title: 'Grounding techniques',
    description: 'Placeholder — quick exercises for moments of high anxiety.',
  },
  {
    issue: 'depression',
    title: 'Small steps on low days',
    description: 'Placeholder — gentle ideas for getting through a heavy day.',
  },
]

export const articles: Article[] = [
  {
    slug: 'when-worry-takes-over',
    title: 'When worry takes over the day',
    summary: 'Placeholder — how anxiety can slip into ordinary routines.',
    published: '2026-10-01',
    issue: 'anxiety',
    paragraphs: [
      'Placeholder opening. This is where a short essay would start, in your own voice.',
      'Placeholder second paragraph. Replace these with the finished piece, or delete the article until one is ready.',
    ],
  },
  {
    slug: 'repair-after-conflict',
    title: 'What we mean by repair',
    summary: 'Placeholder — coming back to each other after an argument.',
    published: '2026-09-12',
    issue: 'relationships',
    paragraphs: [
      'Placeholder opening about rupture and repair in close relationships.',
      'Placeholder second paragraph. Articles can be as long as you need — this page scrolls inside the frame.',
    ],
  },
]

export function getIssue(slug: IssueSlug) {
  const issue = issues.find((item) => item.slug === slug)
  if (!issue) throw new Error(`Unknown issue: ${slug}`)
  return issue
}

export function guidesFor(slug: IssueSlug) {
  return guides.filter((guide) => guide.issue === slug)
}

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}

export function formatPublished(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}
