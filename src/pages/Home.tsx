import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { team } from '../data/team'
import { getNextTraining } from '../data/trainings'
import { UpdatedHint } from '../components/UpdatedHint'
import { HeroTitlePeek } from '../components/HeroTitlePeek'
import { useSheetData } from '../sheet/SheetProvider'

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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div className="min-w-0 animate-in">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-hoop/40 bg-hoop/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-hoop-bright">
              Seizoen {team.season}
            </span>
            <HeroTitlePeek name={team.name} category={team.category} />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Jeugdbasket van de Leuven Bears: dribbels, dunk-dromen en
              high-fives. #WEBEARS — ouders juichen, kids scoren (of bijna).
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/matchen"
                className="animate-glow inline-flex min-h-11 items-center justify-center rounded-full bg-hoop px-6 py-3 text-sm font-bold text-white transition hover:bg-hoop-bright active:bg-hoop-bright"
              >
                Matchkalender
              </Link>
              <Link
                to="/info"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-cream transition hover:border-hoop/40 hover:bg-hoop/10 active:bg-hoop/10"
              >
                Info & contact
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center animate-in" style={{ animationDelay: '0.12s' }}>
            <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-panel/80 p-6 shadow-2xl shadow-hoop/20 backdrop-blur sm:p-8">
              <Logo size={120} className="mx-auto animate-float" />
              <p className="mt-4 text-center font-display text-xl font-bold text-cream">
                {team.fullName}
              </p>
              <p className="mt-1 text-center text-sm text-muted">{team.tagline}</p>
              <div className="mt-6 rounded-2xl border border-hoop/25 bg-hoop/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-hoop-bright">
                  {team.nextHighlight.title}
                </p>
                <p className="mt-1 font-semibold text-cream">
                  {team.nextHighlight.when}
                </p>
                <p className="text-sm text-muted">{team.nextHighlight.where}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(nextMatch || nextTraining) && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {nextMatch && (
              <div
                className="card-lift overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-panel to-ink-soft"
                style={{ order: trainingFirst ? 2 : 1 }}
              >
                <div className="flex h-full flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
                      Volgende match
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-cream break-words sm:text-3xl">
                      vs {nextMatch.opponent}
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
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-hoop px-5 py-3 text-sm font-bold text-white transition hover:bg-hoop-bright active:bg-hoop-bright"
                  >
                    Alle matchen →
                  </Link>
                </div>
              </div>
            )}

            <div
              className="card-lift overflow-hidden rounded-3xl border border-hoop/25 bg-gradient-to-br from-hoop/15 via-panel to-ink-soft"
              style={{ order: trainingFirst ? 1 : 2 }}
            >
              <div className="flex h-full flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
                    {nextTraining.isOngoing
                      ? 'Nu aan de gang'
                      : 'Volgende training'}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">
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
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl border border-hoop/40 bg-hoop/20 px-5 py-3 text-sm font-bold text-hoop-bright transition hover:bg-hoop/30 active:bg-hoop/30"
                >
                  Alle trainingen →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
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

        <Link
          to="/gedragscodes"
          className="card-lift mt-8 flex flex-col gap-4 rounded-3xl border border-hoop/30 bg-gradient-to-br from-hoop/15 via-panel to-ink-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
        >
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
              Veilig sporten
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">
              Gedragscodes
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Afspraken voor trainers, spelers en ouders — zodat de kids veilig
              en met respect kunnen basketballen.
            </p>
          </div>
          <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-hoop px-5 py-3 text-sm font-bold text-white transition hover:bg-hoop-bright">
            Bekijk de codes →
          </span>
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="rounded-full bg-white/5 px-3 py-1">
            Seizoen {team.season}
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1">
            Ma Heilig-Hart · Do Redingenhof
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1">#WEBEARS</span>
          <UpdatedHint />
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
