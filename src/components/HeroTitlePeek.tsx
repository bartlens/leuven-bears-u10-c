import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { players, type Player } from '../data/players'
import { playHihiGiggle, unlockAudio } from '../audio/playerClickSound'
import { PlayerFigure } from './PlayerFigure'

type Mode = 'peek' | 'party'

type Burst = {
  key: number
  mode: Mode
  cast: Player[]
  laughingIds: Set<string>
  reduced: boolean
}

const DEBOUNCE_MS = 900
const PEEK_DURATION_MS = 1750
const PARTY_DURATION_MS = 2000

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

function pickCast(mode: Mode): Player[] {
  const shuffled = shuffle(players)
  if (mode === 'peek') {
    const n = 2 + Math.floor(Math.random() * 3) // 2–4
    return shuffled.slice(0, n)
  }
  const n = Math.max(8, shuffled.length - Math.floor(Math.random() * 3))
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

/** Some kids laugh this burst (~40–70% of the cast). */
function pickLaughers(cast: Player[]): Set<string> {
  const ids = new Set<string>()
  for (const p of cast) {
    if (Math.random() < 0.55) ids.add(p.id)
  }
  // Guarantee at least one laugher when cast is big enough
  if (ids.size === 0 && cast[0]) ids.add(cast[0].id)
  return ids
}

function peekSlots(
  count: number,
): { left: string; delay: string; wave: number; rise: number }[] {
  // Slightly outside 0–100% so heads sit around the sides of “U10 C”
  const bases =
    count === 2
      ? [-6, 106]
      : count === 3
        ? [-8, 50, 108]
        : [-10, 28, 72, 110]
  const rises = count === 2 ? [1.05, 0.92] : count === 3 ? [1, 1.12, 0.95] : [1.08, 0.9, 1.15, 0.98]
  return bases.slice(0, count).map((left, i) => ({
    left: `${left}%`,
    delay: `${i * 0.08}s`,
    wave: (i % 3) + 1,
    rise: rises[i] ?? 1,
  }))
}

function partySlots(count: number): { left: string; top: string; delay: string; scale: number }[] {
  const slots: { left: number; top: number; scale: number }[] = [
    { left: 8, top: 55, scale: 0.92 },
    { left: 22, top: 18, scale: 0.85 },
    { left: 38, top: 62, scale: 1 },
    { left: 50, top: 8, scale: 0.9 },
    { left: 62, top: 58, scale: 0.95 },
    { left: 78, top: 22, scale: 0.88 },
    { left: 92, top: 52, scale: 0.9 },
    { left: 15, top: 88, scale: 0.8 },
    { left: 48, top: 92, scale: 0.82 },
    { left: 85, top: 85, scale: 0.8 },
    { left: 30, top: 40, scale: 0.78 },
    { left: 70, top: 38, scale: 0.78 },
  ]
  return slots.slice(0, count).map((s, i) => ({
    left: `${s.left}%`,
    top: `${s.top}%`,
    delay: `${i * 0.045}s`,
    scale: s.scale,
  }))
}

const CONFETTI = ['🐻', '🏀', '🧡', '⭐', '🎉']

type Props = {
  name: string
  category: string
}

export function HeroTitlePeek({ name, category }: Props) {
  const [burst, setBurst] = useState<Burst | null>(null)
  const lastAt = useRef(0)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const giggleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const burstKey = useRef(0)
  const labelId = useId()

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current)
      if (giggleTimer.current) clearTimeout(giggleTimer.current)
    }
  }, [])

  const trigger = useCallback(() => {
    const now = performance.now()
    if (now - lastAt.current < DEBOUNCE_MS) return
    lastAt.current = now

    const reduced = prefersReducedMotion()
    const mode: Mode = Math.random() < 0.7 ? 'peek' : 'party'
    const cast = pickCast(mode)
    const laughingIds = pickLaughers(cast)
    burstKey.current += 1
    const next: Burst = {
      key: burstKey.current,
      mode,
      cast,
      laughingIds,
      reduced,
    }

    if (clearTimer.current) clearTimeout(clearTimer.current)
    if (giggleTimer.current) clearTimeout(giggleTimer.current)
    setBurst(next)

    void unlockAudio()

    // ~45% of bursts get a delayed “hihi” (not every peek); mute-aware
    if (Math.random() < 0.45) {
      const seed =
        cast.reduce((a, p) => a + p.number * 13, 0) + burstKey.current * 7
      giggleTimer.current = setTimeout(() => {
        playHihiGiggle(seed)
      }, 180 + Math.floor(Math.random() * 220))
    }

    const dur = reduced ? 500 : mode === 'party' ? PARTY_DURATION_MS : PEEK_DURATION_MS
    clearTimer.current = setTimeout(() => {
      setBurst((cur) => (cur?.key === next.key ? null : cur))
    }, dur)
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      trigger()
    }
  }

  const peekPos = burst?.mode === 'peek' ? peekSlots(burst.cast.length) : []
  const partyPos = burst?.mode === 'party' ? partySlots(burst.cast.length) : []

  const figClass = (player: Player, base: string, reduced: boolean) => {
    const laugh = burst?.laughingIds.has(player.id) ? ' is-laughing' : ''
    const red = reduced ? ' is-reduced' : ''
    return `hero-title-peek__fig ${base}${laugh}${red}`
  }

  return (
    <h1
      id={labelId}
      className="hero-title-peek font-display text-4xl font-black leading-[1.05] tracking-tight text-cream break-words sm:text-5xl lg:text-6xl"
    >
      <span
        role="button"
        tabIndex={0}
        aria-label="Laat de beren piepen"
        aria-describedby={labelId}
        onClick={trigger}
        onKeyDown={onKeyDown}
        className="hero-title-peek__hit relative inline-block cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-hoop focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {burst?.mode === 'party' && (
          <span
            className="hero-title-peek__party pointer-events-none absolute inset-0 z-0 overflow-visible"
            aria-hidden="true"
          >
            {burst.cast.map((player, i) => {
              const slot = partyPos[i]!
              return (
                <span
                  key={`${burst.key}-${player.id}`}
                  className={figClass(player, 'hero-title-peek__fig--party', burst.reduced)}
                  style={
                    {
                      left: slot.left,
                      top: slot.top,
                      animationDelay: slot.delay,
                      '--fig-scale': String(slot.scale),
                    } as CSSProperties
                  }
                >
                  <PlayerFigure player={player} className="hero-title-peek__svg" />
                </span>
              )
            })}
            {!burst.reduced &&
              CONFETTI.map((emoji, i) => (
                <span
                  key={`c-${burst.key}-${i}`}
                  className="hero-title-peek__confetti"
                  style={{
                    left: `${12 + i * 18}%`,
                    animationDelay: `${0.1 + i * 0.08}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
          </span>
        )}

        <span className="relative z-10">{name} </span>
        <span className="hero-title-peek__cat relative z-10 inline-block overflow-visible">
          {burst?.mode === 'peek' && (
            <span
              className="hero-title-peek__peeks pointer-events-none absolute z-0 overflow-visible"
              aria-hidden="true"
            >
              {burst.cast.map((player, i) => {
                const slot = peekPos[i]!
                const wave =
                  slot.wave === 1 ? 'wave-a' : slot.wave === 2 ? 'wave-b' : 'wave-c'
                return (
                  <span
                    key={`${burst.key}-${player.id}`}
                    className={`${figClass(
                      player,
                      'hero-title-peek__fig--peek',
                      burst.reduced,
                    )} ${wave}`}
                    style={
                      {
                        left: slot.left,
                        animationDelay: slot.delay,
                        '--peek-rise': String(slot.rise),
                      } as CSSProperties
                    }
                  >
                    <PlayerFigure player={player} className="hero-title-peek__svg" />
                  </span>
                )
              })}
            </span>
          )}
          <span className="relative z-10 bg-gradient-to-r from-hoop via-hoop-bright to-warm bg-clip-text text-transparent">
            {category}
          </span>
        </span>
      </span>
    </h1>
  )
}
