import { Link } from 'react-router-dom'
import { team } from '../data/team'
import { getNextTraining } from '../data/trainings'
import { HeroTitlePeek } from '../components/HeroTitlePeek'
import { useSheetData } from '../sheet/SheetProvider'
import { formatMatchTitle, matchTitleClass } from '../lib/formatMatchTitle'

const quickLinks = [
  { to: '/spelers', label: 'Spelers', emoji: '👕', desc: 'Team & staff' },
  { to: '/trainingen', label: 'Trainingen', emoji: '⏱️', desc: 'Ma & Do 17:30' },
  { to: '/kalender', label: 'Kalender', emoji: '📅', desc: 'Trainingen & matchen' },
  { to: '/matchen', label: 'Matchen', emoji: '🏀', desc: 'Uitslagen & agenda' },
  { to: '/evenementen', label: 'Evenementen', emoji: '🎉', desc: 'Extra fun' },
  { to: '/gedragscodes', label: 'Gedragscodes', emoji: '🤝', desc: 'Veilig sporten' },
]

function startMs(dateIso: string, timeHHmm: string) {
  const [hh, mm] = timeHHmm.split(':').map((n) => Number(n) || 0)
  const d = new Date(`${dateIso}T00:00:00`)
  d.setHours(hh, mm, 0, 0)
  return d.getTime()
}

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
        <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-6 pt-14 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] lg:items-center lg:gap-6 lg:pb-8 lg:pt-20">
          <div className="min-w-0 animate-in">
            <span className="mb-4 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-hoop/40 bg-hoop/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-hoop-bright">
              Seizoen {team.season}
            </span>
            <HeroTitlePeek name={team.name} category={team.category} enabled={false} />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Jeugdbasket van de Leuven Bears: dribbels, dunk-dromen en
              high-fives. #WEBEARS — ouders juichen, kids scoren (of bijna).
            </p>
          </div>

          <div
            className="home-hero-photo animate-in"
            style={{ animationDelay: '0.12s' }}
          >
            <img
              src="/stickers/groep-u10c-2026.webp"
              alt={`Leuven Bears U10C groepsfoto ${team.season}`}
              width={1280}
              height={573}
              className="home-hero-photo__img"
            />
          </div>
        </div>
      </section>

      {(nextMatch || nextTraining) && (
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-0 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-2">
            {nextMatch && (
              <div
                className="card-lift overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-panel to-ink-soft"
                style={{ order: trainingFirst ? 2 : 1 }}
              >
                <div className="flex h-full flex-col p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
                    Volgende match
                  </p>
                  <div className="mt-2 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
                    <div className="min-w-0">
                      <h2
                        className={`font-display text-xl font-bold tracking-tight text-cream sm:text-2xl ${matchTitleClass}`}
                        title={nextMatchTitle ?? undefined}
                      >
                        {nextMatchTitle}
                      </h2>
                      <p className="mt-2 text-muted">
                        {formatDate(nextMatch.date)} · {nextMatch.time} ·{' '}
                        <span className="font-semibold text-warm">
                          {nextMatch.venue === 'thuis' ? 'Thuis' : 'Uit'}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-muted break-words">
                        {nextMatch.location}
                      </p>
                    </div>
                    <Link
                      to="/matchen"
                      className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center self-start rounded-2xl border border-hoop/40 bg-hoop/20 px-5 py-3 text-sm font-bold text-hoop-bright transition hover:bg-hoop/30 active:bg-hoop/30 sm:self-center"
                    >
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
              <div className="flex h-full flex-col p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
                  {nextTraining.isOngoing
                    ? 'Nu aan de gang'
                    : 'Volgende training'}
                </p>
                <div className="mt-2 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">
                      {nextTraining.training.day}
                    </h2>
                    <p className="mt-2 text-muted">
                      {nextTraining.whenLabel} ·{' '}
                      <span className="font-semibold text-warm">
                        {nextTraining.training.time}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted break-words">
                      {nextTraining.training.location}
                    </p>
                    <p className="mt-2 text-sm text-cream/80">
                      {nextTraining.training.focus}
                    </p>
                  </div>
                  <Link
                    to="/trainingen"
                    className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center self-start rounded-2xl border border-hoop/40 bg-hoop/20 px-5 py-3 text-sm font-bold text-hoop-bright transition hover:bg-hoop/30 active:bg-hoop/30 sm:self-center"
                  >
                    Alle trainingen →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <h2 className="mb-6 font-display text-xl font-bold text-cream">
          Snel naar…
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-lift group rounded-2xl border border-white/10 bg-panel p-5"
            >
              <span className="inline-block text-2xl transition-transform group-hover:scale-125 group-active:scale-125 group-focus-within:scale-125">
                {item.emoji}
              </span>
              <p className="mt-3 font-display text-lg font-bold text-cream">
                {item.label}
              </p>
              <p className="text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
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
