import { Link, Navigate, useParams } from 'react-router-dom'
import { GedragscodePoster } from '../components/GedragscodePoster'
import { SectionHeader } from '../components/SectionHeader'
import {
  gedragscodeSource,
  getGedragscode,
} from '../data/gedragscodes'

export function GedragscodeDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const code = getGedragscode(slug)

  if (!code) {
    return <Navigate to="/gedragscodes" replace />
  }

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <Link
        to="/gedragscodes"
        className="mb-6 inline-flex min-h-11 items-center text-sm font-bold text-hoop-bright hover:underline"
      >
        ← Alle gedragscodes
      </Link>

      <SectionHeader
        eyebrow={code.eyebrow}
        title={`Gedragscode ${code.title.toLowerCase()}`}
        subtitle={code.blurb}
      />

      <a
        href={gedragscodeSource.url}
        target="_blank"
        rel="noreferrer"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-hoop/40 bg-hoop/10 px-4 py-2 text-sm font-semibold text-hoop-bright transition hover:bg-hoop/20"
      >
        {gedragscodeSource.label} →
      </a>

      <GedragscodePoster
        src={code.poster}
        alt={code.posterAlt}
        className="mb-8 w-full max-w-md sm:max-w-lg"
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {code.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex gap-3 rounded-2xl border border-white/8 bg-panel/60 px-4 py-3 text-sm leading-relaxed text-cream/90"
          >
            <span
              className="mt-0.5 shrink-0 font-bold text-hoop-bright"
              aria-hidden
            >
              ✓
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
