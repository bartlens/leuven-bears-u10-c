import type { Player } from '../data/players'

type Props = {
  player: Player
  facing: 'left' | 'right'
  glance?: boolean
  holding?: boolean
  className?: string
}

/**
 * Clearer side-view chibi: visible legs, shorts, shoes; no ball until holding.
 * Drawn facing RIGHT; parent flips with scaleX for left.
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
      viewBox="0 0 100 150"
      className={`idle-side-figure ${glance ? 'is-glance' : ''} ${holding ? 'is-holding' : ''} ${className}`}
      style={{ transform: `scaleX(${flip})` }}
      role="img"
      aria-hidden="true"
      overflow="visible"
    >
      <ellipse cx="50" cy="142" rx="24" ry="5" fill="#000" opacity="0.3" />

      <g className="idle-side-char">
        {/* Back leg (far) */}
        <g className="idle-side-leg idle-side-leg--back">
          <path
            d="M48 95 L42 118 L40 136"
            fill="none"
            stroke="#1a2127"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="39" cy="138" rx="9" ry="4.5" fill="#0c0c0c" />
        </g>

        {/* Body / jersey — stops above knees so legs stay visible */}
        <path
          d="M34 54
             C32 70 33 86 36 94
             H64
             C67 86 68 70 66 54
             Z"
          fill="#f38019"
        />
        {/* shorts */}
        <path
          d="M35 88 H65 L68 98 H33 Z"
          fill="#1a2127"
        />
        <path d="M38 60 H62" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.2" />
        <text
          x="50"
          y="78"
          textAnchor="middle"
          fontSize="12"
          fontWeight="900"
          fill="#1a120e"
          fontFamily="system-ui, sans-serif"
        >
          {player.number}
        </text>

        {/* Front leg (near) */}
        <g className="idle-side-leg idle-side-leg--front">
          <path
            d="M54 95 L60 118 L62 136"
            fill="none"
            stroke="#12171c"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* sock */}
          <path
            d="M56 124 L64 124 L65 132 L55 132 Z"
            fill="#f5f5f5"
            opacity="0.9"
          />
          <ellipse cx="63" cy="138" rx="9" ry="4.5" fill="#0c0c0c" />
        </g>

        {/* Back arm */}
        <path
          d="M64 58 Q78 72 74 90"
          fill="none"
          stroke={skin}
          strokeWidth="8"
          strokeLinecap="round"
          className="idle-side-arm-back"
        />

        {/* Front arm — empty hang or hold ball */}
        <path
          d={holding ? 'M38 58 Q22 66 26 82' : 'M38 58 Q24 74 28 92'}
          fill="none"
          stroke={skin}
          strokeWidth="8"
          strokeLinecap="round"
          className="idle-side-arm-front"
        />

        {holding && (
          <g className="idle-side-ball">
            <circle cx="24" cy="84" r="12" fill="#f38019" />
            <path
              d="M24 73 V95 M13 84 H35"
              fill="none"
              stroke="#1a120e"
              strokeWidth="1.3"
            />
          </g>
        )}

        {/* Head — proper side profile (or ¾ when glancing) */}
        <g className="idle-side-head">
          {glance ? (
            <>
              <circle cx="52" cy="36" r="20" fill={skin} />
              <path
                d="M34 34 Q38 14 54 12 Q72 14 72 36 Q68 24 52 22 Q38 24 34 34 Z"
                fill={hair}
              />
              <ellipse cx="46" cy="36" rx="3.4" ry="3.8" fill="#1a120e" />
              <circle cx="47" cy="35" r="1.1" fill="#fff" />
              <ellipse cx="58" cy="36" rx="3.4" ry="3.8" fill="#1a120e" />
              <circle cx="59" cy="35" r="1.1" fill="#fff" />
              <path
                d="M46 45 Q52 49 58 45"
                fill="none"
                stroke="#1a120e"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="42" cy="42" r="2.4" fill={cheek} opacity="0.75" />
              <circle cx="62" cy="42" r="2.4" fill={cheek} opacity="0.75" />
            </>
          ) : (
            <>
              {/* skull */}
              <ellipse cx="56" cy="36" rx="17" ry="19" fill={skin} />
              {/* nose bump */}
              <path
                d="M70 36 Q76 38 70 42"
                fill="none"
                stroke={skin}
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* hair cap + back */}
              <path
                d="M40 34 Q44 12 58 11 Q74 12 76 34 Q72 20 58 18 Q46 20 40 34 Z"
                fill={hair}
              />
              <path
                d="M40 30 Q36 40 38 52 Q44 48 48 42"
                fill={hair}
              />
              {/* ear */}
              <ellipse cx="44" cy="38" rx="4" ry="5.5" fill={skin} />
              <ellipse cx="44" cy="38" rx="2" ry="3" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="1" />
              {/* single eye */}
              <ellipse cx="64" cy="36" rx="3" ry="3.5" fill="#1a120e" />
              <circle cx="65" cy="35" r="1" fill="#fff" />
              {/* smile */}
              <path
                d="M62 44 Q67 47 71 43"
                fill="none"
                stroke="#1a120e"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="54" cy="42" r="2.2" fill={cheek} opacity="0.7" />
            </>
          )}
        </g>
      </g>
    </svg>
  )
}
