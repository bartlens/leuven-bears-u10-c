/**
 * Fixture for match phase (Europe/Brussels).
 * Run: node --experimental-strip-types scripts/check-match-phase.ts
 */
import assert from 'node:assert/strict'
import { getNextTraining } from '../src/data/trainings.ts'
import {
  brusselsWallClockMs,
  getMatchPhase,
  getNextMatch,
  parseClockParam,
  partitionMatches,
} from '../src/lib/matchPhase.ts'

function at(wall: string): Date {
  const parsed = parseClockParam(wall)
  assert.ok(parsed, wall)
  return parsed
}

const clem = {
  id: 'm1',
  opponent: 'Clem Scherpenheuvel A',
  date: '2026-09-27',
  time: '15:15',
  venue: 'uit' as const,
  location: 'Stedelijke Sporthal Scherpenheuvel',
  status: 'upcoming' as const,
}

const aarschot = {
  id: 'm2',
  opponent: 'GSC Aarschot B',
  date: '2026-10-03',
  time: '09:00',
  venue: 'thuis' as const,
  location: 'Campus Redingenhof',
  status: 'upcoming' as const,
}

const late = {
  id: 'late',
  date: '2026-11-01',
  time: '23:30',
  status: 'upcoming' as const,
}

assert.equal(
  new Date(brusselsWallClockMs('2026-09-27', '15:15')).toISOString(),
  '2026-09-27T13:15:00.000Z',
)
assert.equal(
  new Date(brusselsWallClockMs('2026-10-24', '09:00')).toISOString(),
  '2026-10-24T07:00:00.000Z',
)
assert.equal(
  new Date(brusselsWallClockMs('2026-10-26', '09:00')).toISOString(),
  '2026-10-26T08:00:00.000Z',
)
assert.equal(
  new Date(brusselsWallClockMs('2026-12-12', '16:00')).toISOString(),
  '2026-12-12T15:00:00.000Z',
)

assert.equal(getMatchPhase(clem, at('2026-09-27T15:14')), 'upcoming')
assert.equal(getMatchPhase(clem, at('2026-09-27T15:15')), 'ongoing')
assert.equal(getMatchPhase(clem, at('2026-09-27T17:14')), 'ongoing')
assert.equal(getMatchPhase(clem, at('2026-09-27T17:15')), 'done')
assert.equal(getMatchPhase(clem, at('2026-09-28T12:00')), 'done')

assert.equal(getMatchPhase(late, at('2026-11-02T01:29')), 'ongoing')
assert.equal(getMatchPhase(late, at('2026-11-02T01:30')), 'done')

const playedDuringWindow = {
  ...clem,
  id: 'played',
  status: 'played' as const,
  scoreUs: '32',
  scoreThem: '18',
  result: 'W' as const,
}
assert.equal(getMatchPhase(playedDuringWindow, at('2026-09-27T16:00')), 'done')

const during = at('2026-09-27T16:00')
const after = at('2026-09-27T17:15')
const before = at('2026-09-27T14:00')

assert.equal(getNextMatch([clem, aarschot], during)?.id, 'm1')
assert.equal(getNextMatch([aarschot, clem], during)?.id, 'm1')
assert.equal(getNextMatch([clem, aarschot], before)?.id, 'm1')
assert.equal(getNextMatch([clem, aarschot], after)?.id, 'm2')
assert.equal(
  getNextMatch([playedDuringWindow, aarschot], during)?.id,
  'm2',
)

const split = partitionMatches([clem, aarschot, playedDuringWindow], after)
assert.deepEqual(
  split.finished.map((m) => m.id),
  ['m1', 'played'],
)
assert.deepEqual(
  split.active.map((m) => m.id),
  ['m2'],
)

const trainingDuring = getNextTraining(at('2026-09-28T18:00'))
assert.equal(trainingDuring.isOngoing, true)
assert.equal(trainingDuring.dateIso, '2026-09-28')

const trainingAfter = getNextTraining(at('2026-09-28T19:00'))
assert.equal(trainingAfter.isOngoing, false)
assert.equal(trainingAfter.dateIso, '2026-10-01')

console.log('match phase checks ok')
