'use client'

import { generatePathCoordinates, PathCell } from '@/lib/board'
import Pawn from './Pawn'
import { useGame } from '@/context/GameProvider'
import { Player } from '@/lib/gameEngine'

export default function LudoBoard() {
  const { state } = useGame()

  const path: PathCell[] = generatePathCoordinates()

  return (
    <div className="relative w-[90vw] max-w-[600px] aspect-square bg-neutral-800 rounded-xl">

      <svg viewBox="0 0 600 600" className="w-full h-full">

        {path.map((pos: PathCell) => (
          <rect
            key={pos.index}
            x={pos.x}
            y={pos.y}
            width="40"
            height="40"
            fill={pos.safe ? '#aaa' : '#444'}
            stroke="#222"
          />
        ))}

      </svg>

      {state.players.map((player: Player, pIndex: number) =>
        player.pawns.map((pawn, i: number) => (
          <Pawn
            key={pawn.id}
            pawn={pawn}
            color={player.color}
            path={path}
            index={i}
          />
        ))
      )}

    </div>
  )
}