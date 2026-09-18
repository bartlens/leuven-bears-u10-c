import { SectionHeader } from '../components/SectionHeader'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers } from '../data/team'

export function Spelers() {
  return (
    <div className="spelers-page page-shell">
      <div className="spelers-page__intro">
        <SectionHeader title="Onze spelers" className="spelers-page__title !mb-0" />
        <a href="#staff" className="spelers-page__staff-jump">
          Naar staff ↓
        </a>
      </div>

      <StickerAlbum players={players} staff={staffMembers} />
    </div>
  )
}
