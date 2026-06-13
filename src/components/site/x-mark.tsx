// Icône Xklic : un « X » formé de deux barres.
//  • une barre normale (\)
//  • une barre qui file vers le haut, terminée par une flèche (/) → croissance.
// Le X porte le dégradé vermillon → ambre, sans fond (strokes colorés).
export function XMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="X"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="xklic-grad"
          x1="6"
          y1="26"
          x2="26"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#bf3315" />
          <stop offset="0.55" stopColor="#e5431f" />
          <stop offset="1" stopColor="#f2a13a" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#xklic-grad)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* barre normale \ */}
        <path d="M9 9 L22 22" />
        {/* barre qui monte, courbée (élan), plus grande / */}
        <path d="M8.5 23 C 14.5 21 18.5 13 25 5.5" />
        {/* flèche au sommet (chevron ↗ orienté légèrement vers la droite) */}
        <path d="M19 5.8 L25 5.5 L25.2 11.4" />
      </g>
    </svg>
  );
}
