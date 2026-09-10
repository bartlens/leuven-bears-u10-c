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
}

export const players: Player[] = [
  {
    id: 'p1',
    firstName: 'Alfred',
    number: 1,
    label: 'Guard',
    emoji: '⚡',
    accent: 'orange',
    move: 'arm-roll',
    moveLabel: 'Arm-roll',
    look: { hair: '#f0d078', skin: '#f5c7a1', hairStyle: 'spiky' },
  },
  {
    id: 'p2',
    firstName: 'Ilya',
    number: 2,
    label: 'Forward',
    emoji: '🐻',
    accent: 'bear',
    move: 'finger-spin',
    moveLabel: 'Vingerspin',
    look: { hair: '#1f1410', skin: '#efc09a', hairStyle: 'short' },
  },
  {
    id: 'p3',
    firstName: 'Elias',
    number: 3,
    label: 'Guard',
    emoji: '🏀',
    accent: 'warm',
    move: 'between-legs',
    moveLabel: 'Tussenbenen',
    look: { hair: '#ffe8a8', skin: '#f8d4b8', hairStyle: 'short' },
  },
  {
    id: 'p4',
    firstName: 'Felix',
    number: 4,
    label: 'Forward',
    emoji: '🙌',
    accent: 'orange',
    move: 'behind-back',
    moveLabel: 'Achterlangs',
    look: { hair: '#d4b45a', skin: '#e8b48a', hairStyle: 'short' },
  },
  {
    id: 'p5',
    firstName: 'Sam',
    number: 5,
    label: 'Guard',
    emoji: '⭐',
    accent: 'bear',
    move: 'crossover',
    moveLabel: 'Crossover',
    look: { hair: '#f5e6b0', skin: '#f2c9a8', hairStyle: 'bowl' },
  },
  {
    id: 'p6',
    firstName: 'Bas D',
    number: 6,
    label: 'Center',
    emoji: '💪',
    accent: 'warm',
    move: 'behind-head',
    moveLabel: 'No-look',
    look: { hair: '#c9a84a', skin: '#e0b088', hairStyle: 'curly' },
  },
  {
    id: 'p7',
    firstName: 'Jarne',
    number: 7,
    label: 'Forward',
    emoji: '🎯',
    accent: 'orange',
    move: 'spin-move',
    moveLabel: 'Spin-move',
    look: { hair: '#edd98a', skin: '#f0c4a0', hairStyle: 'spiky' },
  },
  {
    id: 'p8',
    firstName: 'Charlie',
    number: 8,
    label: 'Guard',
    emoji: '😎',
    accent: 'bear',
    move: 'step-back',
    moveLabel: 'Step-back',
    look: { hair: '#fff1c2', skin: '#fadcc4', hairStyle: 'side' },
  },
  {
    id: 'p9',
    firstName: 'Jia Le',
    number: 9,
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
  },
  {
    id: 'p10',
    firstName: 'Bas N',
    number: 10,
    label: 'Center',
    emoji: '🛡️',
    accent: 'orange',
    move: 'shoulder-roll',
    moveLabel: 'Schouder-roll',
    look: { hair: '#dcc06e', skin: '#ebc09a', hairStyle: 'bowl' },
  },
  {
    id: 'p11',
    firstName: 'Jacob',
    number: 11,
    label: 'Guard',
    emoji: '👟',
    accent: 'bear',
    move: 'layup',
    moveLabel: 'Lay-up',
    look: { hair: '#f2d890', skin: '#f6d0b0', hairStyle: 'fluffy' },
  },
  {
    id: 'p12',
    firstName: 'Thomas',
    number: 12,
    label: 'Forward',
    emoji: '🏆',
    accent: 'warm',
    move: 'dunk',
    moveLabel: 'Dunk',
    look: { hair: '#e6c870', skin: '#eec4a2', hairStyle: 'curly' },
  },
]
