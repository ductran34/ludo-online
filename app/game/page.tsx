'use client'

import { useGame } from '@/context/GameProvider'

export default function GamePage() {
  const { state } = useGame()

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
      
      {/* Placeholder until we build components */}
      <h1 className="text-2xl font-bold mb-4">Ludo Game</h1>

      <div>
        Current Turn: {state.currentPlayerIndex}
      </div>

      <div>
        Game Status: {state.status}
      </div>

    </main>
  )
}