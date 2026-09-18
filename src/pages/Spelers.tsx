import { SectionHeader } from '../components/SectionHeader'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers } from '../data/team'

export function Spelers() {
  return (
    <div className="spelers-page page-shell">
      <SectionHeader title="Onze spelers" className="spelers-page__title" />

      <StickerAlbum players={players} staff={staffMembers} />
    </div>
  )
}
