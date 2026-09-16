type LogoProps = {
  className?: string
  /** Render height in CSS pixels. Width follows the shield ratio (~692×800). */
  size?: number
}

const SHIELD_WIDTH = 692
const SHIELD_HEIGHT = 800

export function Logo({ className = '', size = 40 }: LogoProps) {
  const height = size
  const width = Math.round((size * SHIELD_WIDTH) / SHIELD_HEIGHT)

  return (
    <picture className={`block w-fit ${className}`}>
      <source type="image/webp" srcSet="/brand/academy-logo-shield.webp" />
      <img
        src="/brand/academy-logo-shield.png"
        alt="Leuven Bears Academy"
        width={width}
        height={height}
        decoding="async"
        draggable={false}
        className="block h-auto max-w-none object-contain"
        style={{ width, height }}
      />
    </picture>
  )
}
