import { links } from './links'
import type { PlayerLook } from './players'

export type StaffMove = 'whistle-clap' | 'laugh' | 'cheer'

export type StaffOutfit = 'coach' | 'volunteer'

export type StaffMember = {
  id: string
  name: string
  role: string
  note?: string
  emoji: string
  outfit: StaffOutfit
  move: StaffMove
  /** Short Dutch label under the name */
  moveLabel: string
  look: PlayerLook
  /** Idle Panini sticker. Only set when artwork is ready. */
  stickerSrc?: string
}

/** Prefer explicit stickerSrc; Els also matches by first name for this preview. */
export function staffStickerSrc(staff: StaffMember): string | undefined {
  if (staff.stickerSrc) return staff.stickerSrc
  const firstName = staff.name.split(/\s+/)[0] ?? staff.name
  if (firstName === 'Els') return '/stickers/els.webp'
  return undefined
}

export const staffMembers: StaffMember[] = [
  {
    id: 'jonathan',
    name: 'Jonathan Degros',
    role: 'Coach',
    emoji: '📢',
    outfit: 'coach',
    move: 'whistle-clap',
    moveLabel: 'Fluit & klap',
    // Belgian/Flemish adult male: light-medium skin, brown hair
    look: {
      hair: '#5c3d24',
      skin: '#efc09a',
      hairStyle: 'short',
      cheek: '#f08070',
    },
  },
  {
    id: 'rafa',
    name: 'Rafa Gálvez Vizcaíno',
    role: 'Coach',
    emoji: '😂',
    outfit: 'coach',
    move: 'laugh',
    moveLabel: 'Lachen!',
    // Spanish adult male: warmer olive skin, dark brown/black hair
    look: {
      hair: '#1a120e',
      skin: '#c9956c',
      hairStyle: 'side',
      cheek: '#d4785c',
    },
  },
  {
    id: 'els',
    name: 'Els',
    role: 'Ploegverantwoordelijke',
    note: 'mama van Sam',
    stickerSrc: '/stickers/els.webp',
    emoji: '🙌',
    outfit: 'volunteer',
    move: 'cheer',
    moveLabel: 'Supporter',
    // Adult woman / parent volunteer: longer hair, warm medium skin
    look: {
      hair: '#6b4423',
      skin: '#f0c4a0',
      hairStyle: 'long',
      cheek: '#ff8a7a',
    },
  },
]

export const team = {
  name: 'Leuven Bears',
  category: 'U10 C',
  fullName: 'Leuven Bears U10 C',
  tagline: '#WEBEARS · Klein van stuk, groot van hart 🐻🏀',
  club: 'Leuven Bears',
  competition: 'U10 C',
  season: '2026 - 2027',
  seasonShort: '26–27',
  hall: {
    name: 'Campus Redingenhof',
    address: 'Remi Vandervaerenlaan',
    city: '3000 Leuven',
    notes:
      'Thuiswedstrijden in Campus Redingenhof. Trainingen: maandag Heilig-Hart Heverlee, donderdag Redingenhof.',
  },
  staff: {
    coaches: staffMembers.filter((s) => s.outfit === 'coach'),
    ploegverantwoordelijke: staffMembers.find((s) => s.id === 'els')!,
  },
  contact: {
    clubEmail: 'secretariaat@leuvenbears.be',
    phone: '0491 27 76 50',
    address: 'Diestsesteenweg 394, 3010 Leuven',
  },
  links: {
    club: links.club,
    tickets: links.tickets,
    vblCalendarSync: links.vblCalendarSync,
    attendanceSpreadsheet: links.attendanceSpreadsheet,
    herfststageForm: links.herfststageForm,
  },
}
