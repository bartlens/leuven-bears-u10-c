import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader } from '../components/SectionHeader'
import { matchTitleClass } from '../lib/formatMatchTitle'
import { useSheetData } from '../sheet/SheetProvider'
import { team } from '../data/team'
import {
  buildCalendarEvents,
  brusselsTodayIso,
  monthGrid,
  monthLabel,
  type CalEvent,
} from '../lib/calendarEvents'

const WEEKDAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']
/** First batch of this-month list items; the rest opens via “Laad meer…”. */
const INITIAL_MONTH_ITEMS = 4

function dayNum(iso: string) {
  return Number(iso.slice(8, 10))
}

function formatDayHeading(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function Kalender() {
  const { matches, datedTrainings } = useSheetData()
  const todayIso = brusselsTodayIso()
  const [y, m] = todayIso.split('-').map(Number)
  const [cursor, setCursor] = useState({ year: y!, month: m! - 1 })
  const [selected, setSelected] = useState<string | null>(todayIso)
  const [showAllMonth, setShowAllMonth] = useState(false)

  const events = useMemo(
    () => buildCalendarEvents(datedTrainings, matches),
    [datedTrainings, matches],
  )

  const byDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>()
    for (const e of events) {
      const list = map.get(e.dateIso) ?? []
      list.push(e)
      map.set(e.dateIso, list)
    }
    return map
  }, [events])

  const cells = useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  )

  const selectedEvents = selected ? (byDate.get(selected) ?? []) : []

  const monthEvents = useMemo(() => {
    const prefix = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}`
    return events.filter((e) => e.dateIso.startsWith(prefix))
  }, [events, cursor.year, cursor.month])

  const visibleMonthEvents = showAllMonth
    ? monthEvents
    : monthEvents.slice(0, INITIAL_MONTH_ITEMS)
  const hasMoreMonth = !showAllMonth && monthEvents.length > INITIAL_MONTH_ITEMS

  const shiftMonth = (delta: number) => {
    setShowAllMonth(false)
    setCursor((c) => {
      const d = new Date(Date.UTC(c.year, c.month + delta, 1))
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
    })
  }

  const goToday = () => {
    setShowAllMonth(false)
    setCursor({ year: y!, month: m! - 1 })
    setSelected(todayIso)
  }

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Overzicht"
        title="Kalender"
        subtitle={`Alle trainingen en matchen van seizoen ${team.season} op één plek.`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-panel text-cream touch-manipulation hover:bg-white/5"
            aria-label="Vorige maand"
          >
            ‹
          </button>
          <h2 className="min-w-0 flex-1 text-center font-display text-xl font-bold capitalize text-cream sm:min-w-[12rem] sm:flex-none sm:text-2xl">
            {monthLabel(cursor.year, cursor.month)}
          </h2>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-panel text-cream touch-manipulation hover:bg-white/5"
            aria-label="Volgende maand"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="inline-flex min-h-11 items-center rounded-full border border-hoop/40 bg-hoop/15 px-4 text-sm font-bold uppercase tracking-wider text-hoop-bright touch-manipulation hover:bg-hoop/25"
        >
          Vandaag
        </button>
        <div className="ml-auto flex flex-wrap gap-3 text-xs font-semibold text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-warm" aria-hidden />
            Training
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-hoop" aria-hidden />
            Match
          </span>
        </div>
      </div>

      <div className="flex flex-col">
      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-ink-soft sm:block">
        <div className="grid grid-cols-7 border-b border-white/8 bg-ink/60">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-1 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((iso, idx) => {
            if (!iso) {
              return (
                <div
                  key={`pad-${idx}`}
                  className="min-h-[4.25rem] border-b border-r border-white/5 bg-ink/20 sm:min-h-[5.5rem]"
                />
              )
            }
            const dayEvents = byDate.get(iso) ?? []
            const isToday = iso === todayIso
            const isSelected = iso === selected
            const hasTraining = dayEvents.some((e) => e.kind === 'training')
            const hasMatch = dayEvents.some((e) => e.kind === 'match')

            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                className={`relative flex min-h-[4.25rem] flex-col items-stretch gap-1 border-b border-r border-white/5 px-1 py-1.5 text-left touch-manipulation transition sm:min-h-[5.5rem] sm:px-1.5 sm:py-2 ${
                  isSelected
                    ? 'bg-hoop/20 ring-1 ring-inset ring-hoop/50'
                    : 'hover:bg-white/5'
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-sm ${
                    isToday
                      ? 'bg-hoop text-white'
                      : 'text-cream/90'
                  }`}
                >
                  {dayNum(iso)}
                </span>
                <div className="mt-auto flex flex-wrap gap-0.5">
                  {hasTraining && (
                    <span className="h-1.5 w-1.5 rounded-full bg-warm sm:h-2 sm:w-2" />
                  )}
                  {hasMatch && (
                    <span className="h-1.5 w-1.5 rounded-full bg-hoop sm:h-2 sm:w-2" />
                  )}
                </div>
                <div className="hidden space-y-0.5 sm:block">
                  {dayEvents.slice(0, 2).map((e) => (
                    <p
                      key={e.id}
                      className={`truncate text-[10px] font-semibold leading-tight ${
                        e.kind === 'match' ? 'text-hoop-bright' : 'text-warm'
                      }`}
                    >
                      {e.kind === 'match' ? '🏀' : '⏱️'} {e.time.slice(0, 5)}
                    </p>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-muted">+{dayEvents.length - 2}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <section className="order-2 mt-8 rounded-3xl border border-white/10 bg-ink-soft p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold capitalize text-cream">
          {selected ? formatDayHeading(selected) : 'Kies een dag'}
        </h3>
        {selectedEvents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Geen training of match op deze dag.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {selectedEvents.map((e) => (
              <li
                key={e.id}
                className={`rounded-2xl border px-4 py-3 ${
                  e.kind === 'match'
                    ? 'border-hoop/35 bg-hoop/10'
                    : 'border-warm/30 bg-warm/10'
                }`}
              >
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <p
                    className={`min-w-0 font-display text-base font-bold text-cream ${matchTitleClass}`}
                    title={e.title}
                  >
                    {e.title}
                  </p>
                  <p
                    className={`text-sm font-bold ${
                      e.kind === 'match' ? 'text-hoop-bright' : 'text-warm'
                    }`}
                  >
                    {e.time}
                  </p>
                </div>
                <p className="text-meta mt-1">
                  {e.time} · {e.location}
                  {e.meta ? ` · ${e.meta}` : ''}
                </p>
                <p className="mt-2">
                  <Link
                    to={e.kind === 'match' ? '/matchen' : '/trainingen'}
                    className="inline-flex min-h-11 items-center text-sm font-bold text-hoop-bright hover:underline"
                  >
                    Meer op {e.kind === 'match' ? 'Matchen' : 'Trainingen'} →
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="order-1 mt-4 sm:order-3 sm:mt-8">
        <h3 className="font-display text-lg font-bold text-cream">
          Deze maand · {monthEvents.length} items
        </h3>
        {monthEvents.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Niets gepland in deze maand.</p>
        ) : (
          <div className="mt-4 space-y-2">
            <ul className="space-y-2">
              {visibleMonthEvents.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(e.dateIso)}
                    className="ui-card flex min-h-11 w-full items-start gap-3 bg-panel/60 text-left touch-manipulation transition hover:bg-white/5"
                  >
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        e.kind === 'match' ? 'bg-hoop' : 'bg-warm'
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-semibold text-cream ${matchTitleClass}`}
                        title={e.title}
                      >
                        {e.title}
                      </span>
                      <span className="text-meta mt-0.5 block">
                        {formatDayHeading(e.dateIso)} · {e.time} · {e.location}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {hasMoreMonth && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllMonth(true)}
                  className="btn-outline w-full sm:w-auto"
                >
                  Laad meer…
                </button>
              </div>
            )}
          </div>
        )}
      </section>
      </div>
    </div>
  )
}
