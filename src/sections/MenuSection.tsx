import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Flip } from 'gsap/Flip'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { Eyebrow, LinkButton, StatusTag } from '../components/ui'
import { Motif } from '../components/Motif'
import { DishModal } from '../components/DishModal'
import { formatPrice, menuGroups, menuItems, type MenuGroupId, type MenuItem } from '../data/menu'
import { links, restaurant } from '../data/restaurant'
import { useLang } from '../i18n/LangContext'

gsap.registerPlugin(Flip)

type Filter = 'all' | MenuGroupId

export function MenuSection() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const chips = useRef<HTMLDivElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<MenuItem | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menuItems.filter((item) => {
      if (filter !== 'all' && item.group !== filter) return false
      if (!q) return true
      return [item.name, item.english, item.description, item.description && t(item.description)].some((s) => s?.toLowerCase().includes(q))
    })
  }, [filter, query, t])

  const captureFlip = () => {
    if (!grid.current || prefersReducedMotion()) return
    flipState.current = Flip.getState(grid.current.querySelectorAll('[data-card]'))
  }

  const changeFilter = (f: Filter) => {
    if (f === filter) return
    captureFlip()
    setFilter(f)
  }

  // Animate layout changes between filters / searches.
  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !grid.current) return
    flipState.current = null
    Flip.from(state, {
      targets: grid.current.querySelectorAll('[data-card]'),
      duration: 0.85,
      ease: 'expo.inOut',
      absolute: true,
      nested: true,
      onEnter: (els) =>
        gsap.fromTo(els, { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.05, ease: 'expo.out' }),
    })
  }, [filter, query])

  // Sliding pill behind the active category.
  useLayoutEffect(() => {
    const wrap = chips.current
    const pill = indicator.current
    if (!wrap || !pill) return
    const place = (animate: boolean) => {
      const btn = wrap.querySelector<HTMLElement>(`[data-filter="${filter}"]`)
      if (!btn) return
      const vars = { x: btn.offsetLeft, width: btn.offsetWidth }
      if (animate && !prefersReducedMotion()) gsap.to(pill, { ...vars, duration: 0.7, ease: 'expo.out' })
      else gsap.set(pill, vars)
      // keep the active chip in view on small screens
      const target = btn.offsetLeft - wrap.clientWidth / 2 + btn.offsetWidth / 2
      wrap.scrollTo({ left: target, behavior: animate ? 'smooth' : 'auto' })
    }
    place(true)
    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => place(false))
    return () => window.removeEventListener('resize', onResize)
  }, [filter])

  // First entrance of the cards.
  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    gsap.fromTo(
      q('[data-card]'),
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: grid.current, start: 'top 82%', once: true },
      },
    )
  })

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: menuItems.length }
    menuGroups.forEach((g) => (c[g.id] = menuItems.filter((i) => i.group === g.id).length))
    return c
  }, [])

  return (
    <section ref={ref} id="menu" aria-labelledby="menu-title" className="relative bg-espresso py-24 md:py-36">
      <div className="lattice pointer-events-none absolute inset-x-0 top-0 h-64 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-x relative">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="02">{t('The Menu')}</Eyebrow>
            <SplitWords
              id="menu-title"
              className="display-lg mt-8 text-ivory"
              lines={[t('What looks'), { text: t('good?'), accent: true }]}
            />
          </div>
          <div className="space-y-5 lg:col-span-5">
            <p data-fade className="leading-relaxed text-cream/80">
              {t('A first taste of Maracaibo’s kitchen. This preview shows dishes confirmed on the restaurant’s official menu pages — the complete, always-current menu and prices live on the official site.')}
            </p>
            <div data-fade>
              <StatusTag>{t('Verified from maracaibonj.com')}</StatusTag>
            </div>
          </div>
        </Reveal>

        {/* Controls */}
        <div className="sticky top-16 z-20 -mx-[clamp(1.25rem,4vw,3.5rem)] mt-14 bg-espresso/85 px-[clamp(1.25rem,4vw,3.5rem)] py-4 backdrop-blur-xl md:top-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              ref={chips}
              role="group"
              aria-label={t("Filter dishes by category")}
              className="no-scrollbar relative -mx-1 flex gap-1 overflow-x-auto px-1"
            >
              <span ref={indicator} aria-hidden className="absolute bottom-0 left-0 top-0 rounded-full bg-brass" />
              {[{ id: 'all' as const, label: t('All dishes') }, ...menuGroups].map((g) => {
                const on = filter === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    data-filter={g.id}
                    aria-pressed={on}
                    onClick={() => changeFilter(g.id)}
                    className={`relative z-10 flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${
                      on ? 'text-ink' : 'text-cream/75 hover:text-ivory'
                    }`}
                  >
                    {g.label}
                    <span className={`text-[0.6rem] ${on ? 'text-ink/60' : 'text-brass/70'}`}>{counts[g.id]}</span>
                  </button>
                )
              })}
            </div>

            <label className="group relative flex min-h-11 w-full items-center rounded-full border border-ivory/15 px-5 transition-colors focus-within:border-brass lg:w-80">
              <span className="sr-only">{t('Search dishes')}</span>
              <svg viewBox="0 0 24 24" className="mr-3 h-4 w-4 shrink-0 text-sand" aria-hidden>
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  captureFlip()
                  setQuery(e.target.value)
                }}
                placeholder={t("Search ceviche, cachapa…")}
                className="w-full bg-transparent py-3 text-sm text-ivory placeholder:text-mute focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Grid */}
        <p className="sr-only" aria-live="polite">
          {visible.length} {visible.length === 1 ? t('dish shown') : t('dishes shown')}
        </p>
        <div ref={grid} className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {visible.map((item) => (
            <DishCard key={item.id} item={item} index={menuItems.indexOf(item)} onOpen={() => setActive(item)} />
          ))}
          {visible.length === 0 && (
            <div className="col-span-full rounded-sm border border-dashed border-ivory/15 px-6 py-16 text-center">
              <p className="font-display text-2xl text-ivory">{t('Nothing here yet for')} “{query}”.</p>
              <p className="mt-3 text-sand">
                {t('This preview lists verified dishes only —')}{' '}
                <a className="link-underline text-brass" href={links.menu} target="_blank" rel="noopener noreferrer">
                  {t('browse the full official menu')} ↗
                </a>
              </p>
            </div>
          )}
        </div>

        {/* House classics named on the official homepage */}
        <Reveal className="mt-24 md:mt-32">
          <div className="flex flex-col justify-between gap-6 border-t border-ivory/10 pt-10 md:flex-row md:items-end">
            <div>
              <p data-fade className="eyebrow text-brass">{t('House classics')}</p>
              <h3 data-fade className="display-md mt-4 max-w-xl text-ivory">
                {t('The flavors Maracaibo is known for.')}
              </h3>
            </div>
            <p data-fade className="max-w-sm text-sm leading-relaxed text-sand">
              {t('Featured on the official homepage. Varieties and prices are listed on the official menu.')}
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 border-l border-t border-ivory/10 md:grid-cols-4">
            {restaurant.homepageHighlights.map((name, i) => (
              <li key={name} data-fade className="border-b border-r border-ivory/10">
                <a
                  href={links.menu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden p-5 md:aspect-[4/5] md:p-7"
                >
                  <span className="absolute inset-0 translate-y-full bg-brass transition-transform duration-700 [transition-timing-function:var(--ease-cine)] group-hover:translate-y-0" />
                  <span className="relative font-display text-sm text-brass transition-colors duration-700 group-hover:text-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative">
                    <span className="block font-display text-[clamp(1.7rem,3.6vw,3.2rem)] font-light italic leading-none text-ivory transition-colors duration-700 group-hover:text-ink">
                      {name}
                    </span>
                    <span className="mt-3 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sand transition-colors duration-700 group-hover:text-ink/70">
                      {t('See on official menu')} ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-sand">
            {t('Prices and availability follow the official menu at maracaibonj.com and may change. Dishes without a confirmed price show “See official menu”.')}
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={links.menu} external>
              {t('Full Official Menu')}
            </LinkButton>
            <LinkButton href={links.order} external variant="ghost">
              {t('Order Online')}
            </LinkButton>
          </div>
        </div>
      </div>

      <DishModal item={active} onClose={() => setActive(null)} />
    </section>
  )
}

function DishCard({ item, index, onOpen }: { item: MenuItem; index: number; onOpen: () => void }) {
  const { t, lang } = useLang()
  const group = menuGroups.find((g) => g.id === item.group)!
  const price = formatPrice(item.price)
  const sub = item.description ? t(item.description) : lang === 'en' ? item.english : undefined
  return (
    <article data-card data-flip-id={item.id} className="group relative">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-[2px] border border-ivory/[0.08] bg-cocoa/60 p-6 text-left transition-[border-color,transform] duration-700 [transition-timing-function:var(--ease-soft)] hover:-translate-y-1 hover:border-brass/50 md:p-7"
      >
        {item.image ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease-soft)] group-hover:scale-105"
          />
        ) : (
          <>
            <span className="lattice absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-60" />
            <Motif
              kind={group.motif}
              className="absolute left-1/2 top-[40%] h-[46%] -translate-x-1/2 -translate-y-1/2 text-brass/70 transition-transform duration-[1400ms] [transition-timing-function:var(--ease-soft)] group-hover:rotate-[8deg] group-hover:scale-110"
            />
          </>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

        <span className="relative flex items-start justify-between text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
          <span className="text-brass">{group.label}</span>
          <span className="font-display text-xs tracking-normal text-sand">
            {String(index + 1).padStart(2, '0')} / {String(menuItems.length).padStart(2, '0')}
          </span>
        </span>

        <span className="relative mt-auto block">
          <span className="block font-display text-[1.9rem] font-light leading-[1.05] tracking-[-0.01em] text-ivory md:text-[2.1rem]">
            {item.name}
          </span>
          {sub && (
            <span className="mt-3 line-clamp-2 block text-sm leading-relaxed text-cream/70">
              {sub}
            </span>
          )}
          <span className="mt-5 flex items-center justify-between border-t border-ivory/10 pt-4">
            {price ? (
              <span className="font-display text-xl text-ivory">{price}</span>
            ) : (
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-sand">{t('See official menu')}</span>
            )}
            <span className="grid h-9 w-9 place-items-center rounded-full border border-ivory/20 text-ivory transition-[background-color,color,border-color] duration-500 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
              <span aria-hidden>+</span>
              <span className="sr-only">{t('View details for')} {item.name}</span>
            </span>
          </span>
        </span>
      </button>
    </article>
  )
}
