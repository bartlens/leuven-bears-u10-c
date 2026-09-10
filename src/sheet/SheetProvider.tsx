import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { matches as snapshotMatches, type Match } from '../data/matches'
import {
  datedTrainings as snapshotTrainings,
  type DatedTraining,
} from '../data/trainings'
import { events as snapshotEvents, type TeamEvent } from '../data/events'
import {
  matchAfspraken as snapshotAfspraken,
  type MatchAfspraken,
} from '../data/afspraken'

const CACHE_KEY = 'u10c-team-data-v1'
/** Session cache TTL — 7 minutes (within the 5–10 min target). */
const CACHE_TTL_MS = 7 * 60 * 1000

type TeamDataResponse = {
  matches: Match[]
  trainings: DatedTraining[]
  events: TeamEvent[]
  afspraken: MatchAfspraken
  fetchedAt: string
}

type CachedPayload = TeamDataResponse & { cachedAt: number }

export type SheetData = {
  matches: Match[]
  datedTrainings: DatedTraining[]
  events: TeamEvent[]
  afspraken: MatchAfspraken
  /** Where the currently displayed data came from. */
  source: 'live' | 'cache' | 'snapshot'
  fetchedAt: string | null
  loading: boolean
}

const SheetContext = createContext<SheetData | null>(null)

function readCache(): CachedPayload | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedPayload
    if (!parsed?.matches?.length || !parsed.cachedAt) return null
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(data: TeamDataResponse) {
  try {
    const payload: CachedPayload = { ...data, cachedAt: Date.now() }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

function isValidPayload(data: unknown): data is TeamDataResponse {
  if (!data || typeof data !== 'object') return false
  const d = data as TeamDataResponse
  return (
    Array.isArray(d.matches) &&
    d.matches.length > 0 &&
    Array.isArray(d.trainings) &&
    Array.isArray(d.events) &&
    !!d.afspraken &&
    Array.isArray(d.afspraken.bullets)
  )
}

const snapshot: SheetData = {
  matches: snapshotMatches,
  datedTrainings: snapshotTrainings,
  events: snapshotEvents,
  afspraken: snapshotAfspraken,
  source: 'snapshot',
  fetchedAt: null,
  loading: false,
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SheetData>(() => {
    const cached = readCache()
    if (cached) {
      return {
        matches: cached.matches,
        datedTrainings: cached.trainings,
        events: cached.events,
        afspraken: cached.afspraken,
        source: 'cache',
        fetchedAt: cached.fetchedAt,
        loading: false,
      }
    }
    return { ...snapshot, loading: true }
  })

  const applyLive = useCallback((payload: TeamDataResponse, from: 'live' | 'cache') => {
    writeCache(payload)
    setData({
      matches: payload.matches,
      datedTrainings: payload.trainings,
      events: payload.events,
      afspraken: payload.afspraken,
      source: from,
      fetchedAt: payload.fetchedAt,
      loading: false,
    })
  }, [])

  useEffect(() => {
    const existing = readCache()
    if (existing) {
      applyLive(existing, 'cache')
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch('/api/team-data')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: unknown = await res.json()
        if (!isValidPayload(json)) throw new Error('Invalid payload')
        if (cancelled) return
        applyLive(json, 'live')
      } catch {
        if (cancelled) return
        // Soft fail → keep static snapshot (or whatever we already show)
        setData((prev) => ({
          ...prev,
          loading: false,
          source: prev.source === 'live' || prev.source === 'cache' ? prev.source : 'snapshot',
        }))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [applyLive])

  const value = useMemo(() => data, [data])

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  )
}

export function useSheetData(): SheetData {
  const ctx = useContext(SheetContext)
  if (!ctx) {
    // Safe fallback if a page is rendered outside the provider
    return snapshot
  }
  return ctx
}
