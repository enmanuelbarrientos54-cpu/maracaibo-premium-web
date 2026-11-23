import { useRef } from 'react'
import { useGsap } from '../hooks/useGsap'
import { gsap } from '../lib/gsap'

interface Props {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Parallax travel in percent of the frame height. */
  amount?: number
  /** Unmask from the bottom when entering the viewport. */
  mask?: boolean
  sizes?: string
  srcSet?: string
  eager?: boolean
  caption?: string
}

/** Image in an overflow-hidden frame, drifting gently against the scroll. */
export function ParallaxImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  amount = 8,
  mask = true,
  sizes,
  srcSet,
  eager,
  caption,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useGsap(ref, ({ reduced, q }) => {
    if (reduced) return
    const img = q('img')[0]
    gsap.fromTo(
      img,
      // only as much zoom as the travel needs, so small photos are not enlarged further
      { yPercent: -amount / 2, scale: 1 + amount / 100 },
      {
        yPercent: amount / 2,
        scale: 1 + amount / 100,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    if (mask) {
      gsap.fromTo(
        ref.current,
        { clipPath: 'inset(18% 8% 18% 8%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        },
      )
    }
  })
  return (
    <figure ref={ref} className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
      {caption && (
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-ink/55 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
