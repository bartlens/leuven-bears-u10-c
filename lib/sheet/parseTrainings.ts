import { parseCsv } from './csv'
import type { DatedTraining } from './types'

const TIME = '17:30–19:00'
const LOC_MA = 'Heilig-Hart Heverlee'
const LOC_DO = 'Campus Redingenhof (Leuven)'
const FOCUS_MA = 'Skills, fun drills & teamgevoel'
const FOCUS_DO = 'Wedstrijdvormen & spelinzicht'

/** Parse D-M-YYYY or DD-MM-YYYY → YYYY-MM-DD */
function parseSheetDate(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (!m) return null
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function weekdayOfIso(iso: string): number {
  return new Date(`${iso}T12:00:00`).getDay()
}

function slotForWeekday(weekday: number): Pick<
  DatedTraining,
  'day' | 'time' | 'location' | 'focus'
> {
  if (weekday === 4) {
    return {
      day: 'Donderdag',
      time: TIME,
      location: LOC_DO,
      focus: FOCUS_DO,
    }
  }
  return {
    day: 'Maandag',
    time: TIME,
    location: LOC_MA,
    focus: FOCUS_MA,
  }
}

/** Extract training dates from the date-row of an attendance sheet. */
export function parseTrainingDatesCsv(csvText: string): string[] {
  const rows = parseCsv(csvText)
  if (rows.length < 2) return []

  const dateRow = rows[1] ?? []
  const dates: string[] = []
  for (const cell of dateRow) {
    const iso = parseSheetDate(cell)
    if (iso) dates.push(iso)
  }
  return dates
}

export function buildDatedTrainings(dateIsos: string[]): DatedTraining[] {
  const unique = [...new Set(dateIsos)].sort()
  return unique.map((dateIso, i) => {
    const wd = weekdayOfIso(dateIso)
    return {
      id: `dt-${i + 1}`,
      dateIso,
      ...slotForWeekday(wd),
    }
  })
}

export function parseAndMergeTrainingSheets(csvTexts: string[]): DatedTraining[] {
  const dates: string[] = []
  for (const text of csvTexts) {
    dates.push(...parseTrainingDatesCsv(text))
  }
  return buildDatedTrainings(dates)
}
