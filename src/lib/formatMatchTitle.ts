/** Home/away as stored on match records. */
export type MatchVenue = 'thuis' | 'uit'

/** Official name used in vs titles site-wide. */
export const OUR_TEAM_NAME = 'Leuven Bears U10 C'

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
  const us = ourName.trim()
  const them = opponent.trim()
  return homeAway === 'thuis' ? `${us} vs ${them}` : `${them} vs ${us}`
}
