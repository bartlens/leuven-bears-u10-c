import type { MatchAfspraken } from './types'

/**
 * Afspraken sheet is a simple list of lines (not a wide table).
 * Section "Draaischema" splits main bullets from rotation rules.
 */
export function parseAfsprakenCsv(csvText: string): MatchAfspraken {
  const lines = csvText
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/^"|"$/g, '').trim())
    .filter((l) => l.length > 0)

  let title = 'Afspraken wedstrijden'
  const bullets: string[] = []
  const draaiBullets: string[] = []
  let inDraai = false

  for (const line of lines) {
    if (/^AFSPRAKEN\b/i.test(line)) {
      title = line
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
        .replace(/\bwedstrijden\b/i, 'wedstrijden')
      // Prefer canonical title
      title = 'Afspraken wedstrijden'
      continue
    }
    if (/^Draaischema$/i.test(line)) {
      inDraai = true
      continue
    }
    if (inDraai) {
      draaiBullets.push(cleanBullet(line))
    } else {
      bullets.push(cleanBullet(line))
    }
  }

  return {
    title,
    bullets: bullets.length
      ? bullets
      : [
          '45 min voor aanvang van de wedstrijd in de sporthal',
          '30 min voor aanvang van de wedstrijd aangekleed in de kleedkamer',
        ],
    draaischema: {
      title: 'Draaischema',
      bullets: draaiBullets.length
        ? draaiBullets
        : [
            'Iedere wedstrijd spelen max. 8 spelers (speeltijd vs. verplaatsing maximaliseren)',
          ],
    },
  }
}

function cleanBullet(line: string): string {
  return line
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim()
}
