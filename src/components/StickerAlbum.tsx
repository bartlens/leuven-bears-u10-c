import type { Player } from '../data/players'
import { playerStickerSrc } from '../data/players'
import { staffStickerSrc, team, type StaffMember } from '../data/team'

const EMBLEM_SRC = '/stickers/embleem-u10c.webp?v=20260918t'
const EMBLEM_ALT = 'Embleemsticker van Leuven Bears U10 C'

type StickerAlbumProps = {
  players: Player[]
  staff: StaffMember[]
}

export function StickerAlbum({ players, staff }: StickerAlbumProps) {
  const roster = [...players].sort((a, b) => a.number - b.number)

  return (
    <div className="sticker-album">
      <section
        className="sticker-album__hero"
        aria-label="Teamstickers bovenaan"
      >
        <article className="sticker-album__emblem sticker-album__emblem--hero">
          <img
            src={EMBLEM_SRC}
            alt={EMBLEM_ALT}
            width={640}
            height={960}
            className="sticker-album__emblem-img"
          />
        </article>

        <article className="sticker-slot sticker-slot--group">
          <img
            src="/stickers/groep-u10c-2026.webp?v=20260918h"
            alt={`Leuven Bears U10C groepsfoto ${team.season}`}
            className="sticker-slot__art sticker-album__group-img"
          />
        </article>
      </section>

      <ul className="sticker-album__grid">
        {roster.map((player, index) => (
          <li key={player.id} className="min-w-0">
            <PlayerStickerSlot player={player} index={index} />
          </li>
        ))}
      </ul>

      <section
        id="staff"
        className="sticker-album__staff"
        aria-labelledby="sticker-staff-heading"
      >
        <div className="sticker-album__staff-copy">
          <h2
            id="sticker-staff-heading"
            className="sticker-album__staff-title font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl"
          >
            Staff
          </h2>
        </div>
        <ul className="sticker-album__grid sticker-album__grid--staff">
          {staff.map((member, index) => (
            <li key={member.id} className="min-w-0">
              <StaffStickerSlot member={member} index={index} />
            </li>
          ))}
          <li className="sticker-album__staff-emblem min-w-0">
            <article className="sticker-slot sticker-slot--filled sticker-slot--staff">
              <img
                src={EMBLEM_SRC}
                alt={EMBLEM_ALT}
                width={640}
                height={960}
                className="sticker-slot__art"
              />
            </article>
          </li>
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
        className="sticker-slot sticker-slot--filled sticker-slot--staff animate-in"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        <img
          src={stickerSrc}
          alt={`Sticker van ${staffSlotName(member)}, ${member.role}`}
          width={640}
          height={960}
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
        className="sticker-slot sticker-slot--filled sticker-slot--player animate-in"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        <img
          src={stickerSrc}
          alt={`Sticker van ${player.firstName}, Leuven Bears U10 C`}
          width={640}
          height={960}
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
  return (
    <article
      className={`sticker-slot sticker-slot--empty sticker-slot--${variant} animate-in`}
      style={{ animationDelay: `${index * 0.04}s` }}
      aria-label={ariaLabel}
    >
      <div className="sticker-slot__blank">
        <div className="sticker-slot__blank-face" aria-hidden="true" />
        <div className="sticker-slot__blank-copy">
          <p className="sticker-slot__name">{title}</p>
          {subtitle ? <p className="sticker-slot__meta">{subtitle}</p> : null}
          <p className="sticker-slot__soon">Binnenkort</p>
        </div>
      </div>
    </article>
  )
}
