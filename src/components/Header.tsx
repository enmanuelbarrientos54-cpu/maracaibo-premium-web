import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { scrollToTarget } from '../lib/smoothScroll'
import { links } from '../data/restaurant'
import { useIntro } from '../context/IntroContext'
import { FullscreenNav } from './FullscreenNav'

export const primaryNav = [
  { label: 'Menu', href: '#menu' },
  { label: 'Experience', href: '#experience' },
  { label: 'Reservations', href: '#reserve' },
  { label: 'Private Events', href: '#events' },
  { label: 'Catering', href: '#catering' },
  { label: 'Visit', href: '#visit' },
]

export function Header() {
  const ref = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { revealed } = useIntro()

  // Entrance once the intro hands over
  useEffect(() => {
    if (!revealed || !ref.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const tween = gsap.fromTo(
      ref.current.querySelectorAll('[data-head]'),
      { autoAlpha: 0, y: -18 },
      { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.06, delay: 0.75, ease: 'expo.out' },
    )
    return () => {
      tween.kill()
    }
  }, [revealed])

  // Solid background after the hero; hide on scroll-down, show on scroll-up
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setSolid(y > window.innerHeight * 0.6)
        const hide = self.direction === 1 && y > window.innerHeight * 0.9
        gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
      },
    })
    return () => st.kill()
  }, [])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <>
      <header
        ref={ref}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700 ${
          solid && !open ? 'border-b border-ivory/[0.06] bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            data-head
            className="group flex items-baseline gap-3"
            aria-label="Maracaibo — back to top"
          >
            <span className="font-display text-[1.15rem] font-normal tracking-[0.38em] text-ivory md:text-[1.3rem]">
              MARACAIBO
            </span>
          </a>

          <nav aria-label="Primary" className="hidden min-[1380px]:block">
            <ul className="flex items-center gap-7 2xl:gap-9">
              {primaryNav.map((item) => (
                <li key={item.href} data-head>
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className="link-underline whitespace-nowrap py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory/80 transition-colors hover:text-ivory"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              data-head
              href={links.order}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hidden whitespace-nowrap !min-h-10 !px-5 !text-[0.64rem] md:inline-flex"
            >
              Order Online<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              data-head
              href="#reserve"
              onClick={(e) => go(e, '#reserve')}
              className="btn btn-solid !min-h-10 !px-4 !text-[0.64rem] md:!px-5"
            >
              Reserve
            </a>
            <button
              ref={toggleRef}
              data-head
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative ml-1 grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition-colors hover:border-ivory/60"
            >
              <span
                className={`absolute h-px w-5 bg-ivory transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[4px]'}`}
              />
              <span
                className={`absolute h-px w-5 bg-ivory transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[4px]'}`}
              />
            </button>
          </div>
        </div>
      </header>
      <FullscreenNav
        open={open}
        onClose={(restoreFocus = true) => {
          setOpen(false)
          if (restoreFocus) toggleRef.current?.focus({ preventScroll: true })
        }}
      />
    </>
  )
}
