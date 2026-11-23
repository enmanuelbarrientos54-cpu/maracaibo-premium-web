import { useRef } from 'react'
import { gsap } from '../lib/gsap'
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
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const track = q('.exp-track')[0] as HTMLElement
      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: q('.exp-pin')[0],
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.9,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
      // inner parallax per image, driven by the horizontal tween
      q('.exp-img').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
      gsap.to(q('.exp-progress'), {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: q('.exp-pin')[0], start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })
    })
    return () => mm.revert()
  })

  return (
    <section ref={ref} id="experience" aria-labelledby="exp-title" className="relative bg-ink">
      <div className="exp-pin relative overflow-hidden lg:h-[100svh]">
        <div className="exp-track flex flex-col gap-12 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[6vw] lg:py-0 lg:pl-[clamp(1.25rem,4vw,3.5rem)] lg:pr-[10vw]">
          <Reveal className="container-x shrink-0 lg:w-[34vw] lg:max-w-none lg:px-0" start="top 80%">
            <Eyebrow index="03">The Experience</Eyebrow>
            <SplitWords
              id="exp-title"
              className="display-lg mt-8 text-ivory"
              lines={['Step', { text: 'inside.', accent: true }]}
            />
            <p data-fade className="mt-8 max-w-md leading-relaxed text-cream/80">
              From the street to the reception sign — a walk through the spaces of Maracaibo.
            </p>
            <p data-fade className="mt-10 hidden items-center gap-4 text-[0.66rem] uppercase tracking-[0.24em] text-sand lg:flex">
              Keep scrolling <span aria-hidden className="inline-block h-px w-12 bg-brass" />
            </p>
          </Reveal>

          {/* Mobile/tablet: native swipe carousel; desktop: pinned horizontal track */}
          <ol className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,3.5rem)] pb-2 lg:contents">
            {panels.map((p, i) => (
              <li
                key={p.title}
                className={`w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:w-auto ${
                  i % 2 === 0 ? 'lg:self-end lg:pb-[10vh]' : 'lg:self-start lg:pt-[12vh]'
                }`}
              >
                <figure>
                  {/* phones: one consistent 4:5 frame; desktop: editorial mix of formats */}
                  <div className={`relative aspect-[4/5] overflow-hidden rounded-[2px] ${p.ratio}`}>
                    <img
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className="exp-img absolute inset-y-0 -left-[8%] h-full w-[116%] max-w-none object-cover"
                    />
                    {p.concept && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">
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
        <div className="absolute inset-x-[clamp(1.25rem,4vw,3.5rem)] bottom-8 hidden h-px bg-ivory/10 lg:block">
          <div className="exp-progress h-px origin-left scale-x-0 bg-brass" />
        </div>
      </div>
    </section>
  )
}
