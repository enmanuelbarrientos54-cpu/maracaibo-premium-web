import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'

/** The wordmark starts as a field of brass dots and fills with colour as it scrolls into place. */
export function Stamp() {
  const ref = useRef<HTMLElement>(null)
  useGsap(ref, ({ reduced, q }) => {
    if (reduced) {
      gsap.set(q('.stamp-fill'), { clipPath: 'inset(0% 0% 0% 0%)' })
      return
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center 62%', scrub: 0.6 },
    })
    tl.fromTo(q('.stamp-word'), { letterSpacing: '0.12em' }, { letterSpacing: '-0.02em', ease: 'none' }, 0)
      .fromTo(q('.stamp-fill'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0.15)
      .fromTo(q('.stamp-sub'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 0.4 }, 0.7)
  })
  const word = 'MARACAIBO'
  const big = 'stamp-word block whitespace-nowrap text-center font-display text-[clamp(3rem,13vw,13rem)] font-normal leading-[0.9]'
  return (
    <section ref={ref} aria-label="Maracaibo" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="relative">
        <span
          aria-hidden
          className={`${big} text-transparent`}
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-brass) 1.2px, transparent 1.7px)',
            backgroundSize: '7px 7px',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          {word}
        </span>
        <span
          aria-hidden
          className={`stamp-fill absolute inset-0 ${big} text-transparent`}
          style={{
            backgroundImage: 'linear-gradient(100deg, var(--color-brass), #e2b874 45%, var(--color-wine))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            clipPath: 'inset(0% 100% 0% 0%)',
          }}
        >
          {word}
        </span>
      </div>
      <p className="stamp-sub eyebrow mt-8 text-center text-sand">Venezuelan &amp; Caribbean cuisine · Union City, NJ</p>
    </section>
  )
}
