import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { links, restaurant } from '../data/restaurant'
import { scrollToTarget } from '../lib/smoothScroll'

/** Thumb-reach action bar for phones, shown once the hero is passed. */
export function MobileDock() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 0.8,
      end: 'max',
      onToggle: (self) => setShow(self.isActive),
    })
    return () => st.kill()
  }, [])

  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em]'
  return (
    <nav
      aria-label="Quick actions"
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex overflow-hidden rounded-full border border-ivory/10 bg-ink/80 shadow-2xl shadow-black/60 backdrop-blur-xl transition-[transform,opacity] duration-700 [transition-timing-function:var(--ease-soft)] md:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[140%] opacity-0'
      }`}
    >
      <a href={restaurant.phone.href} className={`${item} text-cream`} tabIndex={show ? 0 : -1}>
        <span aria-hidden className="text-base leading-none">☏</span>Call
      </a>
      <a
        href="#menu"
        tabIndex={show ? 0 : -1}
        onClick={(e) => {
          e.preventDefault()
          scrollToTarget('#menu')
        }}
        className={`${item} text-cream`}
      >
        <span aria-hidden className="text-base leading-none">❦</span>Menu
      </a>
      <a href={links.order} target="_blank" rel="noopener noreferrer" className={`${item} text-cream`} tabIndex={show ? 0 : -1}>
        <span aria-hidden className="text-base leading-none">↗</span>Order
      </a>
      <a href={links.openTable} target="_blank" rel="noopener noreferrer" className={`${item} bg-brass text-ink`} tabIndex={show ? 0 : -1}>
        <span aria-hidden className="text-base leading-none">✦</span>Reserve
      </a>
    </nav>
  )
}
