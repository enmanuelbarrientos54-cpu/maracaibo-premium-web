import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { SplitWords } from '../components/SplitWords'
import { Reveal } from '../components/Reveal'

/**
 * Pinned cinematic moment: the platter starts as a framed plate and opens up
 * to fill the screen as you scroll, while the headline counter-moves.
 */
export function Signature() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=140%', scrub: 0.8, pin: q('.sig-stage')[0] },
      })
      tl.fromTo(
        q('.sig-frame'),
        { clipPath: 'inset(22% 30% 22% 30% round 999px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
        0,
      )
        .fromTo(q('.sig-img'), { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
        .fromTo(q('.sig-left'), { xPercent: 0 }, { xPercent: -40, autoAlpha: 0, ease: 'none' }, 0)
        .fromTo(q('.sig-right'), { xPercent: 0 }, { xPercent: 40, autoAlpha: 0, ease: 'none' }, 0)
        .fromTo(q('.sig-caption'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'none' }, 0.55)
    })
    mm.add('(max-width: 767px)', () => {
      gsap.fromTo(
        q('.sig-frame-m'),
        { clipPath: 'inset(10% 10% 10% 10% round 24px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: q('.sig-frame-m')[0], start: 'top 90%', end: 'center 50%', scrub: true },
        },
      )
    })
    return () => mm.revert()
  })

  return (
    <section ref={ref} id="signature" aria-labelledby="sig-title" className="relative bg-ink">
      {/* Desktop pinned stage */}
      <div className="sig-stage relative hidden h-[100svh] overflow-hidden md:block">
        <div className="sig-frame absolute inset-0" style={{ clipPath: 'inset(22% 30% 22% 30% round 999px)' }}>
          <img
            src="/images/signature-platter.webp"
            alt="A Maracaibo platter on a round wooden board: crispy pork belly skewer, chorizo, fried cheese, grilled steak, yuca and plantain chips."
            loading="lazy"
            className="sig-img h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-[4vw]">
          <p className="sig-left font-display text-[clamp(3rem,7vw,7.5rem)] font-light leading-none tracking-[-0.03em] text-ivory">
            From the
          </p>
          <p className="sig-right font-display text-[clamp(3rem,7vw,7.5rem)] font-light italic leading-none tracking-[-0.03em] text-brass">
            grill
          </p>
        </div>

        <div className="sig-caption container-x absolute inset-x-0 bottom-0 pb-14 opacity-0">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 id="sig-title" className="display-md max-w-xl text-ivory">
              Built for the center of the table — <span className="italic-accent">made to be shared.</span>
            </h2>
            <p className="eyebrow text-sand">Photographed at Maracaibo</p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="py-20 md:hidden">
        <Reveal className="container-x mb-10">
          <SplitWords
            className="display-lg text-ivory"
            lines={['From the', { text: 'grill,', accent: true }, 'to the table.']}
          />
        </Reveal>
        <div className="sig-frame-m relative aspect-[4/5] overflow-hidden">
          <img
            src="/images/signature-platter.webp"
            alt="A Maracaibo platter on a round wooden board: crispy pork belly skewer, chorizo, fried cheese, grilled steak, yuca and plantain chips."
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="container-x eyebrow mt-6 text-sand">Photographed at Maracaibo · made to be shared</p>
      </div>
    </section>
  )
}
