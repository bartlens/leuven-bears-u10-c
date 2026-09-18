import { useLayoutEffect, useRef } from 'react'
import type { Player } from '../data/players'
import { playerStickerSrc } from '../data/players'
import { staffStickerSrc, team, type StaffMember } from '../data/team'

const EMBLEM_SRC = '/stickers/embleem-u10c-hero.webp?v=20260918v'
const EMBLEM_STAFF_SRC = '/stickers/embleem-u10c.webp?v=20260918t'
const EMBLEM_ALT = 'Embleemsticker van Leuven Bears U10 C'
const DESKTOP_MIN = 640
/** Same card inset as scripts/normalize-player-stickers.py (640×960 dest). */
const PLAYER_PAD_X = 17 / 640
const PLAYER_PAD_Y = 27 / 960
const STYLE_PROPS = [
  'position',
  'top',
  'left',
  'right',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
] as const

function playerSlots(album: HTMLElement) {
  return [
    ...album.querySelectorAll<HTMLElement>(
      ':scope > .sticker-album__grid .sticker-slot--player',
    ),
  ]
}

function columnCount(album: HTMLElement) {
  const raw = getComputedStyle(album).getPropertyValue('--sticker-cols').trim()
  const cols = Number.parseInt(raw, 10)
  return Number.isFinite(cols) && cols > 1 ? cols : 4
}

function applyBox(
  el: HTMLElement,
  box: { left: number; top: number; width: number; height: number },
) {
  el.style.position = 'absolute'
  el.style.top = `${box.top}px`
  el.style.left = `${box.left}px`
  el.style.right = 'auto'
  el.style.width = `${box.width}px`
  el.style.height = `${box.height}px`
  el.style.minWidth = `${box.width}px`
  el.style.minHeight = `${box.height}px`
  el.style.maxWidth = `${box.width}px`
  el.style.maxHeight = `${box.height}px`
}

function syncDesktopHero(album: HTMLElement) {
  const hero = album.querySelector<HTMLElement>('.sticker-album__hero')
  const emblem = album.querySelector<HTMLElement>('.sticker-album__emblem--hero')
  const group = album.querySelector<HTMLElement>('.sticker-slot--group')
  const slots = playerSlots(album)
  const cols = columnCount(album)
  const p1 = slots[0]
  const p2 = slots[1]
  const pN = slots[cols - 1]
  if (!hero || !emblem || !group || !p1 || !p2 || !pN) return

  for (let i = 0; i < 6; i += 1) {
    const heroRect = hero.getBoundingClientRect()
    const r1 = p1.getBoundingClientRect()
    const r2 = p2.getBoundingClientRect()
    const rN = pN.getBoundingClientRect()
    if (r1.height < 1 || r2.width < 1) return

    const padX = r1.width * PLAYER_PAD_X
    const padY = r1.height * PLAYER_PAD_Y
    const height = r1.height - padY * 2
    hero.style.height = `${r1.height}px`

    applyBox(emblem, {
      left: r1.left - heroRect.left + padX,
      top: padY,
      width: r1.width - padX * 2,
      height,
    })
    applyBox(group, {
      left: r2.left - heroRect.left + padX,
      top: padY,
      width: rN.right - padX - (r2.left + padX),
      height,
    })

    const e = emblem.getBoundingClientRect()
    const g = group.getBoundingClientRect()
    const next1 = p1.getBoundingClientRect()
    const next2 = p2.getBoundingClientRect()
    const nextN = pN.getBoundingClientRect()
    const vis1 = {
      left: next1.left + padX,
      top: next1.top + padY,
      right: next1.right - padX,
      bottom: next1.bottom - padY,
    }
    const vis2 = next2.left + padX
    const visN = nextN.right - padX
    const diffs = [
      Math.abs(e.top - g.top),
      Math.abs(e.bottom - g.bottom),
      Math.abs(e.left - vis1.left),
      Math.abs(e.right - vis1.right),
      Math.abs(g.left - vis2),
      Math.abs(g.right - visN),
    ]
    if (diffs.every((d) => d <= 0.5)) return
  }
}

function clearDesktopHero(album: HTMLElement) {
  const hero = album.querySelector<HTMLElement>('.sticker-album__hero')
  const emblem = album.querySelector<HTMLElement>('.sticker-album__emblem--hero')
  const group = album.querySelector<HTMLElement>('.sticker-slot--group')
  if (hero) hero.style.removeProperty('height')
  for (const el of [emblem, group]) {
    if (!el) continue
    for (const prop of STYLE_PROPS) el.style.removeProperty(prop)
  }
}

type StickerAlbumProps = {
  players: Player[]
  staff: StaffMember[]
}

export function StickerAlbum({ players, staff }: StickerAlbumProps) {
  const roster = [...players].sort((a, b) => a.number - b.number)
  const albumRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const album = albumRef.current
    if (!album) return

    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`)
    let applying = false

    const apply = () => {
      if (applying) return
      applying = true
      try {
        if (!mq.matches) {
          clearDesktopHero(album)
          return
        }
        syncDesktopHero(album)
      } finally {
        applying = false
      }
    }

    const ro = new ResizeObserver(apply)
    ro.observe(album)
    const grid = album.querySelector<HTMLElement>(':scope > .sticker-album__grid')
    if (grid) ro.observe(grid)
    mq.addEventListener('change', apply)
    window.addEventListener('resize', apply)
    const fonts = document.fonts
    if (fonts?.ready) void fonts.ready.then(apply)
    apply()

    return () => {
      ro.disconnect()
      mq.removeEventListener('change', apply)
      window.removeEventListener('resize', apply)
      clearDesktopHero(album)
    }
  }, [])

  return (
    <div ref={albumRef} className="sticker-album">
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
            src="/stickers/groep-u10c-2026-hero.webp?v=20260918v"
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
                src={EMBLEM_STAFF_SRC}
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
