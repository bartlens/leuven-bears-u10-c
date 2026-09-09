export type TeamEvent = {
  id: string
  title: string
  date: string
  time: string
  place: string
  description: string
  emoji: string
  rsvpOpen: boolean
  example?: boolean
}

/**
 * Tornooien from sheet-sync/384779886.csv.
 * Years inferred for seizoen 2026–2027 (Aug–Dec → 2026, Apr–May → 2027).
 * Time windows left empty when the sheet only had “namiddag” / “voormiddag”.
 */
export const events: TeamEvent[] = [
  {
    id: 'tornooi-1',
    title: 'Tornooi Zuiderkempen',
    date: '2026-08-31',
    time: '',
    place: 'Zuiderkempen',
    description: 'Tornooi 1 — zaterdag 31/08',
    emoji: '🏀',
    rsvpOpen: true,
  },
  {
    id: 'tornooi-2',
    title: 'Tornooi Neder-Over-Heembeek',
    date: '2026-12-08',
    time: '',
    place: 'Complexe sportif de Neder-Over-Heembeek, Rue de Lombartzyde 120, 1120 Bruxelles',
    description: 'Tornooi 2 — zondag 8/12',
    emoji: '🏆',
    rsvpOpen: true,
  },
  {
    id: 'tornooi-3',
    title: 'Tornooi Haacht',
    date: '2026-12-21',
    time: 'Namiddag',
    place: 'Haacht',
    description: 'Tornooi 3 — zaterdag 21/12 namiddag',
    emoji: '🏀',
    rsvpOpen: true,
  },
  {
    id: 'tornooi-4',
    title: 'Tornooi Lubbeek',
    date: '2027-04-19',
    time: '12:45–19:20',
    place: 'Lubbeek',
    description: 'Tornooi 4 — zaterdag 19/04 namiddag',
    emoji: '🏆',
    rsvpOpen: true,
  },
  {
    id: 'tornooi-5',
    title: 'Tornooi Profondeville',
    date: '2027-05-17',
    time: '09:15–18:30',
    place: 'Avenue Roquebrune Cap Martin 27/43, 5170 Profondeville',
    description: 'Tornooi 5 — zaterdag 17/05',
    emoji: '🏀',
    rsvpOpen: true,
  },
  {
    id: 'tornooi-6',
    title: 'Tornooi Temse',
    date: '2027-05-30',
    time: 'Voormiddag',
    place: 'Gasthuisstraat 78A, Temse',
    description: 'Tornooi 6 — vrijdag 30/05 voormiddag',
    emoji: '🏆',
    rsvpOpen: true,
  },
]
