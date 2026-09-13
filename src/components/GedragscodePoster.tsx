import { useEffect, useId, useState } from 'react'

type GedragscodePosterProps = {
  src: string
  alt: string
  enlarge?: boolean
  className?: string
}

export function GedragscodePoster({
  src,
  alt,
  enlarge = true,
  className = '',
}: GedragscodePosterProps) {
  const [open, setOpen] = useState(false)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const image = (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-2xl border border-white/10 bg-ink object-contain shadow-lg shadow-black/30"
    />
  )

  if (!enlarge) {
    return <div className={className}>{image}</div>
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/poster block w-full cursor-zoom-in touch-manipulation rounded-2xl text-left"
        aria-label={`${alt} — vergroot`}
      >
        {image}
        <span className="mt-2 block text-center text-xs font-semibold text-muted group-hover/poster:text-hoop-bright">
          Tik om te vergroten
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <p id={titleId} className="sr-only">
            {alt}
          </p>
          <img
            src={src}
            alt=""
            className="max-h-[90vh] w-full max-w-lg rounded-2xl border border-white/15 object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-panel text-cream"
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
