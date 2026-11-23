import { useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useIntro } from '../context/IntroContext'
import { links, restaurant } from '../data/restaurant'
import { useLang } from '../i18n/LangContext'
import { LangToggle } from './LangToggle'

const columns = [
  {
    title: 'Dine',
    items: [
      { label: 'Menu', href: links.menu },
      { label: 'Order Online', href: links.order },
      { label: 'Reservations', href: links.openTable },
    ],
  },
  {
    title: 'Gather',
    items: [
      { label: 'Events', href: links.events },
      { label: 'Private Events', href: links.privateEvents },
      { label: 'Catering', href: links.catering },
    ],
  },
  {
    title: 'Maracaibo',
    items: [
      { label: 'About', href: links.about },
      { label: 'Gift Cards', href: links.giftCards },
      { label: 'Join Our Team', href: links.careers },
      { label: 'Contact', href: links.contact },
    ],
  },
]

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { replay } = useIntro()
  const { t } = useLang()

  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    gsap.fromTo(
      q('.ft-letter'),
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: 'expo.out',
        duration: 1.4,
        stagger: 0.04,
        scrollTrigger: { trigger: q('.ft-word')[0], start: 'top 95%', once: true },
      },
    )
  })

  return (
    <footer ref={ref} className="relative overflow-hidden bg-espresso pt-24 pb-28 md:pb-10">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-3xl font-light leading-tight text-ivory">
              {t('Classic Venezuelan,')} <span className="italic-accent">{t('Caribbean fusion.')}</span>
            </p>
            <p className="mt-6 text-sm leading-relaxed text-sand">
              {restaurant.address.full}
              <br />
              <a href={restaurant.phone.href} className="link-underline text-cream">
                {restaurant.phone.display}
              </a>
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={t(col.title)} className="md:col-span-2">
              <p className="eyebrow text-brass">{t(col.title)}</p>
              <ul className="mt-5 space-y-3">
                {col.items.map((i) => (
                  <li key={i.label}>
                    <a href={i.href} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-cream/80 hover:text-ivory">
                      {t(i.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="md:col-span-2">
            <p className="eyebrow text-brass">{t('Follow')}</p>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="link-underline mt-5 inline-block text-sm text-cream/80">
              Instagram ↗
            </a>
            <button type="button" onClick={replay} className="mt-6 flex items-center gap-3 text-left text-sm text-cream/80 hover:text-ivory">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-ivory/25 text-[0.6rem]">▶</span>
              {t('Watch the film again')}
            </button>
            <div className="mt-6">
              <LangToggle size="sm" />
            </div>
          </div>
        </div>

        <p className="ft-word mt-20 flex select-none justify-between overflow-hidden font-display text-[18.5vw] font-extralight leading-[0.8] tracking-[-0.02em] text-ivory/[0.92] md:mt-28" aria-hidden>
          {'MARACAIBO'.split('').map((l, i) => (
            <span key={i} className="ft-letter inline-block">
              {l}
            </span>
          ))}
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-ivory/10 pt-6 text-[0.66rem] leading-relaxed text-mute md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">
            {t(
              'Private design demonstration prepared for Maracaibo — not the restaurant’s official website. Ordering, reservations, gift cards, careers and inquiries link to the restaurant’s existing official services. The introduction film and images marked “concept” are AI-rendered visualisations, not documentary footage.',
            )}
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} Maracaibo · Union City, NJ</p>
        </div>
      </div>
    </footer>
  )
}
