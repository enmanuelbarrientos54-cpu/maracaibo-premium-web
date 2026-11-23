import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis: Lenis | null = null

/**
 * Smooth scrolling for pointer devices only. Touch devices keep native
 * momentum scrolling (better feel, no jank on iOS/Android).
 */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (coarse) return null

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function startScroll() {
  lenis?.start()
  document.documentElement.style.overflow = ''
}

const headerOffset = () => (window.innerWidth < 768 ? -64 : -80)

export function scrollToTarget(target: string | HTMLElement, opts: { immediate?: boolean } = {}) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: headerOffset(), duration: opts.immediate ? 0 : 1.6, immediate: opts.immediate })
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + headerOffset()
    window.scrollTo({ top: y, behavior: opts.immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}
