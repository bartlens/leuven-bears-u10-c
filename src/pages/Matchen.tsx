import { useId, useState } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { WinBadge } from '../components/WinBadge'
import { useSheetData } from '../sheet/SheetProvider'
import { team } from '../data/team'
import { attendanceCopy, links } from '../data/links'
import { formatMatchTitle, matchTitleClass } from '../lib/formatMatchTitle'

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('nl-BE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function Matchen() {
  const { matches, afspraken: matchAfspraken } = useSheetData()
  const upcoming = matches.filter((m) => m.status === 'upcoming')
  const past = matches.filter((m) => m.status === 'played')
  const [afsprakenOpen, setAfsprakenOpen] = useState(false)
  const afsprakenPanelId = useId()

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Game day"
        title="Matchen"
        subtitle={`Seizoen ${team.season}. Kom juichen en supporteren.`}
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <a
          href={links.attendanceSpreadsheet}
          target="_blank"
          rel="noreferrer"
          className="card-lift rounded-2xl border border-hoop/35 bg-hoop/10 px-5 py-4 transition hover:bg-hoop/20"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-hoop-bright">
            Aanwezigheid
          </p>
          <p className="mt-1 font-display text-lg font-bold text-cream">
            Spreadsheet openen →
          </p>
          <p className="mt-1 text-sm text-muted">{attendanceCopy.blurb}</p>
        </a>
        <a
          href={links.vblCalendarSync}
          target="_blank"
          rel="noreferrer"
          className="card-lift rounded-2xl border border-warm/30 bg-warm/10 px-5 py-4 transition hover:bg-warm/20"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-warm">
            VBL
          </p>
          <p className="mt-1 font-display text-lg font-bold text-cream">
            Kalender synchroniseren (VBL) →
          </p>
          <p className="mt-1 text-sm text-muted">
            Importeer de officiële wedstrijdkalender in je eigen agenda.
          </p>
        </a>
      </div>

      <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-ink-soft">
        <h2 className="m-0">
          <button
            type="button"
            aria-expanded={afsprakenOpen}
            aria-controls={afsprakenPanelId}
            onClick={() => setAfsprakenOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left touch-manipulation transition hover:bg-white/4 sm:px-6 sm:py-5"
          >
            <span className="font-display text-xl font-bold text-cream">
              {matchAfspraken.title}
            </span>
            <span
              aria-hidden
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-panel text-hoop-bright transition-transform duration-200 ${
                afsprakenOpen ? 'rotate-180' : ''
              }`}
            >
              ▾
            </span>
          </button>
        </h2>
        <div
          id={afsprakenPanelId}
          hidden={!afsprakenOpen}
          className="border-t border-white/8 px-5 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-5"
        >
          <ul className="space-y-2">
            {matchAfspraken.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-cream/90">
                <span className="shrink-0 text-hoop-bright" aria-hidden>
                  ●
                </span>
                {b}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-display text-lg font-bold text-warm">
            {matchAfspraken.draaischema.title}
          </h3>
          <ul className="mt-3 space-y-2">
            {matchAfspraken.draaischema.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-cream/90">
                <span className="shrink-0 text-warm" aria-hidden>
                  →
                </span>
                {b}
              </li>
            ))}
          </ul>
          <a
            href={links.attendanceSpreadsheet}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex text-sm font-bold text-hoop-bright hover:underline"
          >
            Aanwezigheid & afspraken in de spreadsheet →
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-bold text-cream">
          Aankomend ({upcoming.length})
        </h2>
        <div className="space-y-3">
          {upcoming.map((m, i) => {
            const title = formatMatchTitle(m.venue, m.opponent)
            return (
            <article
              key={m.id}
              className="card-lift animate-in grid grid-cols-1 items-center gap-4 rounded-2xl border border-white/10 bg-panel p-5 sm:grid-cols-[minmax(0,1fr)_auto]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                      m.venue === 'thuis'
                        ? 'bg-hoop/20 text-hoop-bright'
                        : 'bg-bear/50 text-warm'
                    }`}
                  >
                    {m.venue === 'thuis' ? 'Thuis' : 'Uit'}
                  </span>
                  <span className="text-sm text-muted">
                    {formatDate(m.date)} · {m.time}
                  </span>
                </div>
                <h3
                  className={`mt-2 font-display text-base font-bold text-cream sm:text-lg ${matchTitleClass}`}
                  title={title}
                >
                  {title}
                </h3>
                <p className="text-sm text-muted">{m.location}</p>
              </div>
              <span className="w-fit self-start rounded-xl border border-dashed border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted sm:self-center">
                Nog te spelen
              </span>
            </article>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-cream">
          Gespeeld
        </h2>
        {past.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-ink-soft px-5 py-8 text-sm text-muted">
            Nog geen gespeelde matchen in deze kalender — seizoen start eind
            september 2026.
          </p>
        ) : (
          <div className="space-y-3">
            {past.map((m, i) => {
              const title = formatMatchTitle(m.venue, m.opponent)
              return (
              <article
                key={m.id}
                className="card-lift animate-in grid grid-cols-1 items-center gap-4 rounded-2xl border border-white/10 bg-ink-soft p-5 sm:grid-cols-[minmax(0,1fr)_auto]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {m.result && <WinBadge result={m.result} />}
                    <span className="text-sm text-muted">
                      {formatDate(m.date)} ·{' '}
                      {m.venue === 'thuis' ? 'Thuis' : 'Uit'}
                    </span>
                  </div>
                  <h3
                    className={`mt-2 font-display text-base font-bold text-cream sm:text-lg ${matchTitleClass}`}
                    title={title}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-muted">{m.location}</p>
                </div>
                <div className="flex items-baseline gap-2 self-start font-display sm:self-center">
                  <span className="text-3xl font-black text-cream">
                    {m.scoreUs}
                  </span>
                  <span className="text-muted">–</span>
                  <span className="text-3xl font-black text-muted">
                    {m.scoreThem}
                  </span>
                </div>
              </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
