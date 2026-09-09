export type Match = {
  id: string
  opponent: string
  date: string
  time: string
  venue: 'thuis' | 'uit'
  location: string
  status: 'upcoming' | 'played'
  scoreUs?: string
  scoreThem?: string
  result?: 'W' | 'L' | 'D'
}

const HOME = 'Campus Redingenhof, Remi Vandervaerenlaan, 3000 Leuven'

/** Source: sheet-sync/477367804.csv (Google Spreadsheet attendance — current season). */
export const matches: Match[] = [
  {
    id: 'm1',
    opponent: 'Clem Scherpenheuvel A',
    date: '2026-09-27',
    time: '15:15',
    venue: 'uit',
    location: 'Stedelijke Sporthal Scherpenheuvel',
    status: 'upcoming',
  },
  {
    id: 'm2',
    opponent: 'GSC Aarschot B',
    date: '2026-10-03',
    time: '09:00',
    venue: 'thuis',
    location: HOME,
    status: 'upcoming',
  },
  {
    id: 'm3',
    opponent: 'Dynamo Bertem B',
    date: '2026-10-11',
    time: '09:30',
    venue: 'uit',
    location: 'Sportzaal Verona',
    status: 'upcoming',
  },
  {
    id: 'm4',
    opponent: 'KYD Kortenberg Young Devils A',
    date: '2026-10-17',
    time: '09:00',
    venue: 'uit',
    location: 'Sporthal Erps-Kwerps',
    status: 'upcoming',
  },
  {
    id: 'm5',
    opponent: 'Hageland United A',
    date: '2026-10-24',
    time: '09:00',
    venue: 'thuis',
    location: HOME,
    status: 'upcoming',
  },
  {
    id: 'm6',
    opponent: 'Clem Scherpenheuvel A',
    date: '2026-11-14',
    time: '09:00',
    venue: 'thuis',
    location: HOME,
    status: 'upcoming',
  },
  {
    id: 'm7',
    opponent: 'GSG Aarschot B',
    date: '2026-11-21',
    time: '09:30',
    venue: 'uit',
    location: 'Stedelijke Sporthal Demervallei',
    status: 'upcoming',
  },
  {
    id: 'm8',
    opponent: 'Dynamo Bertem B',
    date: '2026-11-28',
    time: '09:00',
    venue: 'thuis',
    location: HOME,
    status: 'upcoming',
  },
  {
    id: 'm9',
    opponent: 'KYD Kortenberg Young Devils A',
    date: '2026-12-05',
    time: '09:00',
    venue: 'thuis',
    location: HOME,
    status: 'upcoming',
  },
  {
    id: 'm10',
    opponent: 'Hageland United A',
    date: '2026-12-12',
    time: '16:00',
    venue: 'uit',
    location: 'Sporthal Lubbeek',
    status: 'upcoming',
  },
]
