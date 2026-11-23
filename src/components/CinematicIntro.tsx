import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useIntro } from '../context/IntroContext'
import { startScroll, stopScroll } from '../lib/smoothScroll'

/**
 * Full-screen cinematic introduction.
 *
 * The film (provided Higgsfield render) descends on the façade, climbs the
 * stairs, passes the arched vestibule and lands on the reception sign. As it
 * reaches the reception the frame dims, the MARACAIBO wordmark sets in, and
 * the overlay wipes upward to reveal the real reception photograph in the
 * hero — the same space, now photographed.
 */

type Phase = 'loading' | 'playing' | 'blocked' | 'failed' | 'outro'

interface Source {
  /** Path without extension; both .mp4 (H.264) and .webm (VP9) exist. */
  base: string
  poster: string
}

type NetInfo = { saveData?: boolean; effectiveType?: string }

function pickSource(): Source {
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection
  const constrained = !!conn?.saveData || /(^|-)2g$|3g/.test(conn?.effectiveType ?? '')

  // Portrait phones get a pre-cropped vertical cut: identical framing to
  // object-fit: cover, but a fraction of the bytes.
  if (h > w && w < 900) return { base: '/video/intro-portrait', poster: '/video/intro-poster-portrait.jpg' }
  if (constrained || w * dpr < 1200) return { base: '/video/intro-720', poster: '/video/intro-poster.jpg' }
  return { base: '/video/intro-1080', poster: '/video/intro-poster.jpg' }
}

/** Captions timed to the film's shots. */
const CAPTIONS = [
  { at: 0, text: 'Union City, New Jersey' },
  { at: 4.2, text: '1218 John F. Kennedy Blvd' },
  { at: 8.6, text: 'Bienvenidos' },
]

const OUTRO_LEAD = 1.15 // seconds before the end the outro begins
const BRAND = 'MARACAIBO'.split('')

