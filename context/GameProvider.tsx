'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { createInitialGameState, gameReducer } from '@/lib/gameEngine'
import { GameState } from '@/lib/gameEngine'
export type GameContextType = {
  state: GameState
  dispatch: React.Dispatch<any>
  playerId: string
  isSpectator: boolean
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState
  )

  const playerId =
    typeof window !== 'undefined'
      ? localStorage.getItem('ludo_player_id') || generatePlayerId()
      : ''

  const isSpectator = state.players.every(p => p.id !== playerId)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ludo_player_id', playerId)
    }
  }, [playerId])

  return (
    <GameContext.Provider
      value={{ state, dispatch, playerId, isSpectator }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used inside GameProvider')
  return context
}

function generatePlayerId() {
  const id = crypto.randomUUID()
  localStorage.setItem('ludo_player_id', id)
  return id
}