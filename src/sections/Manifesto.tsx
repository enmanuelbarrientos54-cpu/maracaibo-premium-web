import { useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { clamp01 } from '../lib/motion'

/** Wording from the official homepage description of the menu and mission. */
const LINES = ['Crispy arepas.', 'Savory tequeños.', 'Sweet patacón.', 'Traditional mandocas.', 'Venezuela on every plate.']

/** Pinned kinetic type: each word lights up as the scroll reaches it. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ reduced, q }) => {
    const words = q('.mf-word') as HTMLElement[]
    const render = (p: number) => {
      const lit = p * (words.length + 1.5)
      words.forEach((w, i) => {
        const t = clamp01(lit - i)
        w.style.opacity = String(0.14 + t * 0.86)
        w.style.transform = `translate3d(0, ${(1 - t) * 0.12}em, 0)`
      })
    }
    if (reduced) return render(1)
    render(0)
    ScrollTrigger.create({
      trigger: q('.mf-stage')[0],
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => render(self.progress),
    })
  })

  const last = LINES.length - 1
  return (
    <section ref={ref} aria-label={LINES.join(' ')} className="relative bg-ink">
      <div className="mf-stage flex h-[100svh] items-center justify-center overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)]">
        <p aria-hidden className="text-center font-display text-[clamp(2.3rem,7.2vw,6.8rem)] font-light uppercase leading-[0.98] tracking-[-0.025em]">
          {LINES.map((line, li) => (
            <span key={li} className={`block ${li === last ? 'mt-[0.25em] text-[0.62em] normal-case italic text-brass' : 'text-ivory'}`}>
              {line.split(' ').map((word, wi) => (
                <span key={wi} className="mf-word inline-block will-change-transform" style={{ opacity: 0.14 }}>
                  {word}
                  {wi < line.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
