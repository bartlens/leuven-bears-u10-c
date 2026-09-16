import { Logo } from './Logo'
import { UpdatedHint } from './UpdatedHint'
import { team } from '../data/team'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center sm:px-6 sm:py-6">
        <Logo size={48} />
        <div>
          <p className="font-display text-lg font-bold text-cream">
            {team.fullName}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {team.club} ·{' '}
            <span className="whitespace-nowrap">Seizoen {team.season}</span>
          </p>
        </div>
        <p className="rounded-full border border-hoop/40 bg-hoop/10 px-4 py-1.5 text-sm font-semibold text-hoop-bright">
          {team.tagline}
        </p>
        <p className="text-xs text-muted/70">
          Leuven Bears · Jeugdteam U10 C ·{' '}
          <span className="whitespace-nowrap">Seizoen {team.season}</span>
        </p>
        <p className="text-xs text-muted/70">
          © Blits BV (Bart, papa van Thomas)
        </p>
        <UpdatedHint variant="footer" />
      </div>
    </footer>
  )
}
