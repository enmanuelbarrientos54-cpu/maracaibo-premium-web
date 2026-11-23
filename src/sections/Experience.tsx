import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { ease, mix } from '../lib/motion'
import { useGsap } from '../hooks/useGsap'
import { Eyebrow } from '../components/ui'
import { SplitWords } from '../components/SplitWords'
import { Reveal } from '../components/Reveal'

interface Panel {
  src: string
  alt: string
  title: string
  text: string
  /** AI-rendered concept stills are always labelled as such. */
  concept?: boolean
  ratio: string
}

const panels: Panel[] = [
  {
    src: '/images/concept-facade.webp',
    alt: 'Concept rendering of the Maracaibo façade at dusk with its illuminated M canopy.',
    title: 'The arrival',
    text: 'An illuminated M marks the entrance on John F. Kennedy Boulevard.',
    concept: true,
    ratio: 'lg:aspect-[16/10] lg:h-[56vh]',
  },
  {
    src: '/images/concept-vestibule.webp',
    alt: 'Concept rendering of the arched vestibule with tropical plants.',
    title: 'The vestibule',
    text: 'An arch framed in greenery — a quiet threshold before the room opens up.',
    concept: true,
    ratio: 'lg:aspect-[4/5] lg:h-[62vh]',
  },
  {
    src: '/images/reception.webp',
    alt: 'Reception with backlit MARACAIBO lettering, gold lanterns and a lattice host stand.',
    title: 'The welcome',
    text: 'Brass lanterns, a lattice host stand and the name in light.',
    ratio: 'lg:aspect-[16/11] lg:h-[56vh]',
  },
  {
    src: '/images/dining-room-bar.webp',
    alt: 'Dining room with leather chairs and a backlit bar.',
    title: 'The dining room & bar',
    text: 'Warm wood, leather seating and a glowing bar wrapped in gold foliage.',
    ratio: 'lg:aspect-[4/5] lg:h-[62vh]',
  },
  {
    src: '/images/signature-platter.webp',
    alt: 'Platter on a round wooden board.',
    title: 'The table',
    text: 'Generous plates, built to share.',
    ratio: 'lg:aspect-[16/11] lg:h-[56vh]',
  },
]

