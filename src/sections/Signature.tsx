import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { SplitWords } from '../components/SplitWords'
import { Reveal } from '../components/Reveal'
import { useLang } from '../i18n/LangContext'

/**
 * Pinned cinematic moment: the platter starts as a framed plate and opens up
 * to fill the screen as you scroll, while the headline counter-moves.
 */
export function Signature() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=170%', scrub: 0.8, pin: q('.sig-stage')[0] },
      })
      tl.fromTo(
        q('.sig-frame'),
        { clipPath: 'inset(22% 30% 22% 30% round 999px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 0.95 },
        0.32,
      )
        .fromTo(q('.sig-img'), { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1.27 }, 0)
        .fromTo(q('.sig-left'), { xPercent: 0 }, { xPercent: -40, autoAlpha: 0, ease: 'none' }, 0)
        .fromTo(q('.sig-right'), { xPercent: 0 }, { xPercent: 40, autoAlpha: 0, ease: 'none' }, 0)
        .fromTo(q('.sig-caption'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 0.6 }, 1.15)
        // giant outlined line drifting behind the plate
        .fromTo(q('.sig-marquee'), { xPercent: 4 }, { xPercent: -46, ease: 'none', duration: 1.75 }, 0)
        // two polaroids fan out from behind the plate, then step aside as it opens
        .fromTo(
          q('.sig-echo-l'),
          { x: 0, rotateY: 0, rotate: 0, scale: 0.78, autoAlpha: 0 },
          { x: '-25vw', rotateY: 20, rotate: -6, scale: 0.9, autoAlpha: 1, ease: 'none', duration: 0.42 },
          0.02,
        )
        .fromTo(
          q('.sig-echo-r'),
          { x: 0, rotateY: 0, rotate: 0, scale: 0.78, autoAlpha: 0 },
          { x: '25vw', rotateY: -20, rotate: 6, scale: 0.9, autoAlpha: 1, ease: 'none', duration: 0.42 },
          0.08,
        )
        .to(q('.sig-echo'), { autoAlpha: 0, y: -40, ease: 'none', duration: 0.3 }, 0.72)
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
      <div className="sig-stage relative hidden h-[100svh] overflow-hidden [perspective:1400px] md:block">
        <p
          aria-hidden
          className="sig-marquee absolute left-0 top-[calc(50%-8.5vw)] whitespace-nowrap font-display text-[17vw] font-light italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,167,106,0.38)] will-change-transform"
        >
          {t('From the grill · to the table · Maracaibo · From the grill ·')}
        </p>
        {[
          { cls: 'sig-echo-l', src: '/images/reception.webp', cap: 'The welcome' },
          { cls: 'sig-echo-r', src: '/images/dining-room-bar.webp', cap: 'The dining room' },
        ].map((e) => (
          <figure
            key={e.cls}
            aria-hidden
            className={`sig-echo ${e.cls} absolute left-[calc(50%-11vw)] top-[calc(50%-14.5vw)] w-[22vw] bg-[#f3ead9] p-[0.7vw] pb-[2.6vw] opacity-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] will-change-transform`}
          >
            <img src={e.src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-[0.6vw] text-center font-display text-[1.1vw] italic text-umber">{t(e.cap)}</figcaption>
          </figure>
        ))}
        <div className="sig-frame absolute inset-0" style={{ clipPath: 'inset(22% 30% 22% 30% round 999px)' }}>
          <img
            src="/images/signature-platter.webp"
            alt={t("A Maracaibo platter on a round wooden board: crispy pork belly skewer, chorizo, fried cheese, grilled steak, yuca and plantain chips.")}
            loading="lazy"
            className="sig-img h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-[4vw]">
          <p className="sig-left font-display text-[clamp(3rem,7vw,7.5rem)] font-light leading-none tracking-[-0.03em] text-ivory">
            {t('From the')}
          </p>
          <p className="sig-right font-display text-[clamp(3rem,7vw,7.5rem)] font-light italic leading-none tracking-[-0.03em] text-brass">
            {t('grill')}
          </p>
        </div>

        <div className="sig-caption container-x absolute inset-x-0 bottom-0 pb-14 opacity-0">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 id="sig-title" className="display-md max-w-xl text-ivory">
              {t('Built for the center of the table —')} <span className="italic-accent">{t('made to be shared.')}</span>
            </h2>
            <p className="eyebrow text-sand">{t('Photographed at Maracaibo')}</p>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="py-20 md:hidden">
        <Reveal className="container-x mb-10">
          <SplitWords
            className="display-lg text-ivory"
            lines={[t('From the'), { text: t('grill,'), accent: true }, t('to the table.')]}
          />
        </Reveal>
        <div className="sig-frame-m relative aspect-[4/5] overflow-hidden">
          <img
            src="/images/signature-platter.webp"
            alt={t("A Maracaibo platter on a round wooden board: crispy pork belly skewer, chorizo, fried cheese, grilled steak, yuca and plantain chips.")}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="container-x eyebrow mt-6 text-sand">{t('Photographed at Maracaibo · made to be shared')}</p>
      </div>
    </section>
  )
}
