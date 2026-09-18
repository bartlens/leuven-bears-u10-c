import { SectionHeader } from '../components/SectionHeader'
import { StickerAlbum } from '../components/StickerAlbum'
import { players } from '../data/players'
import { staffMembers } from '../data/team'

export function Spelers() {
  return (
    <div className="spelers-page page-shell">
      <SectionHeader title="Onze spelers" className="spelers-page__title" />
      <p className="-mt-3 mb-6">
        <a
          href="#staff"
          className="inline-flex min-h-11 items-center text-sm font-bold text-hoop-bright hover:underline"
        >
          Naar staff ↓
        </a>
      </p>

      <StickerAlbum players={players} staff={staffMembers} />
    </div>
  )
}
