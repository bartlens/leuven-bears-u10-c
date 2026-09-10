import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { players } from '../data/players'
import type { Player } from '../data/players'
import { useIdleFun } from '../fun/IdleFunContext'
import {
  playIdleBallBounce,
  playIdleBallScoop,
  playIdleFootstep,
  playRosterGiggleBurst,
  unlockAudio,
} from '../audio/playerClickSound'
import { IdleSideFigure } from './IdleSideFigure'

type Side = 'left' | 'right' | 'top'
type Phase = 'ball' | 'peek' | 'walk-in' | 'pickup' | 'walk-out' | 'done'

type Scene = {
  key: number
  side: Side
  player: Player
  ballX: number
  enterFrom: 'left' | 'right'
}

const IDLE_MS = 20_000
const COOLDOWN_MS = 45_000
const BALL_SETTLE_MS = 2100
const PEEK_MS = 1200
const WALK_IN_MS = 1800
const PICKUP_MS = 750
const WALK_OUT_MS = 2200
const LAUGH_MS = 4200

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function pickScene(key: number): Scene {
  // Always drop+bounce from above so the ball clearly stuitert (no quiet side-roll)
  const side: Side = 'top'
  const player = players[Math.floor(Math.random() * players.length)]!
  const ballX = 32 + Math.random() * 36
  const enterFrom: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'
  return { key, side, player, ballX, enterFrom }
}

