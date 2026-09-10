import { parseMatchesCsv } from './parseMatches'
import { parseAndMergeTrainingSheets } from './parseTrainings'
import { parseEventsCsv } from './parseEvents'
import { parseAfsprakenCsv } from './parseAfspraken'
import type { TeamDataPayload } from './types'

export const SHEET_ID = '1YhT3WYq8DzClJ6P5ItVLxelB7MJS5JcdbnJmVKOnD4s'

export const GIDS = {
  matches: '477367804',
  trainingsA: '1962606416',
  trainingsB: '2090515479',
  afspraken: '1883412318',
  tornooien: '384779886',
} as const

function csvUrl(gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`
}

async function fetchCsv(gid: string): Promise<string> {
  const res = await fetch(csvUrl(gid), {
    redirect: 'follow',
    headers: {
      // Google sometimes varies response by UA
      'User-Agent': 'leuven-bears-u10-c-sheet-sync/1.0',
    },
  })
  if (!res.ok) {
    throw new Error(`Sheet gid ${gid} failed: HTTP ${res.status}`)
  }
  return await res.text()
}

/** Fetch + parse all team tabs from the attendance Google Sheet. */
export async function loadTeamData(): Promise<TeamDataPayload> {
  const [matchesCsv, trainA, trainB, afsprakenCsv, eventsCsv] =
    await Promise.all([
      fetchCsv(GIDS.matches),
      fetchCsv(GIDS.trainingsA),
      fetchCsv(GIDS.trainingsB),
      fetchCsv(GIDS.afspraken),
      fetchCsv(GIDS.tornooien),
    ])

  const matches = parseMatchesCsv(matchesCsv)
  const trainings = parseAndMergeTrainingSheets([trainA, trainB])
  const events = parseEventsCsv(eventsCsv)
  const afspraken = parseAfsprakenCsv(afsprakenCsv)

  if (matches.length === 0) {
    throw new Error('No matches parsed from sheet')
  }

  return {
    matches,
    trainings,
    events,
    afspraken,
    fetchedAt: new Date().toISOString(),
  }
}

/** Parse from local sample CSV strings (dev / tests). */
export function loadTeamDataFromCsvs(csvs: {
  matches: string
  trainingsA: string
  trainingsB: string
  afspraken: string
  tornooien: string
}): TeamDataPayload {
  return {
    matches: parseMatchesCsv(csvs.matches),
    trainings: parseAndMergeTrainingSheets([
      csvs.trainingsA,
      csvs.trainingsB,
    ]),
    events: parseEventsCsv(csvs.tornooien),
    afspraken: parseAfsprakenCsv(csvs.afspraken),
    fetchedAt: new Date().toISOString(),
  }
}
