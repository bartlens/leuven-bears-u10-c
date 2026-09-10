import { useSheetData } from '../sheet/SheetProvider'

function formatRelativeNl(iso: string, now = new Date()): string {
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) {
    return then.toLocaleString('nl-BE')
  }
  const diffSec = Math.round((now.getTime() - then.getTime()) / 1000)
  if (diffSec < 45) return 'zojuist'
  if (diffSec < 90) return '1 minuut geleden'
  if (diffSec < 3600) {
    const m = Math.floor(diffSec / 60)
    return `${m} minuten geleden`
  }
  if (diffSec < 3600 * 36) {
    const h = Math.floor(diffSec / 3600)
    return h === 1 ? '1 uur geleden' : `${h} uur geleden`
  }
  return then.toLocaleString('nl-BE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type UpdatedHintProps = {
  className?: string
  /** Compact pill (Home) vs footer line */
  variant?: 'pill' | 'footer'
}

export function UpdatedHint({
  className = '',
  variant = 'pill',
}: UpdatedHintProps) {
  const { source, fetchedAt, loading } = useSheetData()

  if (loading) return null

  let label: string | null = null
  if (source === 'snapshot') {
    label = 'Kalender: offline snapshot'
  } else if (fetchedAt) {
    label = `Kalender bijgewerkt ${formatRelativeNl(fetchedAt)}`
  } else {
    return null
  }

  if (variant === 'footer') {
    return (
      <p className={`text-xs text-muted/70 ${className}`} title={fetchedAt ?? undefined}>
        {label}
      </p>
    )
  }

  return (
    <span
      className={`rounded-full bg-white/5 px-3 py-1 text-sm text-muted ${className}`}
      title={fetchedAt ?? undefined}
    >
      {label}
    </span>
  )
}
