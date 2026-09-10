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

export type DatedTraining = {
  id: string
  dateIso: string
  day: string
  time: string
  location: string
  focus: string
}

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

export type MatchAfspraken = {
  title: string
  bullets: string[]
  draaischema: {
    title: string
    bullets: string[]
  }
}

export type TeamDataPayload = {
  matches: Match[]
  trainings: DatedTraining[]
  events: TeamEvent[]
  afspraken: MatchAfspraken
  fetchedAt: string
}
