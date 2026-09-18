import { Logo } from './Logo'
import { team } from '../data/team'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-5 text-center sm:px-6 sm:py-6">
        <Logo size={48} />
        <p className="font-display text-lg font-bold text-cream">
          {team.fullName}
        </p>
        <p className="rounded-full border border-hoop/40 bg-hoop/10 px-4 py-1.5 text-sm font-semibold text-hoop-bright">
          {team.tagline}
        </p>
        <p className="text-xs text-muted/70">
          © Blits BV (Bart, papa van Thomas)
        </p>
      </div>
    </footer>
  )
}
