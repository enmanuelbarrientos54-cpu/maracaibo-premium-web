import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useIntro } from '../context/IntroContext'
import { SplitWords } from '../components/SplitWords'
import { LinkButton } from '../components/ui'
import { links, restaurant } from '../data/restaurant'
import { scrollToTarget } from '../lib/smoothScroll'
import { todaysHours } from '../lib/hours'
import { useLang } from '../i18n/LangContext'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { revealed } = useIntro()
  const { t } = useLang()

  // Scroll-linked depth: photo drifts, copy lifts and fades as you leave the hero.
  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    gsap.to(q('.hero-media'), {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to(q('.hero-copy'), {
      yPercent: -18,
      autoAlpha: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 20%', scrub: true },
    })
  })

  // Entrance choreography, synchronised with the end of the intro wipe.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const q = gsap.utils.selector(el)
    if (!revealed) {
      gsap.set(q('.sw-inner'), { yPercent: 110 })
      gsap.set(q('[data-hero-fade]'), { autoAlpha: 0, y: 20 })
      gsap.set(q('.hero-img'), { scale: 1.22 })
      return
    }
    if (prefersReducedMotion()) {
      gsap.set(q('.sw-inner, [data-hero-fade], .hero-img'), { clearProps: 'all' })
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.fromTo(q('.hero-img'), { scale: 1.22 }, { scale: 1, duration: 2.8, ease: 'expo.out' }, 0)
      .fromTo(q('.sw-inner'), { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.07 }, 0.45)
      .fromTo(q('[data-hero-fade]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.9)
    return () => {
      tl.kill()
    }
  }, [revealed])

  const today = todaysHours()

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Welcome"
      className="relative isolate flex h-[100svh] min-h-[33rem] flex-col justify-end overflow-hidden md:h-auto md:min-h-[100svh]"
    >
      <div className="hero-media absolute inset-0 -z-10 will-change-transform">
        <picture>
          <source type="image/avif" srcSet="/images/reception.avif" />
          <img
            src="/images/reception.webp"
            srcSet="/images/reception-640.webp 640w, /images/reception.webp 2560w"
            sizes="100vw"
            alt={t("Maracaibo's reception: the backlit MARACAIBO sign above a brass-lattice host stand flanked by gold lanterns.")}
            {...{ fetchpriority: 'high' }}
            className="hero-img h-full w-full object-cover object-[var(--hero-focus-m)] will-change-transform md:object-[50%_35%]"
            style={{ ['--hero-focus-m' as string]: '24% 40%' }}
          />
        </picture>
      </div>
      {/* grade for legibility */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(15,12,9,0.82) 0%, rgba(15,12,9,0.25) 22%, rgba(15,12,9,0.2) 42%, rgba(15,12,9,0.6) 68%, rgba(15,12,9,0.96) 100%), linear-gradient(90deg, rgba(15,12,9,0.78) 0%, rgba(15,12,9,0.4) 42%, transparent 72%)',
        }}
      />
      <div className="grain absolute inset-0 -z-10" />

      <div className="hero-copy container-x relative pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-24 md:pb-16 md:pt-32">
        <p data-hero-fade className="eyebrow mb-4 flex items-center gap-3 !text-[0.58rem] !tracking-[0.24em] text-ivory/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] md:mb-8 md:gap-4 md:!text-[0.6875rem] md:!tracking-[0.32em]">
          <span className="inline-block h-px w-6 shrink-0 bg-brass/70 md:w-10" />
          {t(restaurant.tagline)} · Union City, NJ
        </p>

        <SplitWords
          as="h1"
          className="display-xl max-w-[14ch] text-ivory max-md:!text-[clamp(2.5rem,11.5vw,3.6rem)] max-md:[@media(max-height:700px)]:!text-[clamp(2.2rem,10vw,2.9rem)]"
          lines={[t('Venezuelan soul,'), { text: t('Caribbean light.'), accent: true }]}
        />

        <div className="mt-5 grid gap-5 md:mt-12 md:grid-cols-12 md:items-end md:gap-8">
          <p data-hero-fade className="max-w-md text-[0.9rem] leading-snug text-cream/85 max-md:line-clamp-3 max-md:[@media(max-height:640px)]:hidden md:col-span-5 md:text-base md:leading-relaxed">
            {t(restaurant.concept)}
          </p>
          <div data-hero-fade className="grid grid-cols-2 gap-2.5 md:col-span-7 md:flex md:flex-wrap md:justify-end md:gap-3">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#menu')
              }}
              className="btn btn-solid col-span-2 w-full md:w-auto"
            >
              <span>{t('Explore Menu')}</span>
              <span aria-hidden className="btn-arrow">
                ↓
              </span>
            </a>
            <a
              href="#reserve"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#reserve')
              }}
              className="btn btn-ghost w-full !gap-2 !px-3 !text-[0.62rem] !tracking-[0.14em] md:w-auto md:!gap-3 md:!px-[1.6rem] md:!text-[0.72rem] md:!tracking-[0.2em]"
            >
              <span>{t('Reserve a Table')}</span>
              <span aria-hidden className="btn-arrow">
                →
              </span>
            </a>
            <LinkButton
              href={links.order}
              external
              variant="ghost"
              className="w-full !gap-2 !px-3 !text-[0.62rem] !tracking-[0.14em] md:w-auto md:!gap-3 md:!px-[1.6rem] md:!text-[0.72rem] md:!tracking-[0.2em]"
            >
              {t('Order Online')}
            </LinkButton>
          </div>
        </div>

        <div
          data-hero-fade
          className="mt-5 flex flex-col gap-3 border-t border-ivory/10 pt-4 text-[0.62rem] uppercase tracking-[0.2em] text-sand sm:flex-row sm:items-center sm:justify-between md:mt-12 md:pt-5 md:text-[0.7rem]"
        >
          <span className="hidden md:inline">{restaurant.address.full}</span>
          <span className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            {t('Today')} · {t(today.time)}
          </span>
        </div>
      </div>

      <div
        data-hero-fade
        aria-hidden
        className="pointer-events-none absolute bottom-6 right-6 hidden flex-col items-center gap-3 text-[0.58rem] uppercase tracking-[0.3em] text-ivory/60 lg:flex"
      >
        <span className="[writing-mode:vertical-rl]">{t('Scroll')}</span>
        <span className="relative h-14 w-px overflow-hidden bg-ivory/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-cine)_infinite] bg-brass" />
        </span>
      </div>
    </section>
  )
}
