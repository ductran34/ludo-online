// lib/sound.ts

type SoundKey =
  | 'dice'
  | 'move'
  | 'kill'
  | 'power'
  | 'win'
  | 'button'

const sounds: Record<SoundKey, HTMLAudioElement | null> = {
  dice: null,
  move: null,
  kill: null,
  power: null,
  win: null,
  button: null
}

let initialized = false

export function initSounds() {
  if (initialized) return

  sounds.dice = new Audio('/sounds/dice.mp3')
  sounds.move = new Audio('/sounds/move.mp3')
  sounds.kill = new Audio('/sounds/kill.mp3')
  sounds.power = new Audio('/sounds/power.mp3')
  sounds.win = new Audio('/sounds/win.mp3')
  sounds.button = new Audio('/sounds/button.mp3')

  Object.values(sounds).forEach(sound => {
    if (!sound) return
    sound.preload = 'auto'
    sound.volume = 0.7
  })

  initialized = true
}

export function playSound(key: SoundKey) {
  if (!initialized) initSounds()

  const sound = sounds[key]
  if (!sound) return

  sound.currentTime = 0
  sound.play().catch(() => {})
}