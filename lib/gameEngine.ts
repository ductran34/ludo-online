// lib/gameEngine.ts

import { handlePowerCollection } from './powerSystem'

export type Pawn = {
  id: string
  position: number // -1 base, 0-51 path, 52-57 home stretch
  isShielded: boolean
}

export type Player = {
  id: string
  name: string
  color: string
  ready: boolean
  pawns: Pawn[]
  powers: {
    doubleRoll: number
    perfectMove: number
    shield: number
    extraTurn: number
  }
}

export type GameState = {
  status: 'lobby' | 'countdown' | 'playing' | 'finished'
  players: Player[]
  currentPlayerIndex: number
  diceValue: number | null
  winner: string | null
  turnQueue: number[]
}

export function createInitialGameState(): GameState {
  return {
    status: 'lobby',
    players: [],
    currentPlayerIndex: 0,
    diceValue: null,
    winner: null,
    turnQueue: []
  }
}

export function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {

    case 'JOIN':
      if (state.players.length >= 4) return state

      return {
        ...state,
        players: [
          ...state.players,
          createPlayer(action.payload.id, action.payload.name, action.payload.color)
        ]
      }

    case 'READY':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.payload ? { ...p, ready: !p.ready } : p
        )
      }

    case 'START_GAME':
      return {
        ...state,
        status: 'playing'
      }

    case 'ROLL_DICE':
      return {
        ...state,
        diceValue: action.payload
      }

    case 'MOVE_PAWN':
      return movePawn(state, action.payload)

    case 'NEXT_TURN':
      return nextTurn(state)

    default:
      return state
  }
}

function createPlayer(id: string, name: string, color: string): Player {
  return {
    id,
    name,
    color,
    ready: false,
    pawns: Array.from({ length: 4 }).map((_, i) => ({
      id: `${id}_pawn_${i}`,
      position: -1,
      isShielded: false
    })),
    powers: {
      doubleRoll: 0,
      perfectMove: 0,
      shield: 0,
      extraTurn: 0
    }
  }
}

function movePawn(state: GameState, payload: any): GameState {
  const { playerIndex, pawnId, steps } = payload

  const players = [...state.players]
  const player = players[playerIndex]

  const pawn = player.pawns.find(p => p.id === pawnId)
  if (!pawn) return state

  pawn.position += steps

  // Collect power
  handlePowerCollection(player, pawn.position)

  // Kill logic
  players.forEach((other, index) => {
    if (index === playerIndex) return
    other.pawns.forEach(p => {
      if (p.position === pawn.position && !p.isShielded) {
        p.position = -1
      }
    })
  })

  // Win condition
  const finished = player.pawns.every(p => p.position >= 57)
  if (finished) {
    return { ...state, winner: player.id, status: 'finished' }
  }

  return { ...state, players }
}

function nextTurn(state: GameState): GameState {
  const nextIndex =
    (state.currentPlayerIndex + 1) % state.players.length

  return {
    ...state,
    currentPlayerIndex: nextIndex,
    diceValue: null
  }
}