export function Experience() {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ reduced, q }) => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const stage = q('.cf-stage')[0] as HTMLElement
      const cards = q('.cf-card') as HTMLElement[]
      const heading = q('.cf-heading')[0] as HTMLElement
      const captions = q('.cf-caption') as HTMLElement[]
      const dots = q('.cf-dot') as HTMLElement[]
      let w = 1
      let h = 1
      const measure = () => {
        w = stage.clientWidth
        h = stage.clientHeight
      }
      /* Coverflow: cards start stacked to the right of the copy, spread out,
         then travel through a perspective carousel with depth and reflection. */
      const render = (p: number) => {
        const spread = reduced ? 1 : ease(0.02, 0.22, p)
        const travel = ease(0.18, 1, p) * (cards.length - 1)
        heading.style.opacity = String(1 - ease(0.06, 0.24, p))
        heading.style.transform = `translate3d(${-spread * w * 0.06}px, 0, 0)`
        cards.forEach((card, i) => {
          const d = i - travel
          const dist = Math.abs(d)
          const cw = card.offsetWidth
          const ch = card.offsetHeight
          const cx = mix(w * 0.72 + i * w * 0.05, w * 0.5 + d * w * 0.3, spread)
          const cy = h * 0.47
          const scale = mix(0.62 - i * 0.03, Math.max(0.55, 1 - dist * 0.2), spread)
          const turn = Math.max(-55, Math.min(55, -d * 32)) * spread
          card.style.transform = `translate3d(${cx - cw / 2}px, ${cy - ch / 2}px, ${-dist * 140}px) rotateY(${turn}deg) scale(${scale})`
          card.style.opacity = String(Math.max(0, 1 - dist * 0.36) * mix(i === 0 ? 1 : 0.85, 1, spread))
          card.style.zIndex = String(50 - Math.round(dist * 5))
          captions[i].style.opacity = String(Math.max(0, 1 - dist * 2.2) * spread)
          if (dots[i]) dots[i].style.background = Math.round(travel) === i ? 'var(--color-brass)' : ''
        })
      }
      measure()
      render(0)
      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: `+=${cards.length * 70}%`,
        pin: true,
        scrub: reduced ? false : 0.6,
        onRefresh: (self) => {
          measure()
          render(self.progress)
        },
        onUpdate: (self) => render(self.progress),
      })
      return () => st.kill()
    })
    return () => mm.revert()
  })

  return (
    <section ref={ref} id="experience" aria-labelledby="exp-title" className="relative bg-ink">
      {/* Desktop: pinned 3D coverflow */}
      <div className="cf-stage relative hidden h-[100svh] overflow-hidden [perspective:1600px] lg:block">
        <div className="cf-heading container-x absolute inset-y-0 left-0 z-[60] flex max-w-[40rem] flex-col justify-center">
          <Reveal start="top 80%">
            <Eyebrow index="03">The Experience</Eyebrow>
            <SplitWords id="exp-title" className="display-lg mt-8 text-ivory" lines={['Step', { text: 'inside.', accent: true }]} />
            <p data-fade className="mt-8 max-w-md leading-relaxed text-cream/80">
              From the street to the reception sign — a walk through the spaces of Maracaibo.
            </p>
            <p data-fade className="mt-10 flex items-center gap-4 text-[0.66rem] uppercase tracking-[0.24em] text-sand">
              Keep scrolling <span aria-hidden className="inline-block h-px w-12 bg-brass" />
            </p>
          </Reveal>
        </div>
        <ol className="[transform-style:preserve-3d]">
          {panels.map((p) => (
            <li key={p.title} className="cf-card absolute left-0 top-0 w-[min(46vw,96vh)] will-change-transform [transform-style:preserve-3d]">
              <figure>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)] [-webkit-box-reflect:below_6px_linear-gradient(transparent_72%,rgba(0,0,0,0.22))]">
                  <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  {p.concept && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/80">
                      Concept still · AI-rendered
                    </span>
                  )}
                </div>
                <figcaption className="cf-caption mt-8 text-center opacity-0">
                  <span className="block font-display text-3xl font-light text-ivory">{p.title}</span>
                  <span className="mx-auto mt-2 block max-w-sm text-sm leading-relaxed text-sand">{p.text}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <div className="absolute inset-x-0 bottom-8 z-[60] flex justify-center gap-3" aria-hidden>
          {panels.map((p) => (
            <span key={p.title} className="cf-dot h-1.5 w-6 rounded-full bg-ivory/20 transition-colors duration-500" />
          ))}
        </div>
      </div>

      {/* Phones & tablets: native swipe carousel */}
      <div className="py-24 lg:hidden">
        <Reveal className="container-x" start="top 80%">
          <Eyebrow index="03">The Experience</Eyebrow>
          <SplitWords className="display-lg mt-8 text-ivory" lines={['Step', { text: 'inside.', accent: true }]} />
          <p data-fade className="mt-8 max-w-md leading-relaxed text-cream/80">
            From the street to the reception sign — a walk through the spaces of Maracaibo.
          </p>
        </Reveal>
        <ol className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-2">
          {panels.map((p, i) => (
            <li key={p.title} className="w-[82vw] shrink-0 snap-center sm:w-[60vw]">
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
                  <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  {p.concept && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/80">
                      Concept still · AI-rendered
                    </span>
                  )}
                </div>
                <figcaption className="mt-5 flex gap-5">
                  <span className="font-display text-sm text-brass">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-display text-2xl font-light text-ivory">{p.title}</span>
                    <span className="mt-1 block max-w-xs text-sm leading-relaxed text-sand">{p.text}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
