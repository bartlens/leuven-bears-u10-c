export type Training = {
  id: string
  day: string
  time: string
  location: string
  focus: string
}

export type DatedTraining = {
  id: string
  /** YYYY-MM-DD */
  dateIso: string
  day: string
  time: string
  location: string
  focus: string
}

export const trainings: Training[] = [
  {
    id: 't1',
    day: 'Maandag',
    time: '17:30–19:00',
    location: 'Heilig-Hart Heverlee',
    focus: 'Skills, fun drills & teamgevoel',
  },
  {
    id: 't2',
    day: 'Donderdag',
    time: '17:30–19:00',
    location: 'Campus Redingenhof (Leuven)',
    focus: 'Wedstrijdvormen & spelinzicht',
  },
]

const TIME = '17:30–19:00'
const LOC_MA = 'Heilig-Hart Heverlee'
const LOC_DO = 'Campus Redingenhof (Leuven)'
const FOCUS_MA = 'Skills, fun drills & teamgevoel'
const FOCUS_DO = 'Wedstrijdvormen & spelinzicht'

/**
 * Dated trainings from sheet-sync/1962606416.csv (Aug–Sep)
 * and sheet-sync/2090515479.csv (Sep–Oct). Times/locations =
 * team-confirmed Ma/Do pattern (sheet only lists dates).
 */
const SHEET_DATES: string[] = [
  // Aug–Sep 2026
  '2026-08-24',
  '2026-08-27',
  '2026-08-31',
  '2026-09-03',
  '2026-09-07',
  '2026-09-10',
  '2026-09-14',
  '2026-09-17',
  '2026-09-21',
  '2026-09-24',
  // Sep–Oct 2026
  '2026-09-28',
  '2026-10-01',
  '2026-10-05',
  '2026-10-08',
  '2026-10-12',
  '2026-10-15',
  '2026-10-19',
  '2026-10-22',
  '2026-10-26',
  '2026-10-29',
]

function weekdayOfIso(iso: string): number {
  // Noon avoids DST edge cases
  return new Date(`${iso}T12:00:00`).getDay()
}

function trainingForWeekday(weekday: number): Pick<
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
  // Monday (and any unexpected day → Ma template)
  return {
    day: 'Maandag',
    time: TIME,
    location: LOC_MA,
    focus: FOCUS_MA,
  }
}

export const datedTrainings: DatedTraining[] = SHEET_DATES.map((dateIso, i) => {
  const wd = weekdayOfIso(dateIso)
  const slot = trainingForWeekday(wd)
  return {
    id: `dt-${i + 1}`,
    dateIso,
    ...slot,
  }
})

/** Last sheet date (inclusive) after which we fall back to weekly Mon/Thu. */
export const lastSheetTrainingDate =
  SHEET_DATES[SHEET_DATES.length - 1] ?? '2026-10-29'

export const whatToBring = [
  'Sportkledij + indoor basketschoenen',
  'Drinkbus met water',
  'Handdoekje',
  'Goeie goesting 😄',
]

export const coachNotes = [
  'Elke maandag 17:30–19:00 in Heilig-Hart Heverlee; elke donderdag 17:30–19:00 in Campus Redingenhof.',
  'Datums tot eind oktober staan in de aanwezigheid-spreadsheet; daarna geldt het vaste Ma/Do-schema.',
  'Bij ziekte of afwezigheid: even de coach of Els (ploegafgevaardigde) een seintje geven.',
  'We spelen fair, juichen hard en lachen nog harder. #WEBEARS',
  'Ouders mogen kijken vanaf de tribune — high-fives na afloop zijn verplicht!',
]

const BRUSSELS = 'Europe/Brussels'

/** Monday = 1, Thursday = 4 (JS weekday). */
const TRAINING_BY_WEEKDAY: Record<number, Training> = {
  1: trainings[0],
  4: trainings[1],
}

