import { useRef, type ReactNode } from 'react'
import { useGsap } from '../hooks/useGsap'
import { gsap } from '../lib/gsap'

/**
 * Generic scroll reveal for a block of content.
 * - `.sw-inner` children slide up from their word masks
 * - `[data-fade]` children fade/rise in sequence
 * - `[data-mask]` children un-mask from bottom to top (images)
 */
export function Reveal({
  children,
  className,
  as: Tag = 'div',
  start = 'top 78%',
  id,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'article'
  start?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    const words = q('.sw-inner')
    const fades = q('[data-fade]')
    const masks = q('[data-mask]')
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start, once: true } })
    if (masks.length)
      tl.fromTo(
        masks,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', stagger: 0.12 },
        0,
      )
    if (words.length)
      tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.045 }, 0.05)
    if (fades.length)
      tl.fromTo(fades, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 0.25)
  })
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} id={id}>
      {children}
    </Tag>
  )
}
