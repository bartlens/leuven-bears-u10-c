import { links } from './links'

export const gedragscodeSource = {
  url: links.bvGedragscodes,
  label: 'Bron: Basketbal Vlaanderen',
  cta: 'Bekijk op Basketbal Vlaanderen',
} as const

export const gedragscodeSlugs = ['trainers', 'spelers', 'ouders'] as const

export type GedragscodeSlug = (typeof gedragscodeSlugs)[number]

export type Gedragscode = {
  slug: GedragscodeSlug
  title: string
  eyebrow: string
  emoji: string
  blurb: string
  poster: string
  posterAlt: string
  bullets: readonly string[]
}

/**
 * Official “Ik…” bullets from Basketbal Vlaanderen gedragscode posters
 * (Veilig Sporten). Wording is the poster text with normal Dutch spacing;
 * nothing invented.
 */
export const gedragscodes: readonly Gedragscode[] = [
  {
    slug: 'trainers',
    title: 'Trainers',
    eyebrow: 'Coaches',
    emoji: '📢',
    poster: '/gedragscodes/trainers.jpg',
    posterAlt: 'Officiële gedragscode trainers van Basketbal Vlaanderen',
    blurb:
      'Trainers leiden de kids op — basket én omgang. Zij geven het voorbeeld in de zaal en houden de omgeving veilig.',
    bullets: [
      'Ik heb kennis van het huishoudelijk reglement van de club.',
      'Ik respecteer de afspraken die gemaakt zijn met de club, spelers en ouders.',
      'Ik heb respect voor het materiaal van de club.',
      'Ik discrimineer niet op huidskleur, geloof, afkomst, seksuele voorkeur of andere kenmerken.',
      'Ik zorg ervoor dat mijn spelers kunnen sporten in een veilige omgeving.',
      'Ik ga zorgvuldig en correct om met de persoonlijke gegevens en informatie van de leden.',
      'Ik toon respect en geef geen beledigende commentaar op spelers, toeschouwers, ouders, coaches, scheidsrechters en ieder ander.',
      'Ik onthoud mij van grensoverschrijdend gedrag.',
      'Ik neem (meldingen van) grensoverschrijdend gedrag in alle vormen ernstig en verwijs indien nodig verder naar de vertrouwenspersoon of hulporganisaties.',
      'Ik zorg ervoor dat ik alert ben voor waarschuwingssignalen op bovenstaande regels.',
      'Ik controleer of de gedragscodes door de spelers nageleefd worden.',
    ],
  },
  {
    slug: 'spelers',
    title: 'Spelers',
    eyebrow: 'Op het veld',
    emoji: '🏀',
    poster: '/gedragscodes/spelers.jpg',
    posterAlt: 'Officiële gedragscode spelers van Basketbal Vlaanderen',
    blurb:
      'Fairplay: sportief met teamgenoten, tegenstanders, coaches, scheidsrechters en het publiek — op én naast het veld.',
    bullets: [
      'Ik heb kennis van het huishoudelijk reglement van de club.',
      'Ik respecteer de afspraken die gemaakt zijn met de club, trainer en/of teamgenoten.',
      'Ik heb respect voor het materiaal van de club.',
      'Ik laat de sportzaal en kleedkamer telkens schoon achter.',
      'Ik discrimineer niet op huidskleur, geloof, afkomst, seksuele voorkeur of andere kenmerken.',
      'Ik toon respect en onthoud mij van beledigende commentaar ten opzichte van tegenstanders, teamgenoten, scheidsrechters, coaches, toeschouwers en ieder ander.',
      'Ik onthoud mij van grensoverschrijdend gedrag.',
      'Ik weet dat ik terecht kan bij de vertrouwenspersoon voor het melden van grensoverschrijdend gedrag.',
    ],
  },
  {
    slug: 'ouders',
    title: 'Ouders',
    eyebrow: 'Tribune',
    emoji: '📣',
    poster: '/gedragscodes/ouders.jpg',
    posterAlt: 'Officiële gedragscode ouders van Basketbal Vlaanderen',
    blurb:
      'Positief supporteren voor je kind én het team. Afspraken respecteren, en de coach het woord laten zodra training of match begint.',
    bullets: [
      'Ik respecteer de afspraken die gemaakt zijn met het bestuur, trainer, ouders of anderen.',
      'Ik supporter positief voor mijn kind en de rest van het team.',
      'Ik gebruik geen agressieve taal.',
      'Ik discrimineer niet op huidskleur, geloof, afkomst, seksuele voorkeur of andere kenmerken.',
      'Ik onthoud mij van beledigende commentaar op het team, de tegenstander, de coaches, de scheidsrechters, de toeschouwers, en ieder ander.',
      'Ik onthoud mij van grensoverschrijdend gedrag.',
      'Ik weet dat ik terecht kan bij de vertrouwenspersoon voor het melden van grensoverschrijdend gedrag.',
    ],
  },
]

export function getGedragscode(slug: string): Gedragscode | undefined {
  return gedragscodes.find((code) => code.slug === slug)
}
