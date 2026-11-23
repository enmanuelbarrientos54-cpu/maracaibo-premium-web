import { Motif } from './Motif'

/** Slow, endless strip of dishes named on the official site. */
export function Marquee({ words }: { words: readonly string[] }) {
  const row = [...words, ...words]
  return (
    <div className="relative overflow-hidden border-y border-ivory/[0.07] bg-espresso py-6 md:py-8" aria-label={words.join(', ')}>
      <div className="marquee-track flex w-max items-center" aria-hidden="true">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {row.map((w, i) => (
              <span key={`${dup}-${i}`} className="flex items-center">
                <span className="px-6 font-display text-[clamp(1.8rem,4vw,3.6rem)] font-light italic text-cream/90 md:px-10">
                  {w}
                </span>
                <Motif kind="star" className="h-4 w-4 text-brass md:h-5 md:w-5" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
