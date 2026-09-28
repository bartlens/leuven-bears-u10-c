import type { Match } from '../data/matches'

/**
 * Live match phase from kickoff in Europe/Brussels.
 *
 * - before kickoff → upcoming
 * - kickoff until kickoff + 2h → ongoing (“Nu bezig”)
 * - after that window, or when the sheet already says `played` → done
 *
 * Done matches drop out of “volgende match” even if the score is still missing.
 * Scores are never invented here.
 *
 * Manual clock (any page): `?at=2026-09-27T16:00` is a Brussels wall time.
 * `?at=2026-09-27T14:00:00Z` is an absolute instant.
 */

export type MatchPhase = 'upcoming' | 'ongoing' | 'done'

export const MATCH_WINDOW_MS = 2 * 60 * 60 * 1000

const BRUSSELS = 'Europe/Brussels'

export type MatchScheduleInput = Pick<Match, 'date' | 'time' | 'status'>

function tzParts(instant: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(instant)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === '24' ? '0' : parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  }
}

function tzOffsetMs(instant: Date, timeZone: string): number {
  const p = tzParts(instant, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return asUtc - instant.getTime()
}

/** Wall-clock YYYY-MM-DD + HH:MM in Europe/Brussels → epoch ms. */
export function brusselsWallClockMs(dateIso: string, timeHHmm: string): number {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso.trim())
  const time = /^(\d{1,2}):(\d{2})/.exec(timeHHmm.trim())
  if (!date || !time) return Number.NaN

  const year = Number(date[1])
  const month = Number(date[2])
  const day = Number(date[3])
  const hour = Number(time[1])
  const minute = Number(time[2])
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59
  ) {
    return Number.NaN
  }

  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0)
  const offsetGuess = tzOffsetMs(new Date(utcGuess), BRUSSELS)
  const instant = utcGuess - offsetGuess
  const offsetAtInstant = tzOffsetMs(new Date(instant), BRUSSELS)
  if (offsetGuess === offsetAtInstant) return instant
  return utcGuess - offsetAtInstant
}

export function matchHasScore(match: {
  scoreUs?: string
  scoreThem?: string
}): boolean {
  return Boolean(match.scoreUs?.trim() && match.scoreThem?.trim())
}

export function getMatchPhase(
  match: MatchScheduleInput,
  now = new Date(),
): MatchPhase {
  if (match.status === 'played') return 'done'

  const start = brusselsWallClockMs(match.date, match.time)
  if (!Number.isFinite(start)) {
    const today = tzParts(now, BRUSSELS)
    const todayIso = `${today.year}-${String(today.month).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`
    if (match.date > todayIso) return 'upcoming'
    return 'done'
  }

  const t = now.getTime()
  if (t < start) return 'upcoming'
  if (t < start + MATCH_WINDOW_MS) return 'ongoing'
  return 'done'
}

function kickoffSort<T extends MatchScheduleInput>(a: T, b: T): number {
  const am = brusselsWallClockMs(a.date, a.time)
  const bm = brusselsWallClockMs(b.date, b.time)
  const aOk = Number.isFinite(am)
  const bOk = Number.isFinite(bm)
  if (aOk && bOk && am !== bm) return am - bm
  if (aOk && !bOk) return -1
  if (!aOk && bOk) return 1
  return a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
}

/** Active = still the current or a future match. Finished = sheet-played or 2h after kickoff. */
export function partitionMatches<T extends MatchScheduleInput>(
  matches: readonly T[],
  now = new Date(),
): { active: T[]; finished: T[] } {
  const active: T[] = []
  const finished: T[] = []
  for (const match of matches) {
    if (getMatchPhase(match, now) === 'done') finished.push(match)
    else active.push(match)
  }
  active.sort(kickoffSort)
  finished.sort(kickoffSort)
  return { active, finished }
}

/** Earliest match that is still upcoming or inside the 2h window. */
export function getNextMatch<T extends MatchScheduleInput>(
  matches: readonly T[],
  now = new Date(),
): T | undefined {
  return partitionMatches(matches, now).active[0]
}

/**
 * `?at=` override. Naive timestamps are Europe/Brussels wall time.
 * A trailing Z or numeric offset is an absolute instant.
 */
export function parseClockParam(raw: string | null | undefined): Date | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const absolute = new Date(trimmed)
    return Number.isNaN(absolute.getTime()) ? null : absolute
  }
  const wall = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(trimmed)
  if (!wall) return null
  const ms = brusselsWallClockMs(wall[1], wall[2])
  if (!Number.isFinite(ms)) return null
  return new Date(ms)
}

/** Current instant, or `?at=` when present on the page URL. */
export function clockNow(fallback = new Date()): Date {
  if (typeof window === 'undefined') return fallback
  const raw = new URLSearchParams(window.location.search).get('at')
  if (raw == null) return fallback
  return parseClockParam(raw) ?? fallback
}
