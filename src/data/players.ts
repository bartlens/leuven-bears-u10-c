export type PlayerMove =
  | 'arm-roll'
  | 'finger-spin'
  | 'between-legs'
  | 'behind-back'
  | 'crossover'
  | 'dunk'
  | 'rebound'
  | 'step-back'
  | 'waist-wrap'
  | 'shoulder-roll'
  | 'layup'
  | 'behind-head'
  | 'spin-move'

export type HairStyle = 'spiky' | 'bowl' | 'side' | 'curly' | 'short' | 'fluffy' | 'long'

/** Visual traits for the chibi PlayerFigure (hair/skin — friendly U10 cartoon). */
export type PlayerLook = {
  /** Hair fill color */
  hair: string
  /** Skin fill color */
  skin: string
  hairStyle: HairStyle
  /** Optional cheek blush override */
  cheek?: string
  /**
   * Subtle eye shape: default round; 'soft' = slightly narrower lids for
   * Jia Le (simple chibi cue, not a caricature).
   */
  eyeStyle?: 'round' | 'soft'
}

export type Player = {
  id: string
  firstName: string
  number: number
  label: string
  emoji: string
  accent: 'orange' | 'bear' | 'warm'
  /** Signature hover basketball move */
  move: PlayerMove
  /** Short Dutch label shown under the name */
  moveLabel: string
  /** Appearance used by PlayerFigure */
  look: PlayerLook
  /** Idle Panini sticker. Only set when artwork is ready. */
  stickerSrc?: string
}

/** Prefer explicit stickerSrc; Thomas still matches by first name as a fallback. */
export function playerStickerSrc(player: Player): string | undefined {
  if (player.stickerSrc) return player.stickerSrc
  if (player.firstName === 'Thomas') return '/stickers/thomas.webp?v=20260918p'
  return undefined
}

export const players: Player[] = [
  {
    id: 'p1',
    firstName: 'Alfred',
    number: 4,
    label: 'Guard',
    emoji: '⚡',
    accent: 'orange',
    move: 'arm-roll',
    moveLabel: 'Arm-roll',
    look: { hair: '#f0d078', skin: '#f5c7a1', hairStyle: 'short' },
    stickerSrc: '/stickers/alfred.webp?v=pad',
  },
  {
    id: 'p10',
    firstName: 'Bas N',
    number: 5,
    label: 'Center',
    emoji: '🛡️',
    accent: 'orange',
    move: 'shoulder-roll',
    moveLabel: 'Schouder-roll',
    look: { hair: '#dcc06e', skin: '#ebc09a', hairStyle: 'bowl' },
    stickerSrc: '/stickers/bas-n.webp?v=20260918g',
  },
  {
    id: 'p8',
    firstName: 'Charlie',
    number: 6,
    label: 'Guard',
    emoji: '😎',
    accent: 'bear',
    move: 'step-back',
    moveLabel: 'Step-back',
    look: { hair: '#fff1c2', skin: '#fadcc4', hairStyle: 'side' },
    stickerSrc: '/stickers/charlie.webp?v=20260918b',
  },
  {
    id: 'p2',
    firstName: 'Ilya',
    number: 7,
    label: 'Forward',
    emoji: '🐻',
    accent: 'bear',
    move: 'finger-spin',
    moveLabel: 'Vingerspin',
    look: { hair: '#1f1410', skin: '#efc09a', hairStyle: 'short' },
    stickerSrc: '/stickers/ilya.webp?v=20260918b',
  },
  {
    id: 'p7',
    firstName: 'Jarne',
    number: 8,
    label: 'Forward',
    emoji: '🎯',
    accent: 'orange',
    move: 'spin-move',
    moveLabel: 'Spin-move',
    look: { hair: '#edd98a', skin: '#f0c4a0', hairStyle: 'spiky' },
    stickerSrc: '/stickers/jarne.webp?v=pad',
  },
  {
    id: 'p12',
    firstName: 'Thomas',
    number: 9,
    label: 'Forward',
    emoji: '🏆',
    accent: 'warm',
    move: 'dunk',
    moveLabel: 'Dunk',
    look: { hair: '#e6c870', skin: '#eec4a2', hairStyle: 'short' },
    stickerSrc: '/stickers/thomas.webp?v=20260918p',
  },
  {
    id: 'p9',
    firstName: 'Jia Le',
    number: 10,
    label: 'Forward',
    emoji: '✨',
    accent: 'warm',
    move: 'waist-wrap',
    moveLabel: 'Taille-wrap',
    // Asian appearance: straight black hair, warm light-medium skin, soft eyes
    look: {
      hair: '#1a1a1a',
      skin: '#e8c4a0',
      hairStyle: 'short',
      cheek: '#e8a090',
      eyeStyle: 'soft',
    },
    stickerSrc: '/stickers/jia-le.webp?v=pad',
  },
  {
    id: 'p6',
    firstName: 'Bas D',
    number: 11,
    label: 'Center',
    emoji: '💪',
    accent: 'warm',
    move: 'behind-head',
    moveLabel: 'No-look',
    look: { hair: '#c9a84a', skin: '#e0b088', hairStyle: 'curly' },
    stickerSrc: '/stickers/bas-d.webp?v=pad',
  },
  {
    id: 'p3',
    firstName: 'Elias',
    number: 12,
    label: 'Guard',
    emoji: '🏀',
    accent: 'warm',
    move: 'between-legs',
    moveLabel: 'Tussenbenen',
    look: { hair: '#ffe8a8', skin: '#f8d4b8', hairStyle: 'short' },
    stickerSrc: '/stickers/elias.webp?v=pad',
  },
  {
    id: 'p4',
    firstName: 'Felix',
    number: 13,
    label: 'Forward',
    emoji: '🙌',
    accent: 'orange',
    move: 'behind-back',
    moveLabel: 'Achterlangs',
    look: { hair: '#d4b45a', skin: '#e8b48a', hairStyle: 'short' },
    stickerSrc: '/stickers/felix.webp?v=pad',
  },
  {
    id: 'p5',
    firstName: 'Sam',
    number: 14,
    label: 'Guard',
    emoji: '⭐',
    accent: 'bear',
    move: 'crossover',
    moveLabel: 'Crossover',
    look: { hair: '#d4b45a', skin: '#f2c9a8', hairStyle: 'short' },
    stickerSrc: '/stickers/sam.webp?v=20260918m',
  },
  {
    id: 'p11',
    firstName: 'Jacob',
    number: 15,
    label: 'Guard',
    emoji: '👟',
    accent: 'bear',
    move: 'layup',
    moveLabel: 'Lay-up',
    look: { hair: '#d4b45a', skin: '#f6d0b0', hairStyle: 'short' },
    stickerSrc: '/stickers/jacob.webp?v=pad',
  },
]
