import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { scrollToTarget, startScroll, stopScroll } from '../lib/smoothScroll'
import { links, restaurant } from '../data/restaurant'

const items = [
  { label: 'Menu', href: '#menu', img: '/images/signature-platter.webp' },
  { label: 'Our Story', href: '#story', img: '/images/dining-room-bar.webp' },
  { label: 'Experience', href: '#experience', img: '/images/reception.webp' },
  { label: 'Reservations', href: '#reserve', img: '/images/dining-room-bar.webp' },
  { label: 'Private Events', href: '#events', img: '/images/reception.webp' },
  { label: 'Catering', href: '#catering', img: '/images/signature-platter.webp' },
  { label: 'Visit Us', href: '#visit', img: '/images/concept-facade.webp' },
]

const services = [
  { label: 'Order Online', href: links.order },
  { label: 'Gift Cards', href: links.giftCards },
  { label: 'Join Our Team', href: links.careers },
  { label: 'Events', href: links.events },
  { label: 'Official Website', href: links.official },
]

export function FullscreenNav({ open, onClose }: { open: boolean; onClose: (restoreFocus?: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [preview, setPreview] = useState(items[0].img)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const q = gsap.utils.selector(el)
    gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' })
    tl.current = gsap
      .timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .set(el, { visibility: 'visible' })
      .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
      .fromTo(q('.nav-link-inner'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05 }, '-=0.35')
      .fromTo(q('[data-nav-fade]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, '-=0.8')
      .fromTo(q('.nav-preview'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=1.1')
    setMounted(true)
    return () => {
      tl.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (!mounted || !tl.current) return
    if (open) {
      stopScroll()
      tl.current.timeScale(1).play()
      const first = root.current?.querySelector<HTMLElement>('a')
      first?.focus({ preventScroll: true })
    } else {
      tl.current.timeScale(1.6).reverse()
      startScroll()
    }
  }, [open, mounted])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // simple focus trap
      if (e.key === 'Tab' && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>('a, button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    onClose(false)
    window.setTimeout(() => scrollToTarget(href, { immediate: true }), 420)
  }

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="fixed inset-0 z-40 overflow-y-auto bg-espresso text-ivory"
    >
      <div className="lattice pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-x relative grid min-h-full grid-cols-1 gap-10 pb-10 pt-24 md:pt-32 lg:grid-cols-12">
        <nav aria-label="Site sections" className="lg:col-span-7">
          <ol className="space-y-1 md:space-y-0">
            {items.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={(e) => go(e, item.href)}
                  onMouseEnter={() => setPreview(item.img)}
                  onFocus={() => setPreview(item.img)}
                  className="group flex items-baseline gap-5 py-1"
                >
                  <span className="nav-link-inner inline-flex items-baseline gap-5">
                    <span className="w-7 font-display text-sm text-brass/70">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[clamp(2.2rem,6vw,4.6rem)] font-light leading-[1.05] tracking-[-0.02em] transition-[color,transform] duration-700 [transition-timing-function:var(--ease-soft)] group-hover:translate-x-3 group-hover:text-brass">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col justify-between gap-10 lg:col-span-5">
          <div className="nav-preview relative hidden aspect-[4/5] overflow-hidden rounded-sm lg:block">
            {items.map((it) => (
              <img
                key={it.label}
                src={it.img}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] [transition-timing-function:var(--ease-soft)] ${
                  preview === it.img ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div data-nav-fade>
              <p className="eyebrow mb-4 text-brass">Services</p>
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      tabIndex={open ? 0 : -1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-sm text-cream/85 hover:text-ivory"
                    >
                      {s.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div data-nav-fade className="space-y-4 text-sm text-cream/80">
              <p className="eyebrow text-brass">Visit</p>
              <p>
                {restaurant.address.line1}
                <br />
                {restaurant.address.line2}
              </p>
              <a tabIndex={open ? 0 : -1} href={restaurant.phone.href} className="link-underline block text-ivory">
                {restaurant.phone.display}
              </a>
              <a
                tabIndex={open ? 0 : -1}
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline block"
              >
                Instagram @maracaibonj ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
