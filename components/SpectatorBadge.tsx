'use client'

type Props = {
  isSpectator: boolean
}

export default function SpectatorBadge({ isSpectator }: Props) {
  if (!isSpectator) return null

  return (
    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
      Spectator Mode
    </div>
  )
}