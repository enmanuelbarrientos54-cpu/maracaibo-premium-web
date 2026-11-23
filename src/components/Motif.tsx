import type { MenuGroup } from '../data/menu'

/** Fine line-art motifs used on dishes that don't have photography yet. */
export function Motif({ kind, className = '' }: { kind: MenuGroup['motif'] | 'star'; className?: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {kind === 'wave' && (
        <g {...common}>
          <circle cx="60" cy="60" r="44" opacity=".35" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M18 ${48 + i * 9} q10.5 -7 21 0 t21 0 t21 0 t21 0`} />
          ))}
        </g>
      )}
      {kind === 'corn' && (
        <g {...common}>
          <circle cx="60" cy="60" r="44" opacity=".35" />
          <path d="M60 22c12 10 14 46 0 76c-14-30-12-66 0-76z" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${52 + (i % 2)} ${36 + i * 9}h${16 - (i % 2) * 2}`} opacity=".8" />
          ))}
          <path d="M60 98c-10-6-22-20-26-40M60 98c10-6 22-20 26-40" opacity=".7" />
        </g>
      )}
      {kind === 'plantain' && (
        <g {...common}>
          <circle cx="60" cy="60" r="44" opacity=".35" />
          <path d="M30 40c10 30 34 46 62 42" />
          <path d="M34 36c14 26 34 38 56 38" />
          <path d="M30 40l4-4M92 82l-2-8" />
        </g>
      )}
      {kind === 'glass' && (
        <g {...common}>
          <circle cx="60" cy="60" r="44" opacity=".35" />
          <path d="M44 34h32l-4 50a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6z" />
          <path d="M46 52h28" opacity=".7" />
          <path d="M66 34l8-12h8" />
        </g>
      )}
      {kind === 'tray' && (
        <g {...common}>
          <circle cx="60" cy="60" r="44" opacity=".35" />
          <ellipse cx="60" cy="72" rx="34" ry="10" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={42 + i * 12} cy={64 - (i % 2) * 4} r="6" />
          ))}
        </g>
      )}
      {kind === 'star' && (
        <g {...common}>
          <path d="M60 14l6 40 40 6-40 6-6 40-6-40-40-6 40-6z" />
        </g>
      )}
    </svg>
  )
}
