/** Home/away as stored on match records. */
export type MatchVenue = 'thuis' | 'uit'

/** Official name used in vs titles site-wide. */
export const OUR_TEAM_NAME = 'Leuven Bears U10 C'

/**
 * Shared match-title treatment: max 2 lines, wrap on word boundaries,
 * balanced/pretty wrapping so a lone “C” does not sit on its own line.
 */
export const matchTitleClass =
  'match-title min-w-0 break-normal text-balance line-clamp-2 leading-snug'

/**
 * Keep a trailing one-letter team suffix with the previous word
 * (`U10 C`, `Scherpenheuvel A`) so it cannot wrap as an orphan.
 */
function glueLetterSuffix(name: string): string {
  return name.replace(/ ([A-Za-z])$/u, '\u00A0$1')
}

/**
 * Home team first, away team last.
 * Thuis: `Leuven Bears U10 C vs {Opponent}`
 * Uit: `{Opponent} vs Leuven Bears U10 C`
 */
export function formatMatchTitle(
  homeAway: MatchVenue,
  opponent: string,
  ourName: string = OUR_TEAM_NAME,
): string {
  const us = glueLetterSuffix(ourName.trim())
  const them = glueLetterSuffix(opponent.trim())
  return homeAway === 'thuis' ? `${us} vs ${them}` : `${them} vs ${us}`
}
