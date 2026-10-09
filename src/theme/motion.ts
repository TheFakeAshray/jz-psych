import type { Transition } from 'motion/react'

export const morph: Transition = { type: 'spring', duration: 0.6, bounce: 0.12 }

export const ease = [0.22, 1, 0.36, 1] as const
