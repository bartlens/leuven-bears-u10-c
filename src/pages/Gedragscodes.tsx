import { Link } from 'react-router-dom'
import { GedragscodePoster } from '../components/GedragscodePoster'
import { SectionHeader } from '../components/SectionHeader'
import {
  gedragscodes,
  gedragscodeSource,
} from '../data/gedragscodes'

export function Gedragscodes() {
  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Veilig sporten"
        title="Gedragscodes"
        subtitle="Basketbal is leuk als iedereen zich veilig voelt — op training, op de tribune en in de kleedkamer. Deze codes maken duidelijk welk gedrag we van elkaar verwachten bij U10 C, en waar je terechtkan als iets niet oké voelt."
      />

      <a
        href={gedragscodeSource.url}
        target="_blank"
        rel="noreferrer"
        className="ui-card mb-10 flex flex-col gap-3 border-hoop/35 bg-gradient-to-br from-hoop/15 via-panel to-ink-soft transition hover:border-hoop/55 hover:bg-hoop/20 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
            Officiële bron
          </p>
          <p className="mt-2 font-display text-xl font-bold text-cream">
            {gedragscodeSource.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            De posters en teksten hieronder komen van Basketbal Vlaanderen.
            Clubs mogen ze zo gebruiken.
          </p>
        </div>
        <span className="btn-outline shrink-0">
          {gedragscodeSource.cta} →
        </span>
      </a>

      <div className="space-y-6">
        {gedragscodes.map((code) => (
          <article
            key={code.slug}
            className="ui-card card-lift grid gap-5 lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start lg:gap-8"
          >
            <GedragscodePoster
              src={code.poster}
              alt={code.posterAlt}
              className="w-full max-w-sm justify-self-center lg:max-w-none"
            />
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden>
                  {code.emoji}
                </span>
                <span className="rounded-full border border-white/10 bg-ink/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-hoop-bright">
                  {code.eyebrow}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-cream sm:text-3xl">
                {code.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                {code.blurb}
              </p>
              <Link
                to={`/gedragscodes/${code.slug}`}
                className="btn-outline mt-5"
              >
                Ontdek →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
