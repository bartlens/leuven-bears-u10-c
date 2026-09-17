import { SectionHeader } from '../components/SectionHeader'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers } from '../data/team'

export function Spelers() {
  return (
    <div className="spelers-page mx-auto max-w-6xl overflow-x-hidden px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
      <SectionHeader title="Onze spelers" className="spelers-page__title" />

      <StickerAlbum players={players} staff={staffMembers} />
    </div>
  )
}
