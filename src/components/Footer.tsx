import { Logo } from './Logo'
import { team } from '../data/team'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
        <Logo size={56} className="animate-float" />
        <div>
          <p className="font-display text-lg font-bold text-cream">
            {team.fullName}
          </p>
          <p className="mt-1 text-sm text-muted">
            {team.club} · Seizoen {team.season}
          </p>
        </div>
        <p className="rounded-full border border-hoop/40 bg-hoop/10 px-5 py-2 text-sm font-semibold text-hoop-bright">
          {team.tagline}
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a
            href={team.links.club}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cream underline-offset-4 hover:text-hoop-bright hover:underline"
          >
            leuvenbears.be
          </a>
        </div>
        <p className="text-xs text-muted/70">
          Leuven Bears · Jeugdteam U10 C · Seizoen {team.season}
        </p>
      </div>
    </footer>
  )
}
