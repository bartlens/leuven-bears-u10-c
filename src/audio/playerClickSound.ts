/**
 * Procedural per-player click/tap sounds via Web Audio API.
 * Soft, short, cartoon/sports vibes — no audio assets shipped.
 */

type SoundKind =
  | 'boing'
  | 'whistle'
  | 'rimClank'
  | 'bounce'
  | 'zap'
  | 'swoosh'
  | 'plink'
  | 'powerup'
  | 'sparkle'
  | 'thud'
  | 'squeak'
  | 'cheer'

const SOUNDS: SoundKind[] = [
  'boing',
  'whistle',
  'rimClank',
  'bounce',
  'zap',
  'swoosh',
  'plink',
  'powerup',
  'sparkle',
  'thud',
  'squeak',
  'cheer',
]

/** Brief labels for docs / commit messages (index = player.number - 1). */
export const PLAYER_SOUND_LABELS: Record<SoundKind, string> = {
  boing: 'springy cartoon boing',
  whistle: 'referee whistle peep',
  rimClank: 'metal rim clank',
  bounce: 'rubber ball bounce',
  zap: 'comic electric zap',
  swoosh: 'net swoosh',
  plink: 'bright arcade plink',
  powerup: 'chiptune power-up blip',
  sparkle: 'twinkly magic sparkle',
  thud: 'soft floor thud',
  squeak: 'sneaker squeak',
  cheer: 'tiny crowd cheer chirp',
}

let ctx: AudioContext | null = null
let lastPlayAt = 0
const DEBOUNCE_MS = 150
let activeStop: (() => void) | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

/** Unlock / resume AudioContext on first user gesture (browser autoplay policy). */
export async function unlockAudio(): Promise<void> {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') {
    try {
      await c.resume()
    } catch {
      /* ignore */
    }
  }
}

function softGain(c: AudioContext): GainNode {
  const g = c.createGain()
  g.gain.value = 0
  g.connect(c.destination)
  return g
}

function envelope(
  g: GainNode,
  peak: number,
  attack: number,
  hold: number,
  release: number,
  start: number,
) {
  g.gain.cancelScheduledValues(start)
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(peak, start + attack)
  g.gain.setValueAtTime(peak, start + attack + hold)
  g.gain.exponentialRampToValueAtTime(0.0001, start + attack + hold + release)
}

function noiseBuffer(c: AudioContext, duration: number): AudioBuffer {
  const len = Math.max(1, Math.floor(c.sampleRate * duration))
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function playBoing(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'triangle'
  const base = 180 + (seed % 5) * 18
  osc.frequency.setValueAtTime(base + 220, t)
  osc.frequency.exponentialRampToValueAtTime(base, t + 0.18)
  envelope(g, 0.11, 0.008, 0.04, 0.16, t)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.28)
  return () => {
    try {
      osc.stop()
    } catch {
      /* */
    }
  }
}

function playWhistle(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'sine'
  const f = 1400 + (seed % 7) * 40
  osc.frequency.setValueAtTime(f, t)
  osc.frequency.linearRampToValueAtTime(f + 180, t + 0.06)
  osc.frequency.linearRampToValueAtTime(f - 60, t + 0.14)
  envelope(g, 0.07, 0.01, 0.05, 0.1, t)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.22)
  return () => {
    try {
      osc.stop()
    } catch {
      /* */
    }
  }
}

function playRimClank(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'square'
  osc.frequency.setValueAtTime(520 + (seed % 4) * 30, t)
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.08)
  envelope(g, 0.06, 0.002, 0.02, 0.12, t)
  // metallic overtone
  const osc2 = c.createOscillator()
  const g2 = softGain(c)
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(1100 + (seed % 3) * 50, t)
  envelope(g2, 0.04, 0.001, 0.01, 0.08, t)
  osc.connect(g)
  osc2.connect(g2)
  osc.start(t)
  osc2.start(t)
  osc.stop(t + 0.2)
  osc2.stop(t + 0.15)
  return () => {
    try {
      osc.stop()
      osc2.stop()
    } catch {
      /* */
    }
  }
}

function playBounce(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'sine'
  const base = 90 + (seed % 5) * 8
  osc.frequency.setValueAtTime(base * 2.2, t)
  osc.frequency.exponentialRampToValueAtTime(base, t + 0.09)
  envelope(g, 0.13, 0.004, 0.02, 0.1, t)
  // noise thump
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 0.06)
  const ng = softGain(c)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 400
  envelope(ng, 0.08, 0.001, 0.01, 0.05, t)
  src.connect(filter)
  filter.connect(ng)
  osc.connect(g)
  osc.start(t)
  src.start(t)
  osc.stop(t + 0.18)
  src.stop(t + 0.08)
  return () => {
    try {
      osc.stop()
      src.stop()
    } catch {
      /* */
    }
  }
}

function playZap(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'sawtooth'
  const f0 = 700 + (seed % 6) * 55
  osc.frequency.setValueAtTime(f0, t)
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.12)
  envelope(g, 0.06, 0.002, 0.02, 0.1, t)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.18)
  return () => {
    try {
      osc.stop()
    } catch {
      /* */
    }
  }
}

function playSwoosh(c: AudioContext, t: number, seed: number) {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 0.22)
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 2.5
  const f = 900 + (seed % 5) * 80
  filter.frequency.setValueAtTime(f * 0.5, t)
  filter.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.14)
  const g = softGain(c)
  envelope(g, 0.1, 0.02, 0.04, 0.12, t)
  src.connect(filter)
  filter.connect(g)
  src.start(t)
  src.stop(t + 0.24)
  return () => {
    try {
      src.stop()
    } catch {
      /* */
    }
  }
}

