"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { ref, set, onValue } from "firebase/database"

export default function FirebaseTest() {
  const [dice, setDice] = useState<number | null>(null)

  useEffect(() => {
    const diceRef = ref(db, "test/dice")

    onValue(diceRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setDice(data)
      }
    })
  }, [])

const rollDice = async () => {
  const value = Math.floor(Math.random() * 6) + 1
  console.log("Rolling:", value)

  await set(ref(db, "test/dice"), value)

  console.log("Written to Firebase")
}

  return (
    <div className="space-y-4">
      <button
        onClick={rollDice}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Roll Dice
      </button>

      {dice && <p>Dice: {dice}</p>}
    </div>
  )
}