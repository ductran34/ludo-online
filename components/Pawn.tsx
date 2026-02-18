'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Pawn as PawnType } from '@/lib/gameEngine'

type Props = {
  pawn: PawnType
  color: string
  path: any[]
  index: number
}

export default function Pawn({ pawn, color, path, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || pawn.position < 0) return

    const target = path[pawn.position]
    if (!target) return

    gsap.to(ref.current, {
      x: target.x,
      y: target.y,
      duration: 0.4,
      ease: 'back.out(1.7)'
    })
  }, [pawn.position])

  if (pawn.position < 0) return null

  return (
    <div
      ref={ref}
      className="absolute w-8 h-8 rounded-full shadow-lg"
      style={{
        backgroundColor: color,
        transform: `translate(${index * 5}px, ${index * 5}px)`
      }}
    />
  )
}