import { SectionHeader } from '../components/SectionHeader'
import { StaffCard } from '../components/StaffCard'
import { staffMembers, team } from '../data/team'
import {
  attendanceCopy,
  herfststage,
  links,
} from '../data/links'
import { useSheetData } from '../sheet/SheetProvider'

const parentTips = [
  'Zorg voor naamlabels in jas & drinkbus — de kleedkamer is een jungle.',
  'Kom op tijd: 10 min vroeger = rustig aankleden + high-five met de coach.',
  'Na de match: eerst water, dan snack. Suikerstorms later 😄',
  'Carpoolen? Vragen via coaches of Els (ploegafgevaardigde).',
  'Juichen mag luid — schelden niet. We zijn jeugdbasket, geen Champions League.',
  'Vragen over inschrijving of lidgeld? Mail het clubsecretariaat.',
]

const handyLinks = [
  { href: links.club, label: 'leuvenbears.be' },
  { href: links.tickets, label: 'Tickets A-team' },
  {
    href: links.vblCalendarSync,
    label: 'Kalender synchroniseren (VBL)',
  },
  {
    href: links.attendanceSpreadsheet,
    label: 'Aanwezigheid spreadsheet',
  },
  {
    href: links.herfststageForm,
    label: 'Inschrijfformulier herfststage',
  },
]

export function Info() {
  const { afspraken: matchAfspraken } = useSheetData()
  const mapsQuery = encodeURIComponent(
    `${team.hall.name}, ${team.hall.address}, ${team.hall.city}`,
  )

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Praktisch"
        title="Info voor ouders"
        subtitle={`Alles voor ${team.fullName} — coaches, ploegafgevaardigde, zaal en clubcontact. Seizoen ${team.season}.`}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {staffMembers.map((s, i) => (
          <StaffCard key={s.id} staff={s} index={i} />
        ))}
      </div>

      {/* Herfststage */}
      <article className="mb-8 rounded-3xl border border-warm/35 bg-gradient-to-br from-warm/15 via-panel to-ink-soft p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-warm">
          Stage
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-cream">
          {herfststage.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Info van de club (via Sylvie Martel / clubcontext). Inschrijven via
          het formulier; de inschrijving is pas definitief na ontvangst van de
          overschrijving.
        </p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-2xl border border-white/10 bg-ink/40 px-4 py-3">
            <dt className="text-muted">Tarief herfststage</dt>
            <dd className="mt-1 font-display text-xl font-bold text-cream">
              {herfststage.tariff}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink/40 px-4 py-3">
            <dt className="text-muted">Overschrijven naar</dt>
            <dd className="mt-1 break-all font-semibold tracking-wide text-cream">
              {herfststage.iban}
            </dd>
          </div>
          <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-ink/40 px-4 py-3">
            <dt className="text-muted">Mededeling / referentie</dt>
            <dd className="mt-1 break-words font-semibold text-hoop-bright">
              {herfststage.mededeling}
            </dd>
          </div>
        </dl>
        <ul className="mt-4 space-y-2 text-sm text-cream/90">
          {herfststage.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-warm" aria-hidden>
                ●
              </span>
              {n}
            </li>
          ))}
        </ul>
        <a
          href={herfststage.formUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-warm px-5 py-2.5 text-sm font-bold text-ink transition hover:brightness-110"
        >
          Inschrijfformulier openen →
        </a>
      </article>

      {/* Aanwezigheid callout */}
      <article className="mb-8 rounded-3xl border border-hoop/30 bg-gradient-to-br from-hoop/10 to-panel p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
          Praktisch
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-cream">
          {attendanceCopy.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {attendanceCopy.blurb}
        </p>
        <a
          href={links.attendanceSpreadsheet}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex rounded-full border border-hoop/40 bg-hoop/15 px-5 py-2.5 text-sm font-bold text-hoop-bright transition hover:bg-hoop/25"
        >
          Open aanwezigheid spreadsheet →
        </a>
      </article>

      <article className="mb-8 rounded-3xl border border-white/10 bg-ink-soft p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
          Wedstrijden
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-cream">
          {matchAfspraken.title}
        </h2>
        <ul className="mt-4 space-y-2">
          {matchAfspraken.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed text-cream/90">
              <span className="shrink-0 text-hoop-bright" aria-hidden>
                ●
              </span>
              {b}
            </li>
          ))}
        </ul>
        <h3 className="mt-6 font-display text-lg font-bold text-warm">
          {matchAfspraken.draaischema.title}
        </h3>
        <ul className="mt-3 space-y-2">
          {matchAfspraken.draaischema.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm leading-relaxed text-cream/90">
              <span className="shrink-0 text-warm" aria-hidden>
                →
              </span>
              {b}
            </li>
          ))}
        </ul>
        <a
          href={links.attendanceSpreadsheet}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex rounded-full border border-hoop/40 bg-hoop/15 px-5 py-2.5 text-sm font-bold text-hoop-bright transition hover:bg-hoop/25"
        >
          Open aanwezigheid spreadsheet →
        </a>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="card-lift rounded-3xl border border-hoop/30 bg-gradient-to-br from-hoop/15 to-panel p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-hoop-bright">
            Contact
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-cream">
            Clubsecretariaat
          </h2>
          <p className="text-sm text-muted">{team.club}</p>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Secretariaat</dt>
              <dd>
                <a
                  href={`mailto:${team.contact.clubEmail}`}
                  className="break-all font-semibold text-cream hover:text-hoop-bright"
                >
                  {team.contact.clubEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Telefoon</dt>
              <dd className="font-semibold text-cream">{team.contact.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Adres club</dt>
              <dd className="font-semibold text-cream">{team.contact.address}</dd>
            </div>
            <div>
              <dt className="text-muted">Teamcontact</dt>
              <dd className="font-semibold text-cream">
                Coaches Jonathan & Rafa · Els (ploegafgevaardigde)
              </dd>
            </div>
          </dl>
        </article>

        <article className="card-lift rounded-3xl border border-white/10 bg-gradient-to-br from-bear/40 to-panel p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-warm">
            Thuiszaal
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-cream">
            {team.hall.name}
          </h2>
          <p className="mt-3 text-cream">
            {team.hall.address}
            <br />
            {team.hall.city}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {team.hall.notes}
          </p>
          <a
            href={`https://maps.google.com/?q=${mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-hoop/40 bg-hoop/10 px-4 py-2 text-sm font-bold text-hoop-bright transition hover:bg-hoop/20"
          >
            Open in Maps →
          </a>
        </article>
      </div>

      <section className="mt-8 rounded-3xl border border-white/10 bg-ink-soft p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-cream">
          Handige links
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          {handyLinks.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/15 bg-panel px-4 py-2 font-semibold text-cream hover:border-hoop/40 hover:text-hoop-bright"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-ink-soft p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold text-cream">
          Tips voor ouders
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {parentTips.map((tip) => (
            <li
              key={tip}
              className="rounded-2xl border border-white/8 bg-panel/60 px-4 py-3 text-sm leading-relaxed text-muted"
            >
              <span className="mr-2 text-hoop-bright" aria-hidden>
                ●
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
