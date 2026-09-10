import { SectionHeader } from '../components/SectionHeader'
import { PlayerCard } from '../components/PlayerCard'
import { StaffCard } from '../components/StaffCard'
import { players } from '../data/players'
import { staffMembers, team } from '../data/team'

export function Spelers() {
  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Roster · Seizoen 2026 - 2027"
        title="Onze spelers"
        subtitle={`De beren van seizoen ${team.season} — ${players.length} spelers met elk hun eigen vibe.`}
      />

      <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {players.map((p, i) => (
          <PlayerCard key={p.id} player={p} index={i} />
        ))}
      </div>

      <section className="rounded-3xl border border-white/10 bg-ink-soft p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-cream">Staff</h2>
        <p className="mt-1 text-sm text-muted">
          De coaches en Els houden de beren scherp (en op tijd). Tik of focus voor hun
          go-to move!
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {staffMembers.map((s, i) => (
            <StaffCard key={s.id} staff={s} index={i} compact />
          ))}
        </div>
      </section>
    </div>
  )
}
