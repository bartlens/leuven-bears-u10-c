/** Central parent/team resource URLs — edit here to update the whole site.
 *
 * The Google Spreadsheet (attendanceSpreadsheet) is the source of truth for
 * aanwezigheid, matchen, training dates, afspraken and tornooien. The site
 * refreshes via /api/team-data on load (with sessionStorage cache); static
 * src/data/* remains the instant fallback / build-time snapshot.
 */

export const links = {
  club: 'https://www.leuvenbears.be',
  tickets: 'https://www.leuvenbears.be/tickets',

  /** VBL calendar sync for this team (import in Google/Outlook/Apple). */
  vblCalendarSync:
    'https://vblcal.wisseq.eu/vblcalsync/calsync.aspx?guid=BVBL1125G10003',

  /** Attendance sheet: matches + trainings until autumn break. */
  attendanceSpreadsheet:
    'https://docs.google.com/spreadsheets/d/1YhT3WYq8DzClJ6P5ItVLxelB7MJS5JcdbnJmVKOnD4s/edit?usp=sharing',

  /** U10 herfststage registration (Microsoft Forms). */
  herfststageForm:
    'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=znK2Kzx9dEO0tWcmk-9sCPjI05p7wQlJvN8cjmgsnylUMUlCSEJIU1hQSU9YVE9ES0hUQ1dFVTRQMi4u',
} as const

export const herfststage = {
  title: 'U10 Stage / herfststage',
  tariff: '€75',
  iban: 'BE67 7340 0901 9187',
  /** Bank transfer reference parents should use. */
  mededeling: 'Interne stage + periode (herfststage)+ naam deelnemer',
  notes: [
    'Pas na ontvangst van de overschrijving is de inschrijving definitief.',
    'Voor andere stages volgt later een aparte betaaluitnodiging.',
  ],
  formUrl: links.herfststageForm,
} as const

export const attendanceCopy = {
  title: 'Aanwezigheid (wedstrijden + trainingen)',
  blurb:
    'De Google Spreadsheet is de bron voor aanwezigheid, matchkalender, trainingsdata, afspraken en tornooien — deze site spiegelt die info. Ouders en coaches duiden aan- of afwezigheid aan per wedstrijd en training.',
} as const