export function IdleBallEasterEgg() {
  const location = useLocation()
  const { setRosterLaughing } = useIdleFun()
  const [scene, setScene] = useState<Scene | null>(null)
  const [phase, setPhase] = useState<Phase | null>(null)
  const [holding, setHolding] = useState(false)
  const [glance, setGlance] = useState(false)

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phaseTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const lastFinishedAt = useRef(0)
  const running = useRef(false)
  const sceneKey = useRef(0)
  const pathRef = useRef(location.pathname)

  pathRef.current = location.pathname

  const clearPhaseTimers = () => {
    for (const t of phaseTimers.current) clearTimeout(t)
    phaseTimers.current = []
  }

  const clearIdle = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
  }

  const scheduleIdle = () => {
    clearIdle()
    if (prefersReducedMotion()) return
    idleTimer.current = setTimeout(() => {
      startScene()
    }, IDLE_MS)
  }

  const finish = () => {
    running.current = false
    clearPhaseTimers()
    setHolding(false)
    setGlance(false)
    setScene(null)
    setPhase(null)
    setRosterLaughing(false)
    lastFinishedAt.current = performance.now()
    scheduleIdle()
  }

  const startScene = () => {
    if (running.current) return
    if (prefersReducedMotion()) return
    if (document.hidden) return
    if (performance.now() - lastFinishedAt.current < COOLDOWN_MS && lastFinishedAt.current > 0) {
      scheduleIdle()
      return
    }

    running.current = true
    clearIdle()
    clearPhaseTimers()
    sceneKey.current += 1
    const next = pickScene(sceneKey.current)
    setScene(next)
    setHolding(false)
    setGlance(true)
    setPhase('ball')
    void unlockAudio()

    const seed = next.player.number * 7 + next.key
    // Warm audio, then Bas N–style bounces synced to the drop
    phaseTimers.current.push(setTimeout(() => void unlockAudio(), 0))
    let at = 420
    const gaps = [0, 320, 220, 150, 100, 70, 48, 36]
    gaps.forEach((gap, i) => {
      at += gap
      const strength = Math.pow(0.68, i)
      const when = at
      phaseTimers.current.push(
        setTimeout(() => {
          void unlockAudio()
          playIdleBallBounce(seed + i, strength)
        }, when),
      )
    })

    const onSpelers = pathRef.current.startsWith('/spelers')
    const t0 = BALL_SETTLE_MS
    const tPeek = t0 + PEEK_MS
    const tWalk = tPeek + WALK_IN_MS
    const tPick = tWalk + PICKUP_MS
    const tOut = tPick + WALK_OUT_MS

    phaseTimers.current.push(
      setTimeout(() => {
        setPhase('peek')
        setGlance(true)
      }, t0),
      setTimeout(() => {
        setPhase('walk-in')
        setGlance(false)
        // Footsteps while approaching
        for (let i = 0; i < 5; i++) {
          phaseTimers.current.push(
            setTimeout(() => playIdleFootstep(seed + 20 + i), i * 340),
          )
        }
      }, tPeek),
      setTimeout(() => {
        setPhase('pickup')
        setHolding(true)
        setGlance(false)
        playIdleBallScoop(seed + 9)
        if (onSpelers) {
          setRosterLaughing(true)
          playRosterGiggleBurst()
          phaseTimers.current.push(
            setTimeout(() => setRosterLaughing(false), LAUGH_MS),
          )
        }
      }, tWalk),
      setTimeout(() => {
        setPhase('walk-out')
        setGlance(false)
        for (let i = 0; i < 6; i++) {
          phaseTimers.current.push(
            setTimeout(() => playIdleFootstep(seed + 40 + i), i * 320),
          )
        }
        // Occasional looks toward camera while leaving
        phaseTimers.current.push(
          setTimeout(() => setGlance(true), 380),
          setTimeout(() => setGlance(false), 780),
          setTimeout(() => setGlance(true), 1300),
          setTimeout(() => setGlance(false), 1680),
        )
      }, tPick),
      setTimeout(() => {
        finish()
      }, tOut),
    )
  }

  const bumpActivity = () => {
    // Keep AudioContext unlocked so idle SFX can play after a quiet wait
    void unlockAudio()
    if (running.current) return
    scheduleIdle()
  }

  useEffect(() => {
    scheduleIdle()
    const opts: AddEventListenerOptions = { passive: true }
    const warm = () => {
      void unlockAudio()
    }
    // Gesture events unlock audio (autoplay policy)
    for (const ev of ['pointerdown', 'keydown', 'touchstart'] as const) {
      window.addEventListener(ev, warm, opts)
    }
    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'keydown',
      'scroll',
      'touchstart',
      'mousemove',
      'wheel',
    ]
    for (const ev of events) window.addEventListener(ev, bumpActivity, opts)
    const onVis = () => {
      if (document.hidden) clearIdle()
      else bumpActivity()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      clearIdle()
      clearPhaseTimers()
      for (const ev of ['pointerdown', 'keydown', 'touchstart'] as const) {
        window.removeEventListener(ev, warm)
      }
      for (const ev of events) window.removeEventListener(ev, bumpActivity)
      document.removeEventListener('visibilitychange', onVis)
      setRosterLaughing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!running.current) scheduleIdle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  if (!scene || !phase || phase === 'done') return null

  const ballOnFloor =
    phase === 'ball' || phase === 'peek' || phase === 'walk-in'
  const showWalker =
    phase === 'peek' ||
    phase === 'walk-in' ||
    phase === 'pickup' ||
    phase === 'walk-out'

  // Facing: peek looks at us (still mirrored by side); walk faces toward/away along path
  const facing: 'left' | 'right' =
    phase === 'walk-out'
      ? scene.enterFrom // leave back the way they came
      : scene.enterFrom === 'left'
        ? 'right'
        : 'left' // walking toward ball from enter side

  return (
    <div className="idle-fun" aria-hidden="true">
      {ballOnFloor && (
        <span
          key={`ball-${scene.key}`}
          className={`idle-fun__ball idle-fun__ball--${scene.side}`}
          style={{ ['--ball-x' as string]: `${scene.ballX}%` }}
        >
          <svg viewBox="0 0 40 40" className="idle-fun__ball-svg">
            <circle cx="20" cy="20" r="17" fill="#f38019" />
            <path
              d="M20 3.5 V36.5 M3.5 20 H36.5 M8 9 Q20 14 32 9 M8 31 Q20 26 32 31"
              fill="none"
              stroke="#1a120e"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {showWalker && (
        <span
          key={`walk-${scene.key}-${phase === 'peek' ? 'peek' : 'move'}`}
          className={`idle-fun__walker idle-fun__walker--${scene.enterFrom} idle-fun__walker--${phase} ${
            holding ? 'is-holding' : ''
          } ${glance ? 'is-glance' : ''}`}
          style={{ ['--ball-x' as string]: `${scene.ballX}%` }}
        >
          <IdleSideFigure
            player={scene.player}
            facing={phase === 'peek' ? (scene.enterFrom === 'left' ? 'right' : 'left') : facing}
            glance={glance || phase === 'peek'}
            holding={holding}
            className="idle-fun__walker-svg"
          />
        </span>
      )}
    </div>
  )
}
