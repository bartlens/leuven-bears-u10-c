import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { team } from '../data/team'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/spelers', label: 'Spelers' },
  { to: '/trainingen', label: 'Trainingen' },
  { to: '/matchen', label: 'Matchen' },
  { to: '/kalender', label: 'Kalender' },
  { to: '/info', label: 'Info' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-ink/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[var(--page-max)] items-center justify-between gap-3 px-[var(--page-gutter)] py-3 sm:gap-4">
        <NavLink
          to="/"
          className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo size={42} className="shrink-0" />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold tracking-wide text-cream sm:text-base">
              {team.name}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hoop">
              {team.category}
            </p>
          </div>
        </NavLink>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm transition-all ${
                    isActive
                      ? 'bg-hoop font-semibold text-white shadow-lg shadow-hoop/30'
                      : 'font-medium text-muted/70 hover:bg-white/5 hover:text-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-panel text-cream touch-manipulation"
            aria-label={open ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-lg" aria-hidden>
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="max-h-[min(70vh,28rem)] overflow-y-auto border-t border-white/8 bg-ink-soft px-3 py-2 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `mb-1 block min-h-11 rounded-xl px-4 py-3.5 text-sm touch-manipulation ${
                    isActive
                      ? 'bg-hoop font-semibold text-white'
                      : 'font-medium text-muted/70 active:bg-white/5 active:text-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
