type U10cJerseyIconProps = {
  className?: string
}

/** Compact Leuven Bears U10C home bloesje for the Home quick-link. */
export function U10cJerseyIcon({ className = '' }: U10cJerseyIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="1em"
      height="1em"
      className={className}
      role="img"
      aria-label="Leuven Bears U10C bloesje, nummer 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8 4.4c.5-1 2.2-1.8 5.2-1.8s4.7.8 5.2 1.8l2.8 1.2c1 .5 1.9 1.6 1.4 2.8l-1.5 3.4.7 16.4c.1 1.3-2.4 2.2-8.6 2.2s-8.7-.9-8.6-2.2l.7-16.4-1.5-3.4c-.5-1.2.4-2.3 1.4-2.8z"
        fill="#fff8f0"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8.4 12.2 7.8 26.2c.9.5 3.2 1.1 8.2 1.1.3 0 .5 0 .8 0V12.2z" fill="#0a0a0a" />
      <path d="M23.6 12.2 24.2 26.2c-.9.5-3.2 1.1-8.2 1.1-.3 0-.5 0-.8 0V12.2z" fill="#0a0a0a" />
      <path d="M10.2 12.4 9.8 25.4c.9.3 2.6.7 6.2.7s5.3-.4 6.2-.7l-.4-13z" fill="#fff8f0" />
      <path
        d="M8.9 7.2 7.6 10.3 9.6 13.8"
        fill="none"
        stroke="#f38019"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M23.1 7.2 24.4 10.3 22.4 13.8"
        fill="none"
        stroke="#f38019"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 4.7q4 3.6 8 0"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12.6 5.1q3.4 2.7 6.8 0"
        fill="none"
        stroke="#f38019"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <text
        x="16"
        y="13.4"
        textAnchor="middle"
        fill="#f38019"
        fontFamily="'Space Grotesk', 'Outfit', system-ui, sans-serif"
        fontSize="4.2"
        fontWeight="800"
        letterSpacing="0.06em"
      >
        U10C
      </text>
      <text
        x="16"
        y="23.8"
        textAnchor="middle"
        fill="#0a0a0a"
        fontFamily="'Space Grotesk', 'Outfit', system-ui, sans-serif"
        fontSize="9.6"
        fontWeight="900"
      >
        10
      </text>
    </svg>
  )
}
