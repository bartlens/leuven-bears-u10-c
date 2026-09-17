import type { ReactNode } from 'react'

type SectionHeaderProps = {
  /** Orange uppercase label above the title. Omit or leave empty to hide. */
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  /** Extra class for the whole header block (eyebrow + title + subtitle). */
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={['mb-8 max-w-2xl animate-in', className].filter(Boolean).join(' ')}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-hoop-bright">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  )
}
