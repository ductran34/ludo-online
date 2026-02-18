// lib/aiBot.ts

import { GameState } from './gameEngine'
import { isSafeZone } from './board'

export function runBotTurn(state: GameState, playerIndex: number) {
  const player = state.players[playerIndex]
  if (!player) return null

  const dice = Math.floor(Math.random() * 6) + 1

  const pawnToMove = chooseBestPawn(state, playerIndex, dice)

  return {
    dice,
    pawnId: pawnToMove?.id
  }
}

function chooseBestPawn(
  state: GameState,
  playerIndex: number,
  dice: number
) {
  const player = state.players[playerIndex]

  let bestPawn = null
  let highestScore = -1

  player.pawns.forEach(pawn => {
    const newPos = pawn.position + dice

    let score = 0

    // Prioritize reaching home
    if (newPos >= 57) score += 100

    // Prioritize kill
    state.players.forEach((other, i) => {
      if (i === playerIndex) return
      other.pawns.forEach(p => {
        if (p.position === newPos && !p.isShielded) {
          score += 50
        }
      })
    })

    // Avoid unsafe
    if (!isSafeZone(newPos)) score += 10

    if (score > highestScore) {
      highestScore = score
      bestPawn = pawn
    }
  })

  return bestPawn
}