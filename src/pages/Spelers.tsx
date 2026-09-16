import { SectionHeader } from '../components/SectionHeader'
import { StaffCard } from '../components/StaffCard'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers, team } from '../data/team'

export function Spelers() {
  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Stickeralbum · Seizoen 2026 - 2027"
        title="Onze spelers"
        subtitle={`Plak de beren van seizoen ${team.season} in je album. Thomas is er al — de andere stickers volgen binnenkort.`}
      />

      <StickerAlbum players={players} />

      <section className="mt-12 rounded-3xl border border-white/10 bg-ink-soft p-6 sm:p-8">
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
