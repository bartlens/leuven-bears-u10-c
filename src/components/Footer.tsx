import { Logo } from './Logo'
import { team } from '../data/team'

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-4 py-3 text-center sm:px-6">
        <Logo size={36} />
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[15px] font-medium leading-snug text-muted sm:text-base">
            {team.fullName}
          </p>
          <p className="text-meta-caption">seizoen 26-27</p>
        </div>
        <p className="rounded-full border border-hoop/40 bg-hoop/10 px-3 py-0.5 text-xs font-semibold text-hoop-bright">
          {team.tagline}
        </p>
        <p className="text-meta-caption">
          © Blits BV (Bart, papa van Thomas)
        </p>
      </div>
    </footer>
  )
}
