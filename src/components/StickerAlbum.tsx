import type { Player } from '../data/players'
import { playerStickerSrc } from '../data/players'
import { staffStickerSrc, type StaffMember } from '../data/team'

const STICKER_ASPECT = '2 / 3'

type StickerAlbumProps = {
  players: Player[]
  staff: StaffMember[]
}

export function StickerAlbum({ players, staff }: StickerAlbumProps) {
  return (
    <div className="sticker-album">
      <section
        className="sticker-album__hero"
        aria-label="Teamstickers bovenaan"
      >
        <article className="sticker-album__emblem">
          <img
            src="/stickers/embleem-u10c.webp"
            alt="Embleemsticker van Leuven Bears U10 C"
            width={911}
            height={1271}
            className="sticker-album__emblem-img"
          />
        </article>

        <EmptyAlbumSlot
          variant="group"
          title="Groepsfoto"
          ariaLabel="Lege stickerslot voor de groepsfoto."
        />
      </section>

      <ul className="sticker-album__grid">
        {players.map((player, index) => (
          <li key={player.id} className="min-w-0">
            <PlayerStickerSlot player={player} index={index} />
          </li>
        ))}
      </ul>

      <section className="sticker-album__staff" aria-labelledby="sticker-staff-heading">
        <div className="sticker-album__staff-copy">
          <h2 id="sticker-staff-heading" className="sticker-album__staff-title">
            Staff
          </h2>
          <p className="sticker-album__staff-lede">
            Els is er al — coachstickers volgen binnenkort.
          </p>
        </div>
        <ul className="sticker-album__grid sticker-album__grid--staff">
          {staff.map((member, index) => (
            <li key={member.id} className="min-w-0">
              <StaffStickerSlot member={member} index={index} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function staffSlotName(member: StaffMember) {
  return member.name.split(/\s+/)[0] ?? member.name
}

function StaffStickerSlot({
  member,
  index,
}: {
  member: StaffMember
  index: number
}) {
  const stickerSrc = staffStickerSrc(member)

  if (stickerSrc) {
    return (
      <article
        className="sticker-slot sticker-slot--filled animate-in"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        <img
          src={stickerSrc}
          alt={`Sticker van ${staffSlotName(member)}, ${member.role}`}
          width={693}
          height={1080}
          className="sticker-slot__art"
        />
      </article>
    )
  }

  return (
    <EmptyAlbumSlot
      variant="staff"
      title={staffSlotName(member)}
      subtitle={member.role}
      ariaLabel={`Lege stickerslot voor ${member.name}, ${member.role}${member.note ? `, ${member.note}` : ''}. Binnenkort.`}
      index={index}
    />
  )
}

function PlayerStickerSlot({
  player,
  index,
}: {
  player: Player
  index: number
}) {
  const stickerSrc = playerStickerSrc(player)

  if (stickerSrc) {
    return (
      <article
        className="sticker-slot sticker-slot--filled animate-in"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        <img
          src={stickerSrc}
          alt={`Sticker van ${player.firstName}, Leuven Bears U10 C`}
          width={1024}
          height={1536}
          className="sticker-slot__art"
        />
      </article>
    )
  }

  return (
    <EmptyAlbumSlot
      variant="player"
      title={player.firstName}
      subtitle={`#${player.number}`}
      ariaLabel={`Lege stickerslot voor ${player.firstName}, rugnummer ${player.number}. Binnenkort.`}
      index={index}
    />
  )
}

type EmptyAlbumSlotProps = {
  variant: 'player' | 'group' | 'staff'
  title: string
  subtitle?: string
  ariaLabel: string
  index?: number
}

function EmptyAlbumSlot({
  variant,
  title,
  subtitle,
  ariaLabel,
  index = 0,
}: EmptyAlbumSlotProps) {
  const isGroup = variant === 'group'

  return (
    <article
      className={`sticker-slot sticker-slot--empty sticker-slot--${variant} animate-in`}
      style={{
        animationDelay: `${index * 0.04}s`,
        ...(isGroup ? {} : { aspectRatio: STICKER_ASPECT }),
      }}
      aria-label={ariaLabel}
    >
      <div className="sticker-slot__chrome">
        <p className="sticker-slot__name">{title}</p>
        {subtitle ? <p className="sticker-slot__meta">{subtitle}</p> : null}
      </div>
    </article>
  )
}
