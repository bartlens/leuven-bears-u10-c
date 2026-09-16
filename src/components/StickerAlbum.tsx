import type { Player } from '../data/players'
import { playerStickerSrc } from '../data/players'

const STICKER_ASPECT = '2 / 3'

type StickerAlbumProps = {
  players: Player[]
}

export function StickerAlbum({ players }: StickerAlbumProps) {
  return (
    <div className="sticker-album">
      <section
        className="sticker-album__hero"
        aria-label="Teamstickers bovenaan"
      >
        <article className="sticker-album__emblem">
          <img
            src="/stickers/embleem-u10c.png"
            alt="Embleemsticker van Leuven Bears U10 C"
            width={720}
            height={1080}
            className="sticker-album__emblem-img"
          />
        </article>

        <EmptyAlbumSlot
          variant="group"
          title="Groepsfoto"
          subtitle="Binnenkort"
          ariaLabel="Lege stickerslot voor de groepsfoto. Binnenkort."
        />
      </section>

      <ul className="sticker-album__grid">
        {players.map((player, index) => (
          <li key={player.id} className="min-w-0">
            <PlayerStickerSlot player={player} index={index} />
          </li>
        ))}
      </ul>
    </div>
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
          width={720}
          height={1080}
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
  variant: 'player' | 'group'
  title: string
  subtitle: string
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
      <div className="sticker-slot__chrome" aria-hidden>
        <header className="sticker-slot__header">
          <span className="sticker-slot__star">★</span>
          <span className="sticker-slot__brand">Leuven Bears</span>
          <span className="sticker-slot__star">★</span>
        </header>

        <div className="sticker-slot__field">
          <div className="sticker-slot__dash">
            <span className="sticker-slot__soon">Binnenkort</span>
            {isGroup ? (
              <span className="sticker-slot__hint">Groepsfoto</span>
            ) : (
              <span className="sticker-slot__ghost-num">{subtitle}</span>
            )}
          </div>
        </div>

        <footer className="sticker-slot__footer">
          <span className="sticker-slot__name">{title}</span>
          <span className="sticker-slot__meta">
            {isGroup ? 'U10 C' : subtitle}
          </span>
        </footer>
      </div>
    </article>
  )
}
