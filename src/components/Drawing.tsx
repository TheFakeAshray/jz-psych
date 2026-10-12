import { useCallback, useId, useMemo, useRef } from 'react'
import { useAnimationFrame, useReducedMotion } from 'motion/react'
import styled from 'styled-components'

type Stroke = { d: string; width?: number; transform?: string }

// One card draws, holds, then a big eraser wipes it. The next card starts drawing just before that wipe.
// The hold is the beat for that card's arrow prompt.
const drawSeconds = 7.2
const holdSeconds = 3.6
const undrawSeconds = 0.9
const leadSeconds = 0.5
const activeSeconds = drawSeconds + holdSeconds + undrawSeconds
const drawEnd = drawSeconds / activeSeconds
const holdEnd = (drawSeconds + holdSeconds) / activeSeconds
const startedAt = performance.now()

/** 0 at the start of this card's turn, 1 at the end of its wipe. Null while this card is idle. */
export function drawingTurn(order: number, count: number, now = performance.now()) {
  const cards = Math.max(count, 1)
  const stride = cards === 1 ? activeSeconds : activeSeconds - undrawSeconds - leadSeconds
  const loop = cards * stride
  let local = ((now - startedAt) / 1000) % loop - order * stride
  if (local < 0) local += loop
  if (local >= activeSeconds) return null
  return local / activeSeconds
}

/** 0 while this card is drawing, erasing, or waiting. Peaks twice during the hold, back at rest as the erase starts. */
export function arrowNudge(order: number, count: number, now = performance.now()) {
  const turn = drawingTurn(order, count, now)
  if (turn === null || turn < drawEnd || turn >= holdEnd) return 0
  const local = (turn - drawEnd) / (holdEnd - drawEnd)
  return Math.sin(local * Math.PI * 2) ** 2
}

function strokePose(turn: number, index: number, total: number) {
  const step = drawEnd / total
  const drawAt = index * step
  const drawnAt = drawAt + step

  let offset = 0
  if (turn < drawAt) offset = 1
  else if (turn < drawnAt) offset = 1 - (turn - drawAt) / step

  return { offset, opacity: offset > 0.985 ? 0 : 1 }
}

/** Two fat passes, across then down, so the undraw reads as a big eraser rather than a flat curtain. */
function eraserWipe(viewBox?: string) {
  const [x, y, w, h] = viewBox?.trim().split(/[\s,]+/).map(Number) ?? []
  if (![x, y, w, h].every((value) => Number.isFinite(value)) || w <= 0 || h <= 0) return null

  const thickness = h * 0.9
  const bleed = thickness * 0.75
  const left = x - bleed
  const right = x + w + bleed
  const top = y + h * 0.22
  const drop = y + h * 0.4
  const lift = y + h * 0.6
  const bottom = y + h * 0.78

  return {
    d: `M${left},${top} L${right},${drop} L${right},${lift} L${left},${bottom}`,
    thickness,
    x: left,
    y: y - bleed,
    width: right - left,
    height: y + h + bleed - (y - bleed),
  }
}

function attribute(attrs: string, name: string) {
  return attrs.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]
}

function parseSvg(svg: string) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  const preserveAspectRatio = attribute(svg.slice(0, svg.indexOf('>')), 'preserveAspectRatio')
  const transforms: string[] = []
  const paths = [...svg.matchAll(/<g\b([^>]*)>|<\/g>|<path\b([^>]*?)\/?>/g)].flatMap((match) => {
    if (match[0].startsWith('</g>')) {
      transforms.pop()
      return []
    }
    if (match[0].startsWith('<g')) {
      transforms.push(attribute(match[1], 'transform') ?? '')
      return []
    }
    const attrs = match[2]
    const d = attribute(attrs, 'd')
    if (!d) return []
    const style = attribute(attrs, 'style') ?? ''
    const stroked = /\bstroke\s*=/.test(attrs) || /(?:^|;)\s*stroke\s*:/.test(style)
    const width = Number.parseFloat(attribute(attrs, 'stroke-width') ?? style.match(/stroke-width:\s*([\d.]+)/)?.[1] ?? '')
    const transform = [...transforms, attribute(attrs, 'transform')].filter(Boolean).join(' ')
    return [{ d, width: Number.isFinite(width) ? width : undefined, stroked, transform }]
  })
  const stroked = paths.filter((path) => path.stroked)
  const strokes: Stroke[] = (stroked.length > 0 ? stroked : paths).map(({ d, width, transform }) => ({
    d,
    width,
    transform: transform || undefined,
  }))
  return { viewBox, preserveAspectRatio, strokes }
}

export function Drawing({
  svg,
  order = 0,
  count = 1,
  className,
}: {
  svg: string
  order?: number
  count?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const maskId = `erase${useId().replace(/:/g, '')}`
  const { viewBox, preserveAspectRatio, strokes } = useMemo(() => parseSvg(svg), [svg])
  const wipe = useMemo(() => eraserWipe(viewBox), [viewBox])
  const paths = useRef<(SVGPathElement | null)[]>([])
  const eraser = useRef<SVGPathElement>(null)
  const config = useRef({ still: false, order, count, total: strokes.length })
  config.current = { still: reduceMotion === true, order, count, total: strokes.length }

  useAnimationFrame(
    useCallback(() => {
      const { still, order: card, count: cards, total } = config.current
      const turn = still ? null : drawingTurn(card, cards)
      for (let index = 0; index < total; index++) {
        const path = paths.current[index]
        if (!path) continue
        const pose = still ? { offset: 0, opacity: 1 } : turn === null ? { offset: 1, opacity: 0 } : strokePose(turn, index, total)
        path.style.strokeDashoffset = String(pose.offset)
        path.style.opacity = String(pose.opacity)
      }

      const eraserPath = eraser.current
      if (!eraserPath) return
      const progress = !still && turn !== null && turn >= holdEnd ? (turn - holdEnd) / (1 - holdEnd) : 0
      eraserPath.style.strokeDashoffset = String(1 - progress)
      eraserPath.style.opacity = progress > 0 ? '1' : '0'
    }, []),
  )

  const marks = strokes.map((stroke, index) => (
    <path
      key={index}
      ref={(node) => {
        paths.current[index] = node
      }}
      d={stroke.d}
      transform={stroke.transform}
      strokeWidth={stroke.width ?? 14}
      pathLength={1}
    />
  ))

  return (
    <Frame className={className} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} fill="none" aria-hidden>
      {wipe && (
        <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={wipe.x} y={wipe.y} width={wipe.width} height={wipe.height}>
          <rect x={wipe.x} y={wipe.y} width={wipe.width} height={wipe.height} fill="white" />
          <path ref={eraser} className="eraser" d={wipe.d} strokeWidth={wipe.thickness} pathLength={1} />
        </mask>
      )}
      {wipe ? <g mask={`url(#${maskId})`}>{marks}</g> : marks}
    </Frame>
  )
}

const Frame = styled.svg`
  position: absolute;
  pointer-events: none;

  path {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1 1;
    stroke-dashoffset: 1;
    opacity: 0;
  }

  path.eraser {
    stroke: #000;
  }

  @media (prefers-reduced-motion: reduce) {
    path:not(.eraser) {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
`
