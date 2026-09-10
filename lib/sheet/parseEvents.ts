import { parseCsv } from './csv'
import type { TeamEvent } from './types'

const EMOJIS = ['🏀', '🏆'] as const

/**
 * Season year inference for seizoen 2026–2027:
 * Aug–Dec → 2026, Jan–Jul → 2027.
 */
function yearForMonth(month: number): number {
  return month >= 8 ? 2026 : 2027
}

function parseDayMonth(raw: string): { day: number; month: number } | null {
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})$/)
  if (!m) return null
  return { day: Number(m[1]), month: Number(m[2]) }
}

function toIso(day: number, month: number): string {
  const y = yearForMonth(month)
  return `${y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Normalize "12u45-19u20" / "9u15-18u30" → "12:45–19:20" */
function normalizeClockRange(raw: string): string {
  const m = raw
    .trim()
    .match(/^(\d{1,2})u(\d{2})\s*[-–]\s*(\d{1,2})u(\d{2})$/i)
  if (!m) return raw.trim()
  return `${m[1]!.padStart(2, '0')}:${m[2]}–${m[3]!.padStart(2, '0')}:${m[4]}`
}


/** Prefer city / known venue name over raw street address. */
function shortPlaceName(place: string): string {
  const postalCity = place.match(/\b\d{4}\s+([A-Za-zÀ-ÿ'’\-]+)\b/)
  if (postalCity?.[1]) return postalCity[1]

  const parts = place
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && !/^belgië$/i.test(p))

  if (parts.length >= 2 && /\d/.test(parts[0]!)) {
    return parts[1]!
  }

  const first = parts[0] ?? place
  return first.replace(/^Complexe sportif de\s+/i, '').trim()
}

/**
 * Tornooi header cells look like:
 * Tornooi N
 * weekday D/M [namiddag|voormiddag]
 * [optional time range]
 * Place / address
 */
export function parseEventsCsv(csvText: string): TeamEvent[] {
  const rows = parseCsv(csvText)
  if (rows.length === 0) return []

  const header = rows[0] ?? []
  const events: TeamEvent[] = []
  let idx = 0

  for (const cell of header) {
    const text = cell.replace(/\r/g, '').trim()
    if (!/^Tornooi\s+\d+/i.test(text)) continue

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    const titleLine = lines[0] ?? `Tornooi ${idx + 1}`
    const title = titleLine.replace(/\s+/g, ' ').trim()

    // Find date line: contains D/M
    let dateIso = ''
    let time = ''
    let periodHint = ''
    const placeParts: string[] = []

    for (let li = 1; li < lines.length; li++) {
      const line = lines[li]!
      const lower = line.toLowerCase()

      // e.g. "zaterdag 31/08" or "zaterdag 21/12 namiddag"
      const dateMatch = line.match(/(\d{1,2}\/\d{1,2})/)
      if (dateMatch && !dateIso) {
        const dm = parseDayMonth(dateMatch[1]!)
        if (dm) dateIso = toIso(dm.day, dm.month)
        if (/namiddag/i.test(line)) periodHint = 'Namiddag'
        if (/voormiddag/i.test(line)) periodHint = 'Voormiddag'
        continue
      }

      if (/^\d{1,2}u\d{2}/i.test(line)) {
        time = normalizeClockRange(line)
        continue
      }

      if (/^(namiddag|voormiddag)$/i.test(line)) {
        periodHint = line[0]!.toUpperCase() + line.slice(1).toLowerCase()
        continue
      }

      // skip empty-ish
      if (lower === 'false') continue
      placeParts.push(line)
    }

    if (!dateIso) continue

    if (!time && periodHint) time = periodHint

    const place = placeParts
      .join(', ')
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .trim()

    idx += 1
    const emoji = EMOJIS[(idx - 1) % EMOJIS.length]!
    const shortPlace = shortPlaceName(place)
    const niceTitle =
      shortPlace && !/^Tornooi\b/i.test(shortPlace)
        ? `Tornooi ${shortPlace}`
        : title
    const dateLabel = lines[1] ?? ''
    const description = [titleLine.replace(/\s+/g, ' '), dateLabel]
      .filter(Boolean)
      .join(' — ')
    events.push({
      id: `tornooi-${idx}`,
      title: niceTitle,
      date: dateIso,
      time,
      place,
      description,
      emoji,
      rsvpOpen: true,
    })
  }

  return events
}
