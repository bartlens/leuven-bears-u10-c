import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { players } from '../data/players'
import type { Player } from '../data/players'
import { useIdleFun } from '../fun/IdleFunContext'
import {
  playIdleBallBounce,
  playIdleBallScoop,
  playRosterGiggleBurst,
  unlockAudio,
} from '../audio/playerClickSound'
import { PlayerFigure } from './PlayerFigure'

type Side = 'left' | 'right' | 'top'
type Phase = 'ball' | 'walk-in' | 'pickup' | 'walk-out' | 'done'

type Scene = {
  key: number
  side: Side
  player: Player
  /** Horizontal settle point as % of viewport */
  ballX: number
  /** Walk-in from this side */
  enterFrom: 'left' | 'right'
}

const IDLE_MS = 48_000
const COOLDOWN_MS = 90_000
const BALL_SETTLE_MS = 1400
const WALK_IN_MS = 1600
const PICKUP_MS = 700
const WALK_OUT_MS = 1800
const LAUGH_MS = 4200

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function pickScene(key: number): Scene {
  const sideRoll = Math.random()
  const side: Side = sideRoll < 0.34 ? 'left' : sideRoll < 0.68 ? 'right' : 'top'
  const player = players[Math.floor(Math.random() * players.length)]!
  const ballX =
    side === 'left'
      ? 22 + Math.random() * 18
      : side === 'right'
        ? 58 + Math.random() * 18
        : 30 + Math.random() * 40
  const enterFrom: 'left' | 'right' =
    side === 'right' ? 'left' : side === 'left' ? 'right' : Math.random() < 0.5 ? 'left' : 'right'
  return { key, side, player, ballX, enterFrom }
}

export function IdleBallEasterEgg() {
  const location = useLocation()
  const { setRosterLaughing } = useIdleFun()
  const [scene, setScene] = useState<Scene | null>(null)
  const [phase, setPhase] = useState<Phase | null>(null)
  const [holding, setHolding] = useState(false)

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

  const finish = () => {
    running.current = false
    clearPhaseTimers()
    setPhase('done')
    setHolding(false)
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
    setPhase('ball')
    void unlockAudio()

    const seed = next.player.number * 7 + next.key
    // Bounce sounds for top entry / settle
    if (next.side === 'top') {
      phaseTimers.current.push(
        setTimeout(() => playIdleBallBounce(seed), 280),
        setTimeout(() => playIdleBallBounce(seed + 1), 620),
        setTimeout(() => playIdleBallBounce(seed + 2), 980),
      )
    } else {
      phaseTimers.current.push(setTimeout(() => playIdleBallBounce(seed), 420))
    }

    const onSpelers = pathRef.current.startsWith('/spelers')

    phaseTimers.current.push(
      setTimeout(() => {
        setPhase('walk-in')
      }, BALL_SETTLE_MS),
      setTimeout(() => {
        setPhase('pickup')
        setHolding(true)
        playIdleBallScoop(seed + 9)
        if (onSpelers) {
          setRosterLaughing(true)
          playRosterGiggleBurst()
          phaseTimers.current.push(
            setTimeout(() => setRosterLaughing(false), LAUGH_MS),
          )
        }
      }, BALL_SETTLE_MS + WALK_IN_MS),
      setTimeout(() => {
        setPhase('walk-out')
      }, BALL_SETTLE_MS + WALK_IN_MS + PICKUP_MS),
      setTimeout(() => {
        finish()
      }, BALL_SETTLE_MS + WALK_IN_MS + PICKUP_MS + WALK_OUT_MS),
    )
  }

  const scheduleIdle = () => {
    clearIdle()
    if (prefersReducedMotion()) return
    idleTimer.current = setTimeout(() => {
      startScene()
    }, IDLE_MS)
  }

  const bumpActivity = () => {
    if (running.current) return
    scheduleIdle()
  }

  useEffect(() => {
    scheduleIdle()
    const opts: AddEventListenerOptions = { passive: true }
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
      for (const ev of events) window.removeEventListener(ev, bumpActivity)
      document.removeEventListener('visibilitychange', onVis)
      setRosterLaughing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Navigating resets idle clock (but doesn't cancel a running scene)
  useEffect(() => {
    if (!running.current) scheduleIdle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  if (!scene || !phase || phase === 'done') return null

  const ballOnFloor = phase === 'ball' || phase === 'walk-in'
  const showWalker =
    phase === 'walk-in' || phase === 'pickup' || phase === 'walk-out'

  return (
    <div className="idle-fun" aria-hidden="true">
      {ballOnFloor && (
        <span
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
          className={`idle-fun__walker idle-fun__walker--${scene.enterFrom} idle-fun__walker--${phase} ${
            holding ? 'is-holding' : ''
          }`}
          style={{ ['--ball-x' as string]: `${scene.ballX}%` }}
        >
          <PlayerFigure player={scene.player} className="idle-fun__walker-svg" />
          {holding && (
            <svg viewBox="0 0 28 28" className="idle-fun__held-ball" aria-hidden>
              <circle cx="14" cy="14" r="12" fill="#f38019" />
              <path
                d="M14 2.5 V25.5 M2.5 14 H25.5"
                fill="none"
                stroke="#1a120e"
                strokeWidth="1.3"
              />
            </svg>
          )}
        </span>
      )}
    </div>
  )
}
