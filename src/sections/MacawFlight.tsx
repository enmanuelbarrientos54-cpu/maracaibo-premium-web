import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useLang } from '../i18n/LangContext'
import { macawMedia, pickMacawVariant, type MacawVariant } from '../data/macawMedia'

/**
 * The cinematic surprise near the end of the page: a macaw flies over the
 * Maracaibo bridge, takes a cachapa and flies away into the sunset.
 *
 * - Scroll mode: the stage pins full screen and the scroll drives the film
 *   (smoothed). Scrolling back rewinds it; it never loops.
 * - If seeking proves slow on the device, it falls back to playing the film
 *   once, in real time, while the stage is in view.
 * - The last frame is held at the end, then fades into the next section.
 * - Reduced motion: a still of the key moment, no pinning, no playback.
 */
export function MacawFlight() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [variant, setVariant] = useState<MacawVariant>(pickMacawVariant)
  const [armed, setArmed] = useState(false)
  const [reduced] = useState(prefersReducedMotion)
  const mode = useRef<'scroll' | 'autoplay'>(macawMedia.mode)
  const target = useRef(0)
  const shown = useRef(0)
  const active = useRef(false)
  const playedOnce = useRef(false)

  // Attach the film only when the visitor gets close (saves data on the way down).
  useEffect(() => {
    if (reduced || !ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true)
          io.disconnect()
        }
      },
      { rootMargin: '150% 0px 150% 0px' },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [reduced])

  // Rotating a phone swaps between the vertical and horizontal film.
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const onRotate = () => {
      const next = pickMacawVariant()
      setVariant((cur) => (cur.src === next.src ? cur : next))
    }
    mq.addEventListener('change', onRotate)
    return () => mq.removeEventListener('change', onRotate)
  }, [])

  // Load + prime (iOS renders seeked frames only after a first muted play()).
  useEffect(() => {
    const v = video.current
    if (!armed || !v) return
    v.muted = true
    v.defaultMuted = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    const resumeAt = shown.current
    let blobUrl = ''
    let cancelled = false
    v.load()
    // Scroll control needs a seekable file. Servers without byte-range support make
    // a video unseekable: then load it into memory (always seekable) and, if even
    // that fails, fall back to playing it once in real time.
    const ensureSeekable = () => {
      const ok = v.seekable.length > 0 && v.seekable.end(v.seekable.length - 1) >= v.duration - 0.5
      if (ok || mode.current !== 'scroll' || blobUrl) return
      fetch(variant.src)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((b) => {
          if (cancelled) return
          blobUrl = URL.createObjectURL(b)
          v.src = blobUrl
          v.load()
          v.addEventListener('loadeddata', prime, { once: true })
        })
        .catch(() => {
          mode.current = 'autoplay'
        })
    }
    v.addEventListener('loadedmetadata', ensureSeekable, { once: true })
    const onError = () => {
      if (blobUrl) mode.current = 'autoplay'
    }
    v.addEventListener('error', onError)
    const prime = () => {
      v.currentTime = resumeAt
      const p = v.play()
      p?.then(() => {
        if (mode.current === 'scroll' || !active.current) v.pause()
      }).catch(() => undefined)
    }
    v.addEventListener('loadeddata', prime, { once: true })
    // Measure how fast this device seeks; fall back to real-time playback if it struggles.
    let n = 0
    let total = 0
    let t0 = 0
    const onSeeking = () => (t0 = performance.now())
    const onSeeked = () => {
      if (!t0) return
      total += performance.now() - t0
      n += 1
      if (n >= 12 && total / n > 220 && mode.current === 'scroll') mode.current = 'autoplay'
    }
    v.addEventListener('seeking', onSeeking)
    v.addEventListener('seeked', onSeeked)
    return () => {
      cancelled = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      v.removeEventListener('loadedmetadata', ensureSeekable)
      v.removeEventListener('error', onError)
      v.removeEventListener('loadeddata', prime)
      v.removeEventListener('seeking', onSeeking)
      v.removeEventListener('seeked', onSeeked)
    }
  }, [armed, variant.src])

  useLayoutEffect(() => {
    const el = ref.current
    const st = stage.current
    if (!el || !st || reduced) return
    const q = gsap.utils.selector(el)
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const v = video.current
      if (!v || v.readyState < 2) return
      if (mode.current === 'autoplay') {
        if (active.current && v.paused && !v.ended && !playedOnce.current) {
          playedOnce.current = true
          v.play().catch(() => undefined)
        }
        return
      }
      // ease the displayed time toward the scroll target: smooth, never jumpy
      shown.current += (target.current - shown.current) * 0.2
      if (!v.seeking && Math.abs(v.currentTime - shown.current) > 0.015) v.currentTime = shown.current
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q('[data-mw-in]'),
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 70%', once: true } },
      )
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: st,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.4,
          onUpdate: (self) => {
            target.current = self.progress * (macawMedia.duration - 0.06)
          },
          onToggle: (self) => {
            active.current = self.isActive
            if (self.isActive && !raf) loop()
            if (!self.isActive) {
              if (raf) cancelAnimationFrame(raf)
              raf = 0
              // leaving the stage: settle exactly on the first / last frame (the last one is held)
              const v = video.current
              if (mode.current === 'scroll' && v && v.readyState >= 1) {
                shown.current = self.progress >= 0.5 ? macawMedia.duration - 0.06 : 0
                v.currentTime = shown.current
              }
            }
          },
        },
      })
      tl.to(q('.mw-copy'), { autoAlpha: 0, y: -40, duration: 0.12 }, 0.05)
        .to(q('.mw-copy-shade'), { opacity: 0, duration: 0.14 }, 0.05)
        .fromTo(q('.mw-bar'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        .to(q('.mw-hint'), { autoAlpha: 0, duration: 0.08 }, 0.02)
        // hold the last frame, then let it sink into the next section
        .to(q('.mw-end-shade'), { opacity: 1, duration: 0.1 }, 0.9)
    }, el)
    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [reduced])

  const label = t('Film: a blue-and-yellow macaw flies over the Maracaibo bridge, takes a cachapa and flies away into the sunset.')

  return (
    <section ref={ref} id="macaw" aria-label={label} className="relative bg-ink">
      <div
        ref={stage}
        className="relative h-[100svh] w-full overflow-hidden bg-ink supports-[height:100lvh]:h-[100lvh]"
      >
        {reduced ? (
          <img src={variant.still} alt={label} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            poster={variant.poster}
            muted
            playsInline
            preload={armed ? 'auto' : 'none'}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          >
            {armed && <source src={variant.src} type="video/mp4" />}
          </video>
        )}

        {/* blend with the section above */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-ink to-transparent" />
        {/* legibility for the opening line (fades out as the flight begins) */}
        <div
          className="mw-copy-shade pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(15,12,9,0.72) 0%, rgba(15,12,9,0.25) 45%, transparent 70%)' }}
        />

        <div className="mw-copy container-x absolute inset-x-0 top-[21%] z-10 md:top-[36%]">
          <p data-mw-in className="eyebrow flex items-center gap-4 text-brass [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
            <span className="inline-block h-px w-10 bg-brass/70" />
            {t('Lake Maracaibo, Venezuela')}
          </p>
          <h2 data-mw-in className="display-lg mt-6 max-w-[14ch] text-ivory [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]">
            {t('From the Maracaibo Bridge')} <span className="italic-accent">{t('to your table.')}</span>
          </h2>
        </div>

        <p
          data-mw-in
          className="mw-hint absolute inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/75 md:bottom-12"
          aria-hidden
        >
          {t('Scroll to fly')}
          <span className="relative h-10 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_var(--ease-cine)_infinite] bg-brass" />
          </span>
        </p>

        <div className="absolute inset-x-[clamp(1.25rem,4vw,3.5rem)] bottom-6 z-10 hidden h-px bg-ivory/15 md:block" aria-hidden>
          <div className="mw-bar h-px origin-left scale-x-0 bg-brass" />
        </div>
        <span className="absolute right-[clamp(1.25rem,4vw,3.5rem)] top-[calc(5.5rem+env(safe-area-inset-top))] z-10 rounded-full bg-ink/50 px-3 py-1 text-[0.56rem] uppercase tracking-[0.2em] text-ivory/70 md:top-auto md:bottom-10">
          {t('Concept film · AI-rendered')}
        </span>

        {/* the held last frame sinks into the next section */}
        <div className="mw-end-shade pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink via-ink/60 to-transparent opacity-0" />
      </div>
    </section>
  )
}
