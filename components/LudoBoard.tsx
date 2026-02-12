"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { ref, set, onValue, update, remove } from "firebase/database"

type PlayerData = {
  name: string
  position: number
}

export default function LudoBoard() {
  // State local
  const [players, setPlayers] = useState<Record<string, PlayerData>>({})
  const [currentTurn, setCurrentTurn] = useState<string | null>(null)
  const [dice, setDice] = useState<number | null>(null)
  const [inputs, setInputs] = useState(["", "", "", ""])
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null)

  const positions = ["top-left", "top-right", "bottom-left", "bottom-right"] as const

  // Listen to Firebase changes
  useEffect(() => {
    const playersRef = ref(db, "players")
    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {}
      setPlayers(data)
    })

    const turnRef = ref(db, "currentTurn")
    const unsubscribeTurn = onValue(turnRef, (snap) => setCurrentTurn(snap.val()))

    const diceRef = ref(db, "dice")
    const unsubscribeDice = onValue(diceRef, (snap) => setDice(snap.val()))

    return () => {
      unsubscribePlayers()
      unsubscribeTurn()
      unsubscribeDice()
    }
  }, [])

  // Join player
  const handleJoin = async (index: number) => {
    if (!inputs[index]) return

    // Generate unique playerId
    const id = Math.random().toString(36).substring(2, 10)
    setLocalPlayerId(id)

    const playerRef = ref(db, `players/${id}`)
    await set(playerRef, { name: inputs[index], position: index })

    // Nếu chưa có currentTurn, init
    if (!currentTurn) {
      await set(ref(db, "currentTurn"), id)
      await set(ref(db, "dice"), 0)
    }
  }

  // Roll dice
  const handleRollDice = async () => {
    if (!localPlayerId || currentTurn !== localPlayerId) return

    const value = Math.floor(Math.random() * 6) + 1
    await update(ref(db, "/"), { dice: value })

    // Next turn dựa trên playerId
    const joinedIds = Object.keys(players)
    if (joinedIds.length === 0) return
    const currentIndex = joinedIds.indexOf(currentTurn!)
    const nextIndex = (currentIndex + 1) % joinedIds.length
    const nextTurn = joinedIds[nextIndex]
    await update(ref(db, "/"), { currentTurn: nextTurn })
  }

  // Restart game
  const handleRestart = async () => {
    await remove(ref(db, "/"))
    setDice(null)
    setCurrentTurn(null)
    setPlayers({})
    setInputs(["", "", "", ""])
    setLocalPlayerId(null)
  }

  return (
    <div className="relative w-full h-screen p-8">
      {positions.map((pos, i) => {
        // Tìm player đang ở position này
        const playerEntry = Object.entries(players).find(([_, p]) => p.position === i)
        const playerId = playerEntry?.[0] || null
        const playerData = playerEntry?.[1] || null

        const isCurrentPlayerTurn = playerId && localPlayerId === currentTurn && localPlayerId === playerId

        const posClass =
          pos === "top-left"
            ? "absolute top-4 left-4"
            : pos === "top-right"
            ? "absolute top-4 right-4"
            : pos === "bottom-left"
            ? "absolute bottom-4 left-4"
            : "absolute bottom-4 right-4"

        return (
          <div key={i} className={`${posClass} flex items-center space-x-2`}>
            {!playerData ? (
              <>
                <input
                  placeholder="Enter name"
                  value={inputs[i]}
                  onChange={(e) =>
                    setInputs((prev) => {
                      const newArr = [...prev]
                      newArr[i] = e.target.value
                      return newArr
                    })
                  }
                  className="border px-2 py-1 w-32"
                />
                <button
                  onClick={() => handleJoin(i)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Join
                </button>
              </>
            ) : (
              <>
                <span className="font-bold text-lg">{playerData.name}</span>
                {isCurrentPlayerTurn && (
                  <button
                    onClick={handleRollDice}
                    className={`px-3 py-1 bg-green-500 text-white rounded ${
                      i === 0 || i === 2 ? "ml-2" : "mr-2"
                    }`}
                  >
                    Roll Dice
                  </button>
                )}
              </>
            )}
          </div>
        )
      })}

      {/* Dice hiển thị giữa màn hình */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
        {dice ?? "-"}
      </div>

      {/* Restart button */}
      <button
        onClick={handleRestart}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500 text-white rounded"
      >
        Restart
      </button>
    </div>
  )
}