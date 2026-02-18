'use client'

type Props = {
  visible: boolean
  onSelect: (value: number) => void
}

export default function PerfectMovePopup({ visible, onSelect }: Props) {
  if (!visible) return null

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl text-black">
        <h2 className="mb-4 font-bold">Choose Your Move</h2>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(n => (
            <button
              key={n}
              onClick={() => onSelect(n)}
              className="bg-neutral-200 p-2 rounded"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}