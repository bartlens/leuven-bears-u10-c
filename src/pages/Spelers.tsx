import { SectionHeader } from '../components/SectionHeader'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers, team } from '../data/team'

export function Spelers() {
  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow={`Stickeralbum · Seizoen ${team.season}`}
        title="Onze spelers"
        subtitle={`Plak de beren van seizoen ${team.season} in je album. Thomas, Sam en Els zijn er al — de andere spelers- en staffstickers volgen binnenkort.`}
      />

      <StickerAlbum players={players} staff={staffMembers} />
    </div>
  )
}
