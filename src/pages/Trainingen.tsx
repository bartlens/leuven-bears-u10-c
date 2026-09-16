import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { StaffFigure } from '../components/StaffFigure'
import {
  trainings,
  whatToBring,
  coachNotes,
  getUpcomingDatedTrainings,
} from '../data/trainings'
import { team, staffMembers } from '../data/team'
import { attendanceCopy, links } from '../data/links'
import { useSheetData } from '../sheet/SheetProvider'
import { playStaffClickSound, unlockAudio } from '../audio/playerClickSound'

const COACHES = staffMembers.filter((s) => s.outfit === 'coach')
const WAVE_MS = 2200
/** Playful coach-wave on the next-training card. Off — fun stays on /spelers. */
const COACH_WAVE_EASTER_EGG = false

function formatTrainingDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Trainingen() {
  const { datedTrainings } = useSheetData()
  const upcomingDated = getUpcomingDatedTrainings(new Date(), datedTrainings)
  const [waving, setWaving] = useState(false)
  const waveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastWaveAt = useRef(0)

  useEffect(() => {
    return () => {
      if (waveTimer.current) clearTimeout(waveTimer.current)
    }
  }, [])

  const triggerCoachWave = useCallback(() => {
    if (!COACH_WAVE_EASTER_EGG) return
    const now = performance.now()
    if (now - lastWaveAt.current < 800) return
    lastWaveAt.current = now

    if (waveTimer.current) clearTimeout(waveTimer.current)
    setWaving(true)
    void unlockAudio()
    for (const coach of COACHES) {
      playStaffClickSound(coach)
    }

    const dur = prefersReducedMotion() ? 500 : WAVE_MS
    waveTimer.current = setTimeout(() => setWaving(false), dur)
  }, [])

  const onNextKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      triggerCoachWave()
    }
  }

  const card = 'border border-white/10 bg-panel'
  const cardPad = 'card-lift animate-in rounded-2xl px-5 py-4'
  const cardLg = 'card-lift animate-in rounded-3xl p-6'

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Schedule"
        title="Trainingen"
        subtitle={`Vaste planning · seizoen ${team.season}`}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {trainings.map((t, i) => (
          <article
            key={t.id}
            className={`${cardLg} ${card}`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold text-cream">
                {t.day}
              </h2>
              <span className="rounded-full bg-hoop/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-hoop-bright">
                Wekelijks
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold text-hoop-bright">{t.time}</p>
            <p className="mt-1 text-muted">{t.location}</p>
            <p className="mt-4 rounded-xl bg-ink/50 px-4 py-3 text-sm text-cream/90">
              Focus: {t.focus}
            </p>
          </article>
        ))}
      </div>

      <a
        href={links.attendanceSpreadsheet}
        target="_blank"
        rel="noreferrer"
        className={`${cardPad} ${card} mb-8 flex flex-col gap-2 transition hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-hoop-bright">
            Aanwezigheid
          </p>
          <p className="mt-1 font-display text-lg font-bold text-cream">
            Spreadsheet wedstrijden + trainingen
          </p>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {attendanceCopy.blurb}
          </p>
        </div>
        <span className="shrink-0 self-start rounded-full bg-hoop px-4 py-2 text-sm font-bold text-white sm:self-center">
          Openen →
        </span>
      </a>

      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl font-bold text-cream">
          Aankomende trainingen ({upcomingDated.length})
        </h2>
        {upcomingDated.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-ink-soft px-5 py-6 text-sm text-muted">
            Geen gedateerde trainingen meer in de spreadsheet — daarna geldt het
            vaste Ma/Do-schema hierboven.
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingDated.map((t, i) => {
              const isNext = i === 0
              if (isNext) {
                return (
                  <article
                    key={t.id}
                    role={COACH_WAVE_EASTER_EGG ? 'button' : undefined}
                    tabIndex={COACH_WAVE_EASTER_EGG ? 0 : undefined}
                    aria-label={
                      COACH_WAVE_EASTER_EGG
                        ? `Eerstvolgende training ${formatTrainingDate(t.dateIso)}. Tik om de coaches te laten zwaaien.`
                        : undefined
                    }
                    onClick={COACH_WAVE_EASTER_EGG ? triggerCoachWave : undefined}
                    onKeyDown={COACH_WAVE_EASTER_EGG ? onNextKeyDown : undefined}
                    className={`${cardPad} ${card} relative flex flex-col gap-2 overflow-hidden sm:flex-row sm:items-center sm:justify-between ${
                      COACH_WAVE_EASTER_EGG
                        ? 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-hoop focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                        : ''
                    } ${waving ? 'is-waving' : ''}`}
                    style={{ animationDelay: `${i * 0.03}s` }}
                  >
                    {waving && (
                      <div
                        className="training-coach-pop pointer-events-none absolute inset-0 z-[5] flex items-center justify-center gap-3 overflow-hidden rounded-2xl"
                        aria-hidden="true"
                      >
                        {COACHES.map((coach, ci) => (
                          <span
                            key={`${coach.id}-${waving}`}
                            className={`training-coach-pop__fig is-waving ${
                              ci === 0 ? 'from-left' : 'from-right'
                            }`}
                            style={{ animationDelay: `${ci * 0.08}s` }}
                          >
                            <StaffFigure
                              staff={coach}
                              className="training-coach-pop__svg"
                            />
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-hoop-bright">
                        Eerstvolgende
                      </p>
                      <p className="mt-0.5 font-display text-lg font-bold text-cream">
                        {formatTrainingDate(t.dateIso)}
                      </p>
                      <p className="text-sm text-muted">
                        {t.time} · {t.location}
                      </p>
                    </div>
                    <span className="relative z-10 self-start rounded-full bg-hoop/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-hoop-bright sm:self-center">
                      {t.day}
                    </span>
                  </article>
                )
              }
              return (
                <article
                  key={t.id}
                  className={`${cardPad} ${card} flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`}
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div>
                    <p className="font-display text-lg font-bold text-cream">
                      {formatTrainingDate(t.dateIso)}
                    </p>
                    <p className="text-sm text-muted">
                      {t.time} · {t.location}
                    </p>
                  </div>
                  <span className="self-start rounded-full bg-hoop/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-hoop-bright sm:self-center">
                    {t.day}
                  </span>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className={`${card} rounded-3xl p-6`}>
          <h3 className="font-display text-lg font-bold text-cream">
            Wat meebrengen?
          </h3>
          <ul className="mt-4 space-y-2">
            {whatToBring.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-cream/90">
                <span className="text-cream/60" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} rounded-3xl p-6`}>
          <h3 className="font-display text-lg font-bold text-cream">
            Coach notes
          </h3>
          <ul className="mt-4 space-y-3">
            {coachNotes.map((note) => (
              <li key={note} className="text-sm leading-relaxed text-cream/90">
                → {note}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted">
            Thuiszaal: {team.hall.name}, {team.hall.address}, {team.hall.city}
          </p>
        </section>
      </div>
    </div>
  )
}
