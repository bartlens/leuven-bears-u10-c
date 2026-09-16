/** Home/away as stored on match records. */
export type MatchVenue = 'thuis' | 'uit'

/** Official name used in vs titles site-wide. */
export const OUR_TEAM_NAME = 'Leuven Bears U10 C'

/**
 * Shared match-title treatment: max 2 lines, wrap on word boundaries.
 * Wrap prefers the space before `vs` so line 2 reads `vs {away}`.
 */
export const matchTitleClass =
  'match-title min-w-0 break-normal line-clamp-2 leading-snug'

/**
 * Keep a trailing one-letter team suffix with the previous word
 * (`U10 C`, `Scherpenheuvel A`) so it cannot wrap as an orphan.
 */
function glueLetterSuffix(name: string): string {
  return name.replace(/ ([A-Za-z])$/u, '\u00A0$1')
}

/** Glue `vs` to the away side so a wrap lands after the first team. */
function vsAway(away: string): string {
  return `vs\u00A0${away.replace(/ /g, '\u00A0')}`
}

/**
 * Home team first, away team last.
 * Thuis: `Leuven Bears U10 C vs {Opponent}`
 * Uit: `{Opponent} vs Leuven Bears U10 C`
 *
 * Visible text is unchanged; thin non-breaking spaces keep `vs {away}`
 * together so titles wrap as two clean lines instead of an orphan letter.
 */
export function formatMatchTitle(
  homeAway: MatchVenue,
  opponent: string,
  ourName: string = OUR_TEAM_NAME,
): string {
  const us = glueLetterSuffix(ourName.trim())
  const them = glueLetterSuffix(opponent.trim())
  const home = homeAway === 'thuis' ? us : them
  const away = homeAway === 'thuis' ? them : us
  return `${home} ${vsAway(away)}`
}
