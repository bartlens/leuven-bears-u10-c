import { parseCsv } from './csv'
import type { Match } from './types'

const HOME =
  'Campus Redingenhof, Remi Vandervaerenlaan, 3000 Leuven'

const WEEKDAY_NL =
  /^(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\s+/i

/** Parse DD/MM/YYYY or D/M/YYYY → YYYY-MM-DD */
function parseBelgianDate(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function venueFromLocation(location: string): 'thuis' | 'uit' {
  return /redingenhof/i.test(location) ? 'thuis' : 'uit'
}

function normalizeLocation(location: string, venue: 'thuis' | 'uit'): string {
  if (venue === 'thuis') return HOME
  return location.replace(/\s+/g, ' ').trim()
}

/**
 * Match sheet header cells look like:
 * Match N
 * Weekday DD/MM/YYYY
 * Opponent
 * HH:MM Location…
 */
export function parseMatchesCsv(csvText: string): Match[] {
  const rows = parseCsv(csvText)
  if (rows.length === 0) return []

  const header = rows[0] ?? []
  const matches: Match[] = []
  let idx = 0

  for (const cell of header) {
    const text = cell.replace(/\r/g, '').trim()
    if (!/^Match\s+\d+/i.test(text)) continue

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    // lines[0] = Match N, [1] = weekday+date, [2] = opponent, [3] = time+loc
    const dateLine = lines[1] ?? ''
    const opponent = lines[2] ?? ''
    const timeLoc = lines[3] ?? ''

    const datePart = dateLine.replace(WEEKDAY_NL, '').trim()
    const date = parseBelgianDate(datePart)
    if (!date || !opponent) continue

    const timeMatch = timeLoc.match(/^(\d{1,2}:\d{2})\s*(.*)$/)
    const time = timeMatch?.[1] ?? ''
    const rawLoc = (timeMatch?.[2] ?? timeLoc).trim()
    const venue = venueFromLocation(rawLoc)
    const location = normalizeLocation(rawLoc, venue)

    idx += 1
    matches.push({
      id: `m${idx}`,
      opponent: opponent.trim(),
      date,
      time,
      venue,
      location,
      status: 'upcoming',
    })
  }

  return matches
}
