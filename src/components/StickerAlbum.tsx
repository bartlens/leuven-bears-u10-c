import { useLayoutEffect, useRef } from 'react'
import type { Player } from '../data/players'
import { playerStickerSrc } from '../data/players'
import { staffStickerSrc, team, type StaffMember } from '../data/team'

const EMBLEM_SRC = '/stickers/embleem-u10c.webp?v=20260918t'
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
  'marginLeft',
  'marginRight',
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

function cssSnap(value: number) {
  return Math.round(value * 64) / 64
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

/** Viewport X → padding-box X of the positioned ancestor (not offsetLeft). */
function viewportToLocalX(ancestor: HTMLElement, viewportX: number) {
  const rect = ancestor.getBoundingClientRect()
  const borderLeft = Number.parseFloat(getComputedStyle(ancestor).borderLeftWidth) || 0
  return viewportX - rect.left - borderLeft
}

function paintedX(slot: DOMRect) {
  const pad = cssSnap(slot.width * PLAYER_PAD_X)
  return { left: cssSnap(slot.left + pad), right: cssSnap(slot.right - pad) }
}

function paintedEmblemFrame(emblem: DOMRect) {
  const padY = cssSnap(emblem.height * PLAYER_PAD_Y)
  const top = cssSnap(emblem.top + padY)
  const height = cssSnap(emblem.height - padY * 2)
  return new DOMRect(emblem.left, top, emblem.width, height)
}

function lockGroupPaintedX(
  group: HTMLElement,
  ancestor: HTMLElement,
  leftSlot: HTMLElement,
  rightSlot: HTMLElement,
  mode: 'absolute' | 'flow',
) {
  for (let i = 0; i < 8; i += 1) {
    const leftTarget = paintedX(leftSlot.getBoundingClientRect()).left
    const rightTarget = paintedX(rightSlot.getBoundingClientRect()).right
    const width = rightTarget - leftTarget
    if (mode === 'absolute') {
      const parent =
        group.offsetParent instanceof HTMLElement ? group.offsetParent : ancestor
      group.style.position = 'absolute'
      group.style.marginLeft = '0px'
      group.style.left = `${viewportToLocalX(parent, leftTarget)}px`
      group.style.right = 'auto'
    } else {
      group.style.position = 'relative'
      group.style.left = 'auto'
      group.style.right = 'auto'
      group.style.marginLeft = `${leftTarget - ancestor.getBoundingClientRect().left}px`
    }
    group.style.width = `${width}px`
    group.style.minWidth = `${width}px`
    group.style.maxWidth = `${width}px`

    const g = group.getBoundingClientRect()
    const leftDiff = g.left - paintedX(leftSlot.getBoundingClientRect()).left
    const rightDiff = g.right - paintedX(rightSlot.getBoundingClientRect()).right
    if (leftDiff === 0 && rightDiff === 0) return

    if (mode === 'absolute') {
      const curLeft = Number.parseFloat(group.style.left) || 0
      const curWidth = Number.parseFloat(group.style.width) || width
      group.style.left = `${curLeft - leftDiff}px`
      const nextWidth = curWidth - rightDiff + leftDiff
      group.style.width = `${nextWidth}px`
      group.style.minWidth = `${nextWidth}px`
      group.style.maxWidth = `${nextWidth}px`
    } else {
      const curMargin = Number.parseFloat(group.style.marginLeft) || 0
      const curWidth = Number.parseFloat(group.style.width) || width
      group.style.marginLeft = `${curMargin - leftDiff}px`
      const nextWidth = curWidth - rightDiff + leftDiff
      group.style.width = `${nextWidth}px`
      group.style.minWidth = `${nextWidth}px`
      group.style.maxWidth = `${nextWidth}px`
    }
  }
}

function heroDiffs(
  emblem: DOMRect,
  alfredSlot: DOMRect,
  group: DOMRect,
  p2: DOMRect,
  pN: DOMRect,
) {
  const emblemPainted = paintedEmblemFrame(emblem)
  const p2x = paintedX(p2)
  const pNx = paintedX(pN)
  return {
    emblemLeft: emblem.left - alfredSlot.left,
    emblemRight: emblem.right - alfredSlot.right,
    emblemTop: emblem.top - alfredSlot.top,
    emblemBottom: emblem.bottom - alfredSlot.bottom,
    groupLeft: group.left - p2x.left,
    groupRight: group.right - pNx.right,
    groupTop: group.top - emblemPainted.top,
    groupBottom: group.bottom - emblemPainted.bottom,
  }
}

function alfredSlotInHero(hero: DOMRect, alfred: DOMRect): DOMRect {
  const top = hero.top
  const height = alfred.height
  return new DOMRect(alfred.left, top, alfred.width, height)
}

function maxAbsDiff(diffs: ReturnType<typeof heroDiffs>) {
  return Math.max(...Object.values(diffs).map((d) => Math.abs(d)))
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

  for (let i = 0; i < 8; i += 1) {
    const r1 = p1.getBoundingClientRect()
    const r2 = p2.getBoundingClientRect()
    const rN = pN.getBoundingClientRect()
    if (r1.height < 1 || r2.width < 1) return

    hero.style.height = `${r1.height}px`
    const heroBox = hero.getBoundingClientRect()
    const alfredBox = alfredSlotInHero(heroBox, r1)

    applyBox(emblem, {
      left: alfredBox.left - heroBox.left,
      top: alfredBox.top - heroBox.top,
      width: alfredBox.width,
      height: alfredBox.height,
    })

    const ePlaced = emblem.getBoundingClientRect()
    const emblemPainted = paintedEmblemFrame(ePlaced)
    const p2x = paintedX(r2)
    const pNx = paintedX(rN)
    applyBox(group, {
      left: viewportToLocalX(hero, p2x.left),
      top: emblemPainted.top - heroBox.top,
      width: pNx.right - p2x.left,
      height: emblemPainted.height,
    })

    const trackGap = r2.left - r1.right
    const heroAfter = hero.getBoundingClientRect()
    const groupAfter = group.getBoundingClientRect()
    const slack = heroAfter.bottom - groupAfter.bottom
    hero.style.marginBottom = `${Math.max(0, trackGap - slack)}px`

    lockGroupPaintedX(group, hero, p2, pN, 'absolute')

    const locked = heroDiffs(
      emblem.getBoundingClientRect(),
      alfredSlotInHero(hero.getBoundingClientRect(), p1.getBoundingClientRect()),
      group.getBoundingClientRect(),
      p2.getBoundingClientRect(),
      pN.getBoundingClientRect(),
    )
    if (maxAbsDiff(locked) === 0) return
  }
}

function clearHeroInline(album: HTMLElement) {
  const hero = album.querySelector<HTMLElement>('.sticker-album__hero')
  const emblem = album.querySelector<HTMLElement>('.sticker-album__emblem--hero')
  const group = album.querySelector<HTMLElement>('.sticker-slot--group')
  if (hero) {
    hero.style.removeProperty('height')
    hero.style.removeProperty('margin-bottom')
  }
  for (const el of [emblem, group]) {
    if (!el) continue
    for (const prop of STYLE_PROPS) el.style.removeProperty(prop)
  }
}

function syncMobileHero(album: HTMLElement) {
  clearHeroInline(album)
  const hero = album.querySelector<HTMLElement>('.sticker-album__hero')
  const group = album.querySelector<HTMLElement>('.sticker-slot--group')
  const slots = playerSlots(album)
  const cols = columnCount(album)
  const p1 = slots[0]
  const pN = slots[Math.min(cols, slots.length) - 1]
  if (!hero || !group || !p1 || !pN) return

  for (let i = 0; i < 8; i += 1) {
    if (p1.getBoundingClientRect().width < 1) return
    lockGroupPaintedX(group, hero, p1, pN, 'flow')
    const g = group.getBoundingClientRect()
    const leftT = paintedX(p1.getBoundingClientRect()).left
    const rightT = paintedX(pN.getBoundingClientRect()).right
    if (g.left - leftT === 0 && g.right - rightT === 0) return
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
          syncMobileHero(album)
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
      clearHeroInline(album)
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
            src="/stickers/groep-u10c-2026-hero.webp?v=20260920b"
            alt={`Leuven Bears U10C groepsfoto ${team.season}`}
            width={1830}
            height={813}
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
