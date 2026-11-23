import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { ease, mix } from '../lib/motion'
import { formatPrice, menuGroups, menuItems } from '../data/menu'
import { Motif } from '../components/Motif'
import { useLang } from '../i18n/LangContext'

/**
 * Pinned scene: a giant gradient wordmark drifts while menu cards (verified
 * dishes only) orbit on an ellipse in 3D. Depth drives size, tilt and stacking.
 */
const orbitItems = [
  'ceviche-vuelve-a-la-vida',
  'cachapa',
  'chichas',
  'tajadas-con-queso',
  '12-mini-arepas-queso',
  'camarones-al-ajillo',
].map((id) => menuItems.find((m) => m.id === id)!)

export function FlavorOrbit() {
  const { t, lang } = useLang()
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, ({ reduced, q }) => {
    const stage = q('.orbit-stage')[0] as HTMLElement
    const cards = q('.orbit-card') as HTMLElement[]
    const title = q('.orbit-title')[0] as HTMLElement
    let w = 1
    let h = 1
    let sizes: { cw: number; ch: number }[] = []
    const measure = () => {
      w = stage.clientWidth
      h = stage.clientHeight
      sizes = cards.map((c) => ({ cw: c.offsetWidth, ch: c.offsetHeight }))
    }
    const render = (p: number) => {
      const mobile = w < 768
      const orbit = p * Math.PI * 3.2
      const enter = reduced ? 1 : ease(0, 0.12, p)
      cards.forEach((card, i) => {
        const a = orbit + (i * Math.PI * 2) / cards.length
        const depth = (Math.cos(a) + 1) / 2
        const { cw, ch } = sizes[i]
        const base = mobile ? Math.min((w * 0.4) / cw, (h * 0.3) / ch) : Math.min((w * 0.15) / cw, (h * 0.44) / ch)
        const s = base * mix(0.62, 1.1, depth)
        const rx = w * (mobile ? 0.27 : 0.15)
        const ry = h * (mobile ? 0.07 : 0.15)
        const cx = w * (mobile ? 0.5 : 0.75) + Math.sin(a) * rx
        const cy = h * (mobile ? 0.7 : 0.52) + Math.cos(a) * ry + (1 - enter) * h * 0.4
        card.style.transform = `translate3d(${cx - cw / 2}px, ${cy - ch / 2}px, 0) rotate(${Math.sin(a) * -11}deg) rotateY(${Math.sin(a) * -20}deg) scale(${s})`
        card.style.opacity = String(mix(0.5, 1, depth) * enter)
        card.style.zIndex = String(10 + Math.round(depth * 20))
      })
      title.style.backgroundPosition = `${p * 100}% 50%`
      title.style.transform = `translate3d(${-p * w * 0.03}px, 0, 0)`
    }
    measure()
    if (reduced) {
      render(0.08)
      return
    }
    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: true,
      onRefresh: (self) => {
        measure()
        render(self.progress)
      },
      onUpdate: (self) => render(self.progress),
    })
    gsap.fromTo(q('[data-orbit-fade]'), { autoAlpha: 0, y: 30 }, {
      autoAlpha: 1, y: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: stage, start: 'top 70%', once: true },
    })
    render(0)
  })

  return (
    <section ref={ref} id="flavors" aria-labelledby="flavors-title" className="relative bg-ink">
      <div className="orbit-stage relative h-[100svh] supports-[height:100lvh]:h-[100lvh] overflow-hidden [perspective:1400px]">
        <div className="lattice pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(70%_60%_at_70%_50%,black,transparent)]" />
        <div className="container-x relative z-30 flex h-full flex-col justify-start pt-24 md:justify-center md:pt-0">
          <p data-orbit-fade className="eyebrow mb-5 text-brass">{t('House flavors')}</p>
          <h2
            id="flavors-title"
            className="orbit-title font-display text-[clamp(3.2rem,10.5vw,10rem)] font-light leading-[0.82] tracking-[-0.04em] text-transparent will-change-transform"
            style={{
              backgroundImage:
                'linear-gradient(100deg, var(--color-brass) 0%, var(--color-ivory) 22%, #d9a05b 40%, var(--color-wine) 62%, var(--color-brass) 82%, var(--color-ivory) 100%)',
              backgroundSize: '260% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            MARACAIBO
            <span className="block text-[0.42em] italic tracking-[-0.02em]">Union City.</span>
          </h2>
          <p data-orbit-fade className="mt-6 max-w-sm leading-relaxed text-cream/80 md:mt-8">
            {t('Venezuelan classics and Caribbean fusion, plated to share. A few dishes from the official menu.')}
          </p>
        </div>

        {orbitItems.map((item) => {
          const group = menuGroups.find((g) => g.id === item.group)!
          const price = formatPrice(item.price)
          return (
            <article
              key={item.id}
              className="orbit-card absolute left-0 top-0 flex h-[300px] w-[220px] flex-col justify-between rounded-[3px] bg-[#f3ead9] p-5 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] will-change-transform [backface-visibility:hidden]"
              aria-label={`${item.name}${price ? `, ${price}` : ''}`}
            >
              <div className="flex items-start justify-between text-[0.55rem] font-bold uppercase tracking-[0.2em] text-brass-deep">
                <span>{group.label}</span>
                <span>Maracaibo</span>
              </div>
              <Motif kind={group.motif} className="mx-auto h-20 w-20 text-brass-deep/80" />
              <div>
                <p className="font-display text-[1.55rem] leading-[1.02] text-ink">{item.name}</p>
                {(lang === 'en' ? item.english ?? item.description : item.description) && (
                  <p className="mt-2 line-clamp-2 text-[0.7rem] leading-snug text-umber">{lang === 'en' ? item.english ?? item.description : t(item.description!)}</p>
                )}
                <p className="mt-3 border-t border-ink/15 pt-2 font-display text-lg text-wine">{price ?? t('See menu')}</p>
              </div>
            </article>
          )
        })}
        <article className="orbit-card absolute left-0 top-0 h-[300px] w-[220px] overflow-hidden rounded-[3px] bg-[#f3ead9] p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] will-change-transform">
          <img src="/images/signature-platter.webp" alt={t('Platter photographed at Maracaibo')} className="h-[240px] w-full object-cover" loading="lazy" />
          <p className="px-1 pt-2 text-center font-display text-sm italic text-umber">{t('Made to share')}</p>
        </article>
      </div>
    </section>
  )
}
