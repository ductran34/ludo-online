// lib/powerSystem.ts

import { Player } from './gameEngine'

const DOUBLE_ROLL_SPAWN = 2
const PERFECT_MOVE_SPAWN = 2
const SHIELD_SPAWN = 2
const EXTRA_TURN_SPAWN = 4

let boardPowers = generateBoardPowers()

export function generateBoardPowers() {
  const randomPositions = (count: number) =>
    Array.from({ length: count }).map(
      () => Math.floor(Math.random() * 52)
    )

  return {
    doubleRoll: randomPositions(DOUBLE_ROLL_SPAWN),
    perfectMove: randomPositions(PERFECT_MOVE_SPAWN),
    shield: randomPositions(SHIELD_SPAWN),
    extraTurn: randomPositions(EXTRA_TURN_SPAWN)
  }
}

export function handlePowerCollection(player: Player, position: number) {
  Object.keys(boardPowers).forEach((type: any) => {
    if (boardPowers[type].includes(position)) {
      player.powers[type]++
      boardPowers[type] =
        boardPowers[type].filter((p: number) => p !== position)
    }
  })
}