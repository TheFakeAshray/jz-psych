import { useCallback, useRef, type ReactNode, type RefObject } from 'react'
import { cubicBezier, motion, useAnimationFrame, useMotionValue } from 'motion/react'
import styled from 'styled-components'

const floatAmplitude = 1
const floatEase = cubicBezier(0.42, 0, 0.58, 1)

// Same curve as y: [0, -8, 0] with easeInOut. Driven from one clock so a hovered
// card can freeze, then catch the phase it would have had if it never paused.
function floatY(elapsedMs: number, durationMs: number, delayMs: number) {
  const elapsed = elapsedMs - delayMs
  if (elapsed <= 0) return 0

  const cycle = (elapsed % durationMs) / durationMs
  if (cycle <= 0.5) return -floatAmplitude * floatEase(cycle / 0.5)
  return -floatAmplitude * (1 - floatEase((cycle - 0.5) / 0.5))
}

export function FloatingCard({
  duration,
  delay,
  still,
  origin,
  children,
}: {
  duration: number
  delay: number
  still: boolean
  origin: RefObject<number>
  children: ReactNode
}) {
  const y = useMotionValue(0)
  const paused = useRef(false)
  const catchingUp = useRef(false)
  const config = useRef({ duration, delay, still })
  config.current = { duration, delay, still }

  useAnimationFrame(
    useCallback((_timestamp, delta) => {
      const { duration: durationSec, delay: delaySec, still: holdStill } = config.current
      if (holdStill) {
        if (y.get() !== 0) y.set(0)
        return
      }

      const live = floatY(performance.now() - origin.current, durationSec * 1000, delaySec * 1000)
      if (paused.current) return

      if (catchingUp.current) {
        const next = y.get() + (live - y.get()) * (1 - Math.exp(-(delta || 16) / 130))
        if (Math.abs(next - live) < 0.1) {
          y.set(live)
          catchingUp.current = false
        } else {
          y.set(next)
        }
        return
      }

      y.set(live)
    }, [origin, y]),
  )

  return (
    <Float
      style={{ y }}
      onMouseEnter={() => {
        if (config.current.still) return
        paused.current = true
        catchingUp.current = false
      }}
      onMouseLeave={() => {
        if (!paused.current) return
        paused.current = false
        catchingUp.current = true
      }}
    >
      {children}
    </Float>
  )
}

const Float = styled(motion.div)`
  display: flex;
  min-width: 0;
`
