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
  'inline-flex min-h-10 w-fit shrink-0 items-center justify-center self-start rounded-2xl border border-white/18 bg-transparent px-4 py-2 text-sm font-semibold text-muted transition hover:border-hoop/40 hover:text-hoop-bright sm:self-center'

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
  const trainingStart = nextTraining.training.time.slice(0, 5) // "17:30"
  const trainingAt = startMs(nextTraining.dateIso, trainingStart)
  const trainingFirst = trainingAt <= matchAt

  return (
    <div className="overflow-x-hidden">
      <section className="relative overflow-x-hidden grain mesh-grid">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 pb-5 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-6 lg:pb-5 lg:pt-12">
          <div className="min-w-0 animate-in">
            <span className="mb-2.5 inline-flex items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Seizoen {team.season}
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
              src="/stickers/groep-u10c-2026-home.webp?v=20260918"
              alt={`Leuven Bears U10C groepsfoto ${team.season}`}
              width={1280}
              height={457}
              className="home-hero-photo__img"
            />
          </div>
        </div>
      </section>

      {(nextMatch || nextTraining) && (
        <section className="mx-auto max-w-6xl px-4 pb-4 pt-0 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-2">
            {nextMatch && (
              <div
                className="card-lift overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-panel to-ink-soft"
                style={{ order: trainingFirst ? 2 : 1 }}
              >
                <div className="flex h-full flex-col p-3.5 sm:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-hoop-bright">
                    Volgende match
                  </p>
                  <div className="mt-1.5 grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-5">
                    <div className="min-w-0">
                      <h2
                        className={`font-display text-xl font-bold tracking-tight text-cream sm:text-2xl ${matchTitleClass}`}
                        title={nextMatchTitle ?? undefined}
                      >
                        {nextMatchTitle}
                      </h2>
                      <p className="text-meta mt-1">
                        {formatDate(nextMatch.date)} · {nextMatch.time} ·{' '}
                        <span className="font-semibold text-warm">
                          {nextMatch.venue === 'thuis' ? 'Thuis' : 'Uit'}
                        </span>
                      </p>
                      <p className="text-meta-caption mt-0.5 break-words">
                        {nextMatch.location}
                      </p>
                    </div>
                    <Link to="/matchen" className={outlineBtn}>
                      Alle matchen →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div
              className="card-lift overflow-hidden rounded-3xl border border-hoop/25 bg-gradient-to-br from-hoop/15 via-panel to-ink-soft"
              style={{ order: trainingFirst ? 1 : 2 }}
            >
              <div className="flex h-full flex-col p-3.5 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-hoop-bright">
                  {nextTraining.isOngoing
                    ? 'Nu aan de gang'
                    : 'Volgende training'}
                </p>
                <div className="mt-1.5 grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-5">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold text-cream sm:text-2xl">
                      {nextTraining.training.day}
                    </h2>
                    <p className="text-meta mt-1">
                      {nextTraining.whenLabel} ·{' '}
                      <span className="font-semibold text-warm">
                        {nextTraining.training.time}
                      </span>
                    </p>
                    <p className="text-meta-caption mt-0.5 break-words">
                      {nextTraining.training.location}
                    </p>
                    <p className="text-meta mt-1">{nextTraining.training.focus}</p>
                  </div>
                  <Link to="/trainingen" className={outlineBtn}>
                    Alle trainingen →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