function brusselsParts(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: BRUSSELS,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === '24' ? '0' : parts.hour),
    minute: Number(parts.minute),
    weekday: weekdayMap[parts.weekday] ?? 0,
  }
}

/** Add calendar days in a Y-M-D triple (no timezone math). */
function addDays(y: number, m: number, d: number, n: number) {
  const utc = new Date(Date.UTC(y, m - 1, d + n))
  return {
    year: utc.getUTCFullYear(),
    month: utc.getUTCMonth() + 1,
    day: utc.getUTCDate(),
    weekday: utc.getUTCDay(),
  }
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export type NextTraining = {
  training: Training
  /** YYYY-MM-DD in Europe/Brussels */
  dateIso: string
  /** e.g. "maandag 15 september" */
  whenLabel: string
  isToday: boolean
  /** True if we're currently inside 17:30–19:00 */
  isOngoing: boolean
}

function whenLabelFor(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function weeklyNextTraining(now: Date): NextTraining {
  const END_MIN = 19 * 60
  const START_MIN = 17 * 60 + 30
  const here = brusselsParts(now)
  const nowMin = here.hour * 60 + here.minute

  for (let offset = 0; offset < 8; offset++) {
    const cal =
      offset === 0
        ? {
            year: here.year,
            month: here.month,
            day: here.day,
            weekday: here.weekday,
          }
        : addDays(here.year, here.month, here.day, offset)

    const training = TRAINING_BY_WEEKDAY[cal.weekday]
    if (!training) continue

    if (offset === 0 && nowMin >= END_MIN) continue

    const dateIso = `${cal.year}-${pad2(cal.month)}-${pad2(cal.day)}`
    const isToday = offset === 0
    const isOngoing = isToday && nowMin >= START_MIN && nowMin < END_MIN

    return {
      training,
      dateIso,
      whenLabel: whenLabelFor(dateIso),
      isToday,
      isOngoing,
    }
  }

  return {
    training: trainings[0],
    dateIso: `${here.year}-${pad2(here.month)}-${pad2(here.day)}`,
    whenLabel: 'maandag',
    isToday: false,
    isOngoing: false,
  }
}

/**
 * Prefer the next dated training from the spreadsheet.
 * After the last known sheet date, fall back to weekly Mon/Thu.
 */
export function getNextTraining(now = new Date()): NextTraining {
  const END_MIN = 19 * 60
  const START_MIN = 17 * 60 + 30
  const here = brusselsParts(now)
  const todayIso = `${here.year}-${pad2(here.month)}-${pad2(here.day)}`
  const nowMin = here.hour * 60 + here.minute

  if (todayIso <= lastSheetTrainingDate) {
    for (const dt of datedTrainings) {
      if (dt.dateIso < todayIso) continue
      if (dt.dateIso === todayIso && nowMin >= END_MIN) continue

      const isToday = dt.dateIso === todayIso
      const isOngoing = isToday && nowMin >= START_MIN && nowMin < END_MIN
      const training: Training = {
        id: dt.id,
        day: dt.day,
        time: dt.time,
        location: dt.location,
        focus: dt.focus,
      }
      return {
        training,
        dateIso: dt.dateIso,
        whenLabel: whenLabelFor(dt.dateIso),
        isToday,
        isOngoing,
      }
    }
  }

  return weeklyNextTraining(now)
}

/** Upcoming sheet-dated trainings (not yet ended today). */
export function getUpcomingDatedTrainings(now = new Date()): DatedTraining[] {
  const END_MIN = 19 * 60
  const here = brusselsParts(now)
  const todayIso = `${here.year}-${pad2(here.month)}-${pad2(here.day)}`
  const nowMin = here.hour * 60 + here.minute

  return datedTrainings.filter((dt) => {
    if (dt.dateIso > todayIso) return true
    if (dt.dateIso === todayIso && nowMin < END_MIN) return true
    return false
  })
}
