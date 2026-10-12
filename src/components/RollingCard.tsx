import { useCallback, useRef } from 'react'
import { cubicBezier, motion, useAnimationFrame, useMotionTemplate, useMotionValue, type Variants } from 'motion/react'
import styled from 'styled-components'

const floatEase = cubicBezier(0.42, 0, 0.58, 1)

// Rolls in place. Each quarter-turn lifts onto the leading corner, hangs
// there with a small wobble, then falls onto the next face.
const rollCard = { width: 144, height: 144 }
const liftMs = 680
const hangMs = 1000
const fallMs = 420
const thudMs = 260
const faceRestMs = 420
const wobbleDegrees = 2
const wobbleTurns = 1
const pathFade = 40
const pathPattern = 360
const pathHeight = 28

const grassTile = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${pathPattern}" height="${pathHeight}" viewBox="0 0 ${pathPattern} ${pathHeight}">
  <rect y="22" width="${pathPattern}" height="6" fill="#c2603d"/>
  <path fill="#8a3e29" d="M54 23C53 17 54 13 55 11 56 15 57 19 56 23Z"/>
  <path fill="#a84d30" d="M231 24C230 19 231 16 232 15 233 18 233 21 232 24Z"/>
</svg>
`)

function tipWobble(t: number) {
  const settle = Math.sin(Math.PI * t)
  return Math.sin(t * Math.PI * 2 * wobbleTurns) * wobbleDegrees * settle
}

function thudAmount(t: number) {
  if (t < 0.16) return 1 - (1 - t / 0.16) ** 2
  if (t < 0.55) return 1 - ((t - 0.16) / 0.39) * 1.2
  return -0.2 * (1 - (t - 0.55) / 0.45)
}

function rollSample(elapsedMs: number) {
  const cycle = liftMs + hangMs + fallMs + faceRestMs
  const turns = Math.floor(elapsedMs / cycle)
  const time = elapsedMs % cycle
  const landedAt = liftMs + hangMs + fallMs

  let progress: number
  if (time < liftMs) {
    progress = 0.5 * floatEase(time / liftMs)
  } else if (time < liftMs + hangMs) {
    progress = 0.5 + tipWobble((time - liftMs) / hangMs) / 90
  } else if (time < landedAt) {
    const fall = (time - liftMs - hangMs) / fallMs
    progress = 0.5 + 0.5 * fall * fall
  } else {
    progress = 1
  }

  const sinceLanding = time - landedAt
  const thud = sinceLanding >= 0 && sinceLanding < thudMs ? thudAmount(sinceLanding / thudMs) : 0

  return { degrees: (turns + progress) * 90, thud }
}

function cardRoll(degrees: number) {
  const local = ((degrees % 90) * Math.PI) / 180
  const half = rollCard.width / 2 - 28
  const sin = Math.sin(local)
  const cos = Math.cos(local)

  return {
    y: half * (1 - sin - cos),
    rotate: degrees,
    shadowScale: 1 - Math.sin(local * 2) * 0.45,
  }
}

// How far the card would have travelled. The path slides back by that amount.
function groundTravel(degrees: number) {
  const quarter = Math.floor(degrees / 90)
  const local = ((degrees - quarter * 90) * Math.PI) / 180
  const sin = Math.sin(local)
  const cos = Math.cos(local)
  return quarter * rollCard.width + (rollCard.width / 2) * (1 + sin - cos)
}

export function RollingCard({ still, variants }: { still: boolean; variants?: Variants }) {
  const y = useMotionValue(0)
  const rotate = useMotionValue(0)
  const scaleX = useMotionValue(1)
  const scaleY = useMotionValue(1)
  const shadowScale = useMotionValue(1)
  const shift = useMotionValue(0)
  const backgroundPositionX = useMotionTemplate`${shift}px`
  const origin = useRef(performance.now())
  const config = useRef({ still })
  config.current = { still }

  useAnimationFrame(
    useCallback(() => {
      if (config.current.still) {
        if (rotate.get() !== 0) {
          y.set(0)
          rotate.set(0)
          scaleX.set(1)
          scaleY.set(1)
          shadowScale.set(1)
          shift.set(0)
        }
        return
      }

      const { degrees, thud } = rollSample(performance.now() - origin.current)
      const pose = cardRoll(degrees)
      const squash = 0.08 * thud
      const vertical = 1 - squash
      const horizontal = 1 + squash * 0.65
      y.set(pose.y + (rollCard.height / 2) * (1 - vertical))
      rotate.set(pose.rotate)
      scaleX.set(horizontal)
      scaleY.set(vertical)
      shadowScale.set(pose.shadowScale + Math.max(0, thud) * 0.28)
      shift.set(-(groundTravel(degrees) % pathPattern))
    }, [rotate, scaleX, scaleY, shadowScale, shift, y]),
  )

  return (
    <RollStage aria-hidden variants={variants}>
      <Path style={{ backgroundPositionX }} />
      <GroundShadow style={{ scaleX: shadowScale }} />
      <BlankCard style={{ y, rotate, scaleX, scaleY }} />
    </RollStage>
  )
}

const RollStage = styled(motion.div)`
  display: none;

  ${({ theme }) => theme.media.lg} {
    display: block;
    position: relative;
    flex: none;
    width: ${rollCard.width}px;
    height: ${rollCard.height}px;
    margin-left: auto;
    overflow: visible;
  }
`

const Path = styled(motion.div)`
  position: absolute;
  left: ${-pathFade}px;
  bottom: -5px;
  width: ${rollCard.width + pathFade * 2}px;
  height: ${pathHeight}px;
  background-image: url("data:image/svg+xml,${grassTile}");
  background-repeat: repeat-x;
  background-size: ${pathPattern}px ${pathHeight}px;
  mask-image: linear-gradient(to right, transparent, #000 ${pathFade}px, #000 calc(100% - ${pathFade}px), transparent);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 ${pathFade}px, #000 calc(100% - ${pathFade}px), transparent);
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  pointer-events: none;
`

const BlankCard = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${rollCard.width}px;
  height: ${rollCard.height}px;
  border-radius: ${({ theme }) => theme.layout.cardRadius}px;
  background: ${({ theme }) => theme.colors.tones.sand.bg};
`

const GroundShadow = styled(motion.div)`
  position: absolute;
  left: ${(rollCard.width - 72) / 2}px;
  bottom: -4px;
  width: 72px;
  height: 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(42, 33, 29, 0.16);
  filter: blur(5px);
  transform-origin: center bottom;
`
