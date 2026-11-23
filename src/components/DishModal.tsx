import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { startScroll, stopScroll } from '../lib/smoothScroll'
import { formatPrice, menuGroups, type MenuItem } from '../data/menu'
import { links } from '../data/restaurant'
import { Motif } from './Motif'
import { LinkButton } from './ui'

/** Expanded dish presentation. Only shows data present in the menu file. */
export function DishModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const [shown, setShown] = useState<MenuItem | null>(item)
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (item) {
      lastFocus.current = document.activeElement as HTMLElement
      setShown(item)
    }
  }, [item])

  // open / close choreography
  useLayoutEffect(() => {
    const el = root.current
    if (!el || !shown) return
    const q = gsap.utils.selector(el)
    const reduced = prefersReducedMotion()
    if (item) {
      stopScroll()
      closeBtn.current?.focus({ preventScroll: true })
      if (reduced) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(q('.dm-backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(q('.dm-panel'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0)
        .fromTo(q('.dm-art'), { scale: 1.2 }, { scale: 1, duration: 1.4 }, 0.2)
        .fromTo(q('[data-dm]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.4)
      return () => {
        tl.kill()
      }
    } else {
      const done = () => {
        setShown(null)
        startScroll()
        lastFocus.current?.focus({ preventScroll: true })
      }
      if (reduced) return done()
      const tl = gsap.timeline({ onComplete: done })
      tl.to(q('.dm-panel'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.in' }).to(
        q('.dm-backdrop'),
        { opacity: 0, duration: 0.35 },
        '-=0.2',
      )
      return () => {
        tl.kill()
      }
    }
  }, [item, shown])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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
  }, [item, onClose])

  if (!shown) return null
  const group = menuGroups.find((g) => g.id === shown.group)!
  const price = formatPrice(shown.price)

  return (
    <div ref={root} className="fixed inset-0 z-[60] flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-labelledby="dm-title">
      <div className="dm-backdrop absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="dm-panel relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain bg-espresso md:mx-6 md:grid md:grid-cols-2 md:overflow-hidden md:rounded-[2px]"
        data-lenis-prevent
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-ivory/25 bg-ink/50 text-ivory backdrop-blur transition-colors hover:border-brass hover:text-brass md:right-6 md:top-6"
          aria-label="Close dish details"
        >
          ✕
        </button>
        <div className="relative h-[min(62vw,320px)] shrink-0 overflow-hidden bg-cocoa md:h-auto md:min-h-[560px]">
          {shown.image ? (
            <img src={shown.image} alt={shown.name} className="dm-art h-full w-full object-cover" />
          ) : (
            <div className="dm-art lattice absolute inset-0 grid place-items-center">
              <Motif kind={group.motif} className="h-1/2 text-brass/80" />
            </div>
          )}
          <span className="absolute left-5 top-5 rounded-full bg-ink/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-sand backdrop-blur">
            {shown.image ? group.english : 'Photography pending'}
          </span>
        </div>

        <div className="flex flex-col p-7 md:p-12">
          <p data-dm className="eyebrow pr-12 text-brass">
            {group.label} · {group.english}
          </p>
          <h3 id="dm-title" data-dm className="mt-8 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-[1.02] tracking-[-0.02em] text-ivory">
            {shown.name}
          </h3>
          {shown.english && (
            <p data-dm className="mt-3 font-display text-lg italic text-brass/90">
              {shown.english}
            </p>
          )}
          {shown.description && (
            <p data-dm className="mt-6 text-lg leading-relaxed text-cream/85">
              {shown.description}
            </p>
          )}
          {shown.note && (
            <p data-dm className="mt-4 text-sm uppercase tracking-[0.18em] text-sand">
              {shown.note}
            </p>
          )}

          <div data-dm className="mt-auto pt-10">
            <div className="flex items-end justify-between border-t border-ivory/10 pt-6">
              <span className="eyebrow text-sand">Price</span>
              {price ? (
                <span className="font-display text-3xl text-ivory">{price}</span>
              ) : (
                <span className="text-sm text-sand">Listed on the official menu</span>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={links.order} external>
                Order Online
              </LinkButton>
              <LinkButton href={shown.source} external variant="ghost">
                View on official site
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
