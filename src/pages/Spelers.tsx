import { SectionHeader } from '../components/SectionHeader'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers, team } from '../data/team'

export function Spelers() {
  return (
    <div className="spelers-page mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow={`Stickeralbum · Seizoen ${team.season}`}
        title="Onze spelers"
        titleClassName="spelers-page__title"
      />

      <StickerAlbum players={players} staff={staffMembers} />
    </div>
  )
}