export function CinematicIntro() {
  const { reveal, finish } = useIntro()
  const root = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const outroStarted = useRef(false)
  const [phase, setPhase] = useState<Phase>('loading')
  const [caption, setCaption] = useState(0)
  const source = useMemo(pickSource, [])

  /* ------------------------------------------------------------ outro */
  const runOutro = useCallback(
    (fast: boolean) => {
      if (outroStarted.current || !root.current) return
      outroStarted.current = true
      setPhase('outro')

      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      const v = video.current

      tl.to(q('.intro-chrome'), { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 0)
        // the film settles into darkness so the wordmark never competes with the sign on screen
        .to(q('.intro-veil'), { opacity: 0.88, duration: fast ? 0.45 : 1.1, ease: 'power2.inOut' }, 0)
        .to(q('.intro-media'), { scale: 1.08, filter: 'blur(6px)', duration: fast ? 1.4 : 2.4, ease: 'power1.out' }, 0)
        .fromTo(
          q('.intro-letter'),
          // y: 0 resets the offset GSAP reads from the CSS pre-hide, so only yPercent moves
          { y: 0, yPercent: 115, rotate: 4 },
          { y: 0, yPercent: 0, rotate: 0, duration: fast ? 0.8 : 1.25, stagger: fast ? 0.035 : 0.065 },
          fast ? 0.1 : 0.35,
        )
        .fromTo(q('.intro-rule'), { scaleX: 0 }, { scaleX: 1, duration: fast ? 0.7 : 1.2, ease: 'expo.inOut' }, '<0.25')
        .fromTo(q('.intro-sub'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, '<0.2')
        // hold on the wordmark, then pull the curtain up to reveal the homepage
        .addLabel('wipe', fast ? 0.55 : '+=0.55')
        .add(() => {
          v?.pause()
          reveal()
        }, 'wipe')
        .to(q('.intro-brand'), { yPercent: -35, autoAlpha: 0, duration: 1.1, ease: 'expo.in' }, 'wipe-=0.15')
        .to(
          root.current,
          { clipPath: 'inset(0% 0% 100% 0%)', duration: fast ? 1.05 : 1.35, ease: 'expo.inOut' },
          'wipe',
        )
        .add(() => finish())
    },
    [finish, reveal],
  )

  const skip = useCallback(() => runOutro(true), [runOutro])

  /* ------------------------------------------------------------ lifecycle */
  useLayoutEffect(() => {
    stopScroll()
    gsap.set(root.current, { clipPath: 'inset(0% 0% 0% 0%)' })
    gsap.fromTo(root.current?.querySelector('.intro-media') ?? null, { opacity: 0 }, { opacity: 1, duration: 0.9 })
    return () => startScroll()
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    const attempt = v.play()
    attempt?.catch((err: DOMException) => {
      // NotAllowedError = autoplay blocked (e.g. iOS Low Power Mode). Offer a tap-to-play.
      if (err?.name === 'NotAllowedError') setPhase((p) => (p === 'outro' ? p : 'blocked'))
    })

    // Slow network safety net: if the film hasn't started after 7s, move on gracefully.
    const stall = window.setTimeout(() => {
      if (!outroStarted.current && v.readyState < 3 && v.paused) {
        setPhase((p) => (p === 'blocked' ? p : 'failed'))
      }
    }, 7000)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !outroStarted.current && v.paused && v.currentTime > 0) {
        v.play().catch(() => undefined)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(stall)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [skip])

  // When the film fails to load, hold the poster frame briefly and run the brand outro.
  useEffect(() => {
    if (phase !== 'failed') return
    const t = window.setTimeout(() => runOutro(true), 900)
    return () => window.clearTimeout(t)
  }, [phase, runOutro])

  const onTimeUpdate = () => {
    const v = video.current
    if (!v || !v.duration) return
    const ratio = v.currentTime / v.duration
    if (progress.current) progress.current.style.transform = `scaleX(${ratio})`
    let idx = 0
    CAPTIONS.forEach((c, i) => {
      if (v.currentTime >= c.at) idx = i
    })
    setCaption((prev) => (prev === idx ? prev : idx))
    if (v.duration - v.currentTime <= OUTRO_LEAD) runOutro(false)
  }

  const playManually = () => {
    const v = video.current
    if (!v) return
    v.play()
      .then(() => setPhase('playing'))
      .catch(() => runOutro(true))
  }

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden bg-ink text-ivory"
      role="region"
      aria-label="Maracaibo introduction film"
      style={{ willChange: 'clip-path' }}
    >
      {/* Media */}
      <div className="intro-media absolute inset-0 origin-[50%_60%]">
        <video
          ref={video}
          className="h-full w-full object-cover"
          poster={source.poster}
          muted
          autoPlay
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPhase((p) => (p === 'outro' ? p : 'playing'))}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => runOutro(false)}
          onError={() => setPhase((p) => (p === 'outro' ? p : 'failed'))}
        >
          <source src={`${source.base}.mp4`} type='video/mp4; codecs="avc1.640028"' />
          {/* Errors on the final <source> mean no candidate could be loaded. */}
          <source
            src={`${source.base}.webm`}
            type='video/webm; codecs="vp9"'
            onError={() => setPhase((p) => (p === 'outro' ? p : 'failed'))}
          />
        </video>
      </div>

      {/* Cinematic grade: vignette + soft top/bottom falloff for legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(8,6,4,0.55) 100%), linear-gradient(180deg, rgba(8,6,4,0.45) 0%, transparent 18%, transparent 72%, rgba(8,6,4,0.7) 100%)',
        }}
      />
      <div className="intro-veil pointer-events-none absolute inset-0 bg-ink opacity-0" />

      {/* Chrome: wordmark, skip, captions, progress */}
      <div className="intro-chrome absolute inset-0">
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-10 md:pt-8">
          <span className="font-display text-sm tracking-[0.42em] text-ivory/85">MARACAIBO</span>
          <button
            type="button"
            onClick={skip}
            className="group flex min-h-11 items-center gap-3 rounded-full border border-ivory/25 bg-ink/25 px-5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-ivory/90 backdrop-blur-md transition-colors duration-500 hover:border-ivory/60 hover:text-ivory"
          >
            Skip intro
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-10 md:pb-9">
          <div className="mb-4 flex items-end justify-between gap-6">
            <p key={caption} className="intro-caption eyebrow text-ivory/85" aria-live="off">
              <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-brass align-middle" />
              {CAPTIONS[caption].text}
            </p>
            <p className="hidden text-[0.62rem] uppercase tracking-[0.22em] text-ivory/45 sm:block">
              Concept film · AI-rendered
            </p>
          </div>
          <div className="h-px w-full bg-ivory/15">
            <div ref={progress} className="h-px origin-left bg-brass" style={{ transform: 'scaleX(0)' }} />
          </div>
          <p className="mt-3 text-[0.6rem] uppercase tracking-[0.22em] text-ivory/45 sm:hidden">
            Concept film · AI-rendered
          </p>
        </div>

        {phase === 'blocked' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-ink/40 px-6 text-center backdrop-blur-[2px]">
            <button type="button" onClick={playManually} className="btn btn-solid">
              Play the film <span className="btn-arrow">▸</span>
            </button>
            <button type="button" onClick={skip} className="link-underline text-xs uppercase tracking-[0.24em] text-ivory/80">
              Enter the site
            </button>
          </div>
        )}
      </div>

      {/* Brand reveal */}
      <div className="intro-brand pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p className="intro-sub eyebrow mb-6 text-brass opacity-0">Union City · New Jersey</p>
        <h2 className="flex overflow-hidden font-display text-[clamp(2.6rem,11vw,9.5rem)] font-light leading-none tracking-[0.06em]" aria-label="Maracaibo">
          {BRAND.map((l, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.06em]" aria-hidden>
              <span className="intro-letter inline-block translate-y-[115%]">{l}</span>
            </span>
          ))}
        </h2>
        <div className="intro-rule mt-6 h-px w-40 origin-center scale-x-0 bg-brass md:w-64" />
        <p className="intro-sub mt-6 font-display text-lg italic text-cream/90 opacity-0 md:text-2xl">
          Venezuelan &amp; Caribbean cuisine
        </p>
      </div>
    </div>
  )
}
