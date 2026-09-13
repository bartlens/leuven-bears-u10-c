import { Link } from 'react-router-dom'
import { SectionHeader } from '../components/SectionHeader'
import {
  gedragscodes,
  gedragscodeSource,
} from '../data/gedragscodes'

export function Gedragscodes() {
  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Veilig sporten"
        title="Gedragscodes"
        subtitle="Basketbal is leuk als iedereen zich veilig voelt — op training, op de tribune en in de kleedkamer. Deze codes maken duidelijk welk gedrag we van elkaar verwachten bij U10 C, en waar je terechtkan als iets niet oké voelt."
      />

      <a
        href={gedragscodeSource.url}
        target="_blank"
        rel="noreferrer"
        className="mb-10 flex flex-col gap-3 rounded-3xl border border-hoop/35 bg-gradient-to-br from-hoop/15 via-panel to-ink-soft p-5 transition hover:border-hoop/55 hover:bg-hoop/20 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
            Officiële bron
          </p>
          <p className="mt-2 font-display text-xl font-bold text-cream">
            {gedragscodeSource.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            De teksten hieronder komen van de gedragscodeposters van Basketbal
            Vlaanderen. Clubs mogen ze zo gebruiken.
          </p>
        </div>
        <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-hoop px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-hoop/30">
          {gedragscodeSource.cta} →
        </span>
      </a>

      <div className="grid gap-4 sm:grid-cols-2">
        {gedragscodes.map((code, i) => (
          <Link
            key={code.slug}
            to={`/gedragscodes/${code.slug}`}
            className="card-lift group flex flex-col rounded-3xl border border-white/10 bg-panel p-5 sm:p-6"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="inline-block text-3xl transition-transform group-hover:scale-125 group-active:scale-125"
                aria-hidden
              >
                {code.emoji}
              </span>
              <span className="rounded-full border border-white/10 bg-ink/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-hoop-bright">
                {code.eyebrow}
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-cream">
              {code.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {code.blurb}
            </p>
            <span className="mt-5 inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-hoop/40 bg-hoop/15 px-5 py-2 text-sm font-bold text-hoop-bright transition group-hover:bg-hoop/25 group-active:bg-hoop/25">
              Ontdek →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
