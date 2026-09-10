/**
 * Wedstrijd-afspraken — source: sheet-sync/1883412318.csv
 * (tab "Afspraken wedstrijden" on the attendance spreadsheet).
 */
export type MatchAfspraken = {
  title: string
  bullets: string[]
  draaischema: {
    title: string
    bullets: string[]
  }
}

export const matchAfspraken: MatchAfspraken = {
  title: 'Afspraken wedstrijden',
  bullets: [
    '45 min voor aanvang van de wedstrijd in de sporthal',
    '30 min voor aanvang van de wedstrijd aangekleed in de kleedkamer',
    'Probeer 2 van de 3 wedstrijden aanwezig te zijn',
    'Eén ouder doet de tafel; één iemand nodig als délegué',
    'Beurtrol: elke keer iemand anders wast de truitjes',
    'Indien nodig in Redingenhof helpen met de zaal opruimen (tafels, banken, chrono, …)',
  ],
  draaischema: {
    title: 'Draaischema',
    bullets: [
      'Iedere wedstrijd spelen max. 8 spelers (speeltijd vs. verplaatsing maximaliseren)',
      'Volgorde: Beschikbaarheid → aanwezigheid op beide trainingen → aanwezigheid op donderdag → draaischema',
    ],
  },
}
