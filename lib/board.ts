// lib/board.ts

export type PathCell = {
  x: number
  y: number
  index: number
  safe: boolean
}

const CELL = 40
const OFFSET = 40

// Safe star positions chuẩn Ludo
export const SAFE_ZONES = [0, 8, 13, 21, 26, 34, 39, 47]

// Start index từng màu
export const START_INDEX = {
  red: 0,
  yellow: 13,
  green: 26,
  blue: 39
}

export function generatePathCoordinates(): PathCell[] {
  const path: PathCell[] = []

  // TOP ROW (left → right)
  for (let i = 0; i < 6; i++) {
    path.push(makeCell(OFFSET + i * CELL, OFFSET))
  }

  // RIGHT COLUMN
  for (let i = 1; i <= 6; i++) {
    path.push(makeCell(OFFSET + 5 * CELL, OFFSET + i * CELL))
  }

  // BOTTOM ROW
  for (let i = 4; i >= 0; i--) {
    path.push(makeCell(OFFSET + i * CELL, OFFSET + 6 * CELL))
  }

  // LEFT COLUMN
  for (let i = 5; i >= 1; i--) {
    path.push(makeCell(OFFSET, OFFSET + i * CELL))
  }

  // Duplicate pattern to reach 52
  while (path.length < 52) {
    path.push({
      ...path[path.length % 18],
      index: path.length,
      safe: SAFE_ZONES.includes(path.length)
    })
  }

  return path.map((p, i) => ({
    ...p,
    index: i,
    safe: SAFE_ZONES.includes(i)
  }))
}

function makeCell(x: number, y: number): PathCell {
  return {
    x,
    y,
    index: 0,
    safe: false
  }
}

export function isSafeZone(position: number) {
  return SAFE_ZONES.includes(position)
}