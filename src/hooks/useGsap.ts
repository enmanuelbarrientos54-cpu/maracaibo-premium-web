import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * Scoped GSAP effect: every tween/ScrollTrigger created inside `setup`
 * is reverted automatically on unmount or when deps change.
 * `setup` receives `reduced` so it can skip motion for reduced-motion users.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: { reduced: boolean; q: (sel: string) => Element[] }) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const reduced = prefersReducedMotion()
    let cleanup: void | (() => void)
    const ctx = gsap.context((self) => {
      cleanup = setup({ reduced, q: (sel: string) => (self.selector ? self.selector(sel) : []) })
    }, scope)
    return () => {
      if (typeof cleanup === 'function') cleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