function playPlink(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'sine'
  const f = 880 + (seed % 8) * 55
  osc.frequency.setValueAtTime(f, t)
  osc.frequency.exponentialRampToValueAtTime(f * 0.85, t + 0.15)
  envelope(g, 0.1, 0.005, 0.03, 0.14, t)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.22)
  return () => {
    try {
      osc.stop()
    } catch {
      /* */
    }
  }
}

function playPowerup(c: AudioContext, t: number, seed: number) {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  const stops: OscillatorNode[] = []
  notes.forEach((freq, i) => {
    const osc = c.createOscillator()
    const g = softGain(c)
    osc.type = 'square'
    const f = freq * (1 + ((seed % 3) - 1) * 0.02)
    osc.frequency.value = f
    const start = t + i * 0.045
    envelope(g, 0.05, 0.005, 0.02, 0.06, start)
    osc.connect(g)
    osc.start(start)
    osc.stop(start + 0.12)
    stops.push(osc)
  })
  return () => {
    for (const o of stops) {
      try {
        o.stop()
      } catch {
        /* */
      }
    }
  }
}

function playSparkle(c: AudioContext, t: number, seed: number) {
  const stops: OscillatorNode[] = []
  for (let i = 0; i < 3; i++) {
    const osc = c.createOscillator()
    const g = softGain(c)
    osc.type = 'sine'
    const f = 1600 + i * 320 + (seed % 5) * 40
    osc.frequency.value = f
    const start = t + i * 0.035
    envelope(g, 0.045, 0.004, 0.015, 0.08, start)
    osc.connect(g)
    osc.start(start)
    osc.stop(start + 0.12)
    stops.push(osc)
  }
  return () => {
    for (const o of stops) {
      try {
        o.stop()
      } catch {
        /* */
      }
    }
  }
}

function playThud(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'triangle'
  const f = 70 + (seed % 4) * 6
  osc.frequency.setValueAtTime(f * 1.6, t)
  osc.frequency.exponentialRampToValueAtTime(f, t + 0.1)
  envelope(g, 0.14, 0.005, 0.03, 0.12, t)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.2)
  return () => {
    try {
      osc.stop()
    } catch {
      /* */
    }
  }
}

function playSqueak(c: AudioContext, t: number, seed: number) {
  const osc = c.createOscillator()
  const g = softGain(c)
  osc.type = 'sine'
  const f = 1100 + (seed % 6) * 70
  osc.frequency.setValueAtTime(f, t)
  osc.frequency.linearRampToValueAtTime(f * 1.35, t + 0.05)
  osc.frequency.linearRampToValueAtTime(f * 0.9, t + 0.1)
  envelope(g, 0.07, 0.005, 0.02, 0.08, t)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.16)
  return () => {
    try {
      osc.stop()
    } catch {
      /* */
    }
  }
}

function playCheer(c: AudioContext, t: number, seed: number) {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, 0.28)
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1400 + (seed % 5) * 100
  filter.Q.value = 1.2
  const g = softGain(c)
  envelope(g, 0.08, 0.01, 0.08, 0.14, t)
  // two happy chirps on top
  const osc = c.createOscillator()
  const og = softGain(c)
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(660 + (seed % 4) * 40, t)
  osc.frequency.setValueAtTime(880 + (seed % 4) * 40, t + 0.08)
  envelope(og, 0.05, 0.005, 0.04, 0.1, t)
  src.connect(filter)
  filter.connect(g)
  osc.connect(og)
  src.start(t)
  osc.start(t)
  src.stop(t + 0.3)
  osc.stop(t + 0.22)
  return () => {
    try {
      src.stop()
      osc.stop()
    } catch {
      /* */
    }
  }
}

const PLAYERS: Record<SoundKind, (c: AudioContext, t: number, seed: number) => () => void> = {
  boing: playBoing,
  whistle: playWhistle,
  rimClank: playRimClank,
  bounce: playBounce,
  zap: playZap,
  swoosh: playSwoosh,
  plink: playPlink,
  powerup: playPowerup,
  sparkle: playSparkle,
  thud: playThud,
  squeak: playSqueak,
  cheer: playCheer,
}

function kindForPlayer(playerNumber: number): SoundKind {
  const idx = ((playerNumber - 1) % SOUNDS.length + SOUNDS.length) % SOUNDS.length
  return SOUNDS[idx]!
}

/**
 * Play the unique click sound for a player (by jersey number or id suffix).
 * Debounced; skips when document is hidden; unlocks AudioContext on gesture.
 */
export function playPlayerClickSound(player: {
  id?: string
  number: number
}): void {
  if (typeof document !== 'undefined' && document.hidden) return

  const now = performance.now()
  if (now - lastPlayAt < DEBOUNCE_MS) return
  lastPlayAt = now

  if (activeStop) {
    activeStop()
    activeStop = null
  }

  const c = getCtx()
  if (!c) return

  void unlockAudio().then(() => {
    if (document.hidden) return
    const audio = getCtx()
    if (!audio) return
    const kind = kindForPlayer(player.number)
    const seed =
      player.number * 17 +
      (player.id ? player.id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) : 0)
    const t = audio.currentTime + 0.01
    activeStop = PLAYERS[kind](audio, t, seed)
  })
}
