import type { Match } from '../data/matches'
import type { DatedTraining } from '../data/trainings'
import { trainings } from '../data/trainings'

export type CalKind = 'training' | 'match'

export type CalEvent = {
  id: string
  kind: CalKind
  dateIso: string
  time: string
  title: string
  location: string
  meta?: string
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function weekdayOfIso(iso: string): number {
  return new Date(`${iso}T12:00:00`).getDay()
}

function addDaysIso(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** Fill Mon/Thu slots after the last sheet training through `untilIso`. */
export function expandTrainingsThrough(
  dated: DatedTraining[],
  untilIso: string,
): DatedTraining[] {
  const byDate = new Map(dated.map((t) => [t.dateIso, t]))
  const last =
    dated.length > 0
      ? dated.reduce((a, b) => (a.dateIso > b.dateIso ? a : b)).dateIso
      : untilIso

  let cursor = addDaysIso(last, 1)
  let i = dated.length
  while (cursor <= untilIso) {
    const wd = weekdayOfIso(cursor)
    if (wd === 1 || wd === 4) {
      const base = wd === 4 ? trainings[1]! : trainings[0]!
      if (!byDate.has(cursor)) {
        byDate.set(cursor, {
          id: `dt-ext-${++i}`,
          dateIso: cursor,
          day: base.day,
          time: base.time,
          location: base.location,
          focus: base.focus,
        })
      }
    }
    cursor = addDaysIso(cursor, 1)
  }

  return [...byDate.values()].sort((a, b) => a.dateIso.localeCompare(b.dateIso))
}

export function buildCalendarEvents(
  dated: DatedTraining[],
  matches: Match[],
): CalEvent[] {
  const lastMatch =
    matches.length > 0
      ? matches.reduce((a, b) => (a.date > b.date ? a : b)).date
      : dated.at(-1)?.dateIso ?? '2026-12-31'
  const trainingsAll = expandTrainingsThrough(dated, lastMatch)

  const trainingEvents: CalEvent[] = trainingsAll.map((t) => ({
    id: t.id,
    kind: 'training',
    dateIso: t.dateIso,
    time: t.time,
    title: `Training · ${t.day}`,
    location: t.location,
    meta: t.focus,
  }))

  const matchEvents: CalEvent[] = matches.map((m) => ({
    id: m.id,
    kind: 'match',
    dateIso: m.date,
    time: m.time,
    title:
      m.venue === 'thuis'
        ? `Thuis vs ${m.opponent}`
        : `Uit vs ${m.opponent}`,
    location: m.location,
    meta:
      m.status === 'played' && m.scoreUs != null && m.scoreThem != null
        ? `Score ${m.scoreUs}–${m.scoreThem}${m.result ? ` (${m.result})` : ''}`
        : m.venue === 'thuis'
          ? 'Thuiswedstrijd'
          : 'Uitwedstrijd',
  }))

  return [...trainingEvents, ...matchEvents].sort((a, b) => {
    const d = a.dateIso.localeCompare(b.dateIso)
    if (d !== 0) return d
    return a.time.localeCompare(b.time)
  })
}

export function brusselsTodayIso(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Brussels',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const d = parts.find((p) => p.type === 'day')?.value
  return `${y}-${m}-${d}`
}

export function monthLabel(year: number, monthIndex: number): string {
  return new Date(Date.UTC(year, monthIndex, 15)).toLocaleDateString('nl-BE', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Monday-first grid cells for a month (null = empty pad). */
export function monthGrid(year: number, monthIndex: number): (string | null)[] {
  const first = new Date(Date.UTC(year, monthIndex, 1))
  // getUTCDay: 0 Sun … 6 Sat → Mon-first index
  const sun = first.getUTCDay()
  const monFirstOffset = (sun + 6) % 7
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  const cells: (string | null)[] = []
  for (let i = 0; i < monFirstOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${pad2(monthIndex + 1)}-${pad2(d)}`)
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
