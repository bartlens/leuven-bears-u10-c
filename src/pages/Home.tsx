import { Link } from 'react-router-dom'
import { team } from '../data/team'
import { getNextTraining } from '../data/trainings'
import { HeroTitlePeek } from '../components/HeroTitlePeek'
import { useSheetData } from '../sheet/SheetProvider'
import { formatMatchTitle, matchTitleClass } from '../lib/formatMatchTitle'

function startMs(dateIso: string, timeHHmm: string) {
  const [hh, mm] = timeHHmm.split(':').map((n) => Number(n) || 0)
  const d = new Date(`${dateIso}T00:00:00`)
  d.setHours(hh, mm, 0, 0)
  return d.getTime()
}

const outlineBtn =
  'inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-hoop/55 bg-transparent px-5 py-2.5 text-sm font-bold text-hoop-bright transition hover:bg-hoop/10 active:bg-hoop/15 sm:w-auto'

export function Home() {
  const { matches, datedTrainings } = useSheetData()
  const nextMatch = matches.find((m) => m.status === 'upcoming')
  const nextMatchTitle = nextMatch
    ? formatMatchTitle(nextMatch.venue, nextMatch.opponent)
    : null
  const nextTraining = getNextTraining(new Date(), datedTrainings)

  const matchAt = nextMatch
    ? startMs(nextMatch.date, nextMatch.time.slice(0, 5))
    : Number.POSITIVE_INFINITY
  const trainingStart = nextTraining.training.time.slice(0, 5)
  const trainingAt = startMs(nextTraining.dateIso, trainingStart)
  const trainingFirst = trainingAt <= matchAt

  return (
    <div className="overflow-x-hidden">
      <section className="relative overflow-x-hidden grain mesh-grid">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 pb-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-6 lg:pb-5 lg:pt-12">
          <div className="min-w-0 animate-in">
            <span className="mb-2.5 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-hoop" aria-hidden />
              Seizoen 2026-2027
            </span>
            <HeroTitlePeek name={team.name} category={team.category} enabled={false} />
            <p className="mt-3.5 max-w-xl text-base leading-relaxed text-muted">
              Jeugdbasket van de Leuven Bears: dribbels, dunk-dromen en
              high-fives.
            </p>
          </div>

          <div
            className="home-hero-photo animate-in"
            style={{ animationDelay: '0.12s' }}
          >
            <img
              src="/stickers/groep-u10c-2026-home.webp?v=20260918b"
              alt={`Leuven Bears U10C groepsfoto ${team.season}`}
              width={1400}
              height={626}
              className="home-hero-photo__img"
            />
          </div>
        </div>
      </section>

      {(nextMatch || nextTraining) && (
        <section className="mx-auto max-w-6xl px-4 pb-3 pt-0 sm:px-6">
          <div className="grid items-stretch gap-3 lg:grid-cols-2">
            {nextMatch && (
              <article
                className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-panel to-ink-soft p-3.5 sm:p-4"
                style={{ order: trainingFirst ? 2 : 1 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-hoop-bright">
                    Volgende match
                  </p>
                  <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                    {nextMatch.venue === 'thuis' ? 'Thuis' : 'Uit'}
                  </span>
                </div>
                <h2
                  className={`mt-1.5 font-display text-xl font-bold tracking-tight text-cream sm:text-2xl ${matchTitleClass}`}
                  title={nextMatchTitle ?? undefined}
                >
                  {nextMatchTitle}
                </h2>
                <p className="text-meta mt-1.5">
                  {formatDate(nextMatch.date)} · {nextMatch.time}
                </p>
                <p className="text-meta-caption mt-0.5 break-words">
                  {nextMatch.location}
                </p>
                <div className="mt-auto pt-3">
                  <Link to="/matchen" className={outlineBtn}>
                    Alle matchen →
                  </Link>
                </div>
              </article>
            )}

            <article
              className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-panel to-ink-soft p-3.5 sm:p-4"
              style={{ order: trainingFirst ? 1 : 2 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-hoop-bright">
                {nextTraining.isOngoing
                  ? 'Nu aan de gang'
                  : 'Volgende training'}
              </p>
              <h2 className="mt-1.5 font-display text-xl font-bold text-cream sm:text-2xl">
                {nextTraining.training.day}
              </h2>
              <p className="text-meta mt-1.5">
                {nextTraining.whenLabel} · {nextTraining.training.time}
              </p>
              <p className="text-meta-caption mt-0.5 break-words">
                {nextTraining.training.location}
              </p>
              <p className="text-meta mt-1">{nextTraining.training.focus}</p>
              <div className="mt-auto pt-3">
                <Link to="/trainingen" className={outlineBtn}>
                  Alle trainingen →
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('nl-BE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
