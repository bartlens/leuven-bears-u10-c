import type { Player } from '../data/players'

type Props = {
  player: Player
  /** Walk / face direction */
  facing: 'left' | 'right'
  /** Looking toward the camera (peek / glance) */
  glance?: boolean
  holding?: boolean
  className?: string
}

/**
 * Simple side-view chibi for the idle easter egg (no ball until holding).
 */
export function IdleSideFigure({
  player,
  facing,
  glance = false,
  holding = false,
  className = '',
}: Props) {
  const { hair, skin, cheek = '#f08070' } = player.look
  const flip = facing === 'left' ? -1 : 1

  return (
    <svg
      viewBox="0 0 90 130"
      className={`idle-side-figure ${glance ? 'is-glance' : ''} ${holding ? 'is-holding' : ''} ${className}`}
      style={{ transform: `scaleX(${flip})` }}
      role="img"
      aria-hidden="true"
    >
      <ellipse className="idle-side-shadow" cx="45" cy="122" rx="22" ry="4" fill="#000" opacity="0.28" />

      <g className="idle-side-char">
        {/* legs */}
        <g className="idle-side-legs">
          <rect x="36" y="88" width="9" height="26" rx="4" fill="#1a2127" />
          <rect x="48" y="88" width="9" height="26" rx="4" fill="#12171c" />
          <ellipse cx="40" cy="116" rx="7" ry="3.5" fill="#0a0a0a" />
          <ellipse cx="53" cy="116" rx="7" ry="3.5" fill="#0a0a0a" />
        </g>

        {/* body / jersey */}
        <path
          d="M30 52 Q28 88 34 92 H58 Q64 88 62 52 Z"
          fill="#f38019"
        />
        <path d="M34 58 H58" stroke="#fff" strokeWidth="2" opacity="0.35" />
        <text
          x="46"
          y="78"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="#1a120e"
          fontFamily="system-ui, sans-serif"
        >
          {player.number}
        </text>

        {/* arms — empty or holding */}
        <g className="idle-side-arm-back">
          <path
            d="M58 58 Q72 70 68 86"
            fill="none"
            stroke={skin}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
        <g className="idle-side-arm-front">
          <path
            d={
              holding
                ? 'M34 58 Q18 64 22 78'
                : 'M34 58 Q20 72 24 88'
            }
            fill="none"
            stroke={skin}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>

        {holding && (
          <g className="idle-side-ball">
            <circle cx="20" cy="78" r="11" fill="#f38019" />
            <path
              d="M20 68 V88 M10 78 H30"
              fill="none"
              stroke="#1a120e"
              strokeWidth="1.2"
            />
          </g>
        )}

        {/* head — side profile; glance shows more face toward camera */}
        <g className="idle-side-head">
          <circle cx={glance ? 48 : 52} cy="34" r="18" fill={skin} />
          {/* hair */}
          <path
            d={
              glance
                ? 'M32 30 Q36 14 50 12 Q64 14 66 30 Q62 22 48 20 Q36 22 32 30 Z'
                : 'M36 28 Q40 12 54 12 Q68 16 70 32 Q64 22 52 20 Q40 22 36 28 Z'
            }
            fill={hair}
          />
          {/* ear */}
          <ellipse cx={glance ? 34 : 38} cy="36" rx="3.5" ry="5" fill={skin} />
          {/* eye toward camera when glancing / peeking */}
          {glance ? (
            <>
              <ellipse cx="44" cy="34" rx="3.2" ry="3.6" fill="#1a120e" />
              <circle cx="45" cy="33" r="1" fill="#fff" />
              <ellipse cx="54" cy="34" rx="3.2" ry="3.6" fill="#1a120e" />
              <circle cx="55" cy="33" r="1" fill="#fff" />
              <path
                d="M44 42 Q49 46 54 42"
                fill="none"
                stroke="#1a120e"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="40" cy="40" r="2.2" fill={cheek} opacity="0.7" />
              <circle cx="58" cy="40" r="2.2" fill={cheek} opacity="0.7" />
            </>
          ) : (
            <>
              <ellipse cx="58" cy="34" rx="2.6" ry="3.2" fill="#1a120e" />
              <circle cx="59" cy="33" r="0.9" fill="#fff" />
              <path
                d="M56 41 Q60 43 63 40"
                fill="none"
                stroke="#1a120e"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="50" cy="40" r="2" fill={cheek} opacity="0.65" />
            </>
          )}
        </g>
      </g>
    </svg>
  )
}
