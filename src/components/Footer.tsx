import { Logo } from './Logo'
import { team } from '../data/team'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/8 bg-ink-soft">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-2.5 text-center sm:px-6 sm:py-3">
        <Logo size={36} />
        <p className="text-[15px] font-medium leading-snug text-[#a3a3a3] sm:text-base">
          {team.fullName}
        </p>
        <p className="rounded-full border border-hoop/40 bg-hoop/10 px-3 py-0.5 text-xs font-semibold text-hoop-bright">
          {team.tagline}
        </p>
        <p className="text-[11px] leading-tight text-muted/70">
          © Blits BV (Bart, papa van Thomas)
        </p>
      </div>
    </footer>
  )
}
