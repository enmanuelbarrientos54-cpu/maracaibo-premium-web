import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'

/**
 * Hides the browser bars (Fullscreen API). Rendered only where the browser
 * supports it (Android Chrome, desktop); iPhone Safari has no page fullscreen.
 */
export function FullscreenToggle({ className = '' }: { className?: string }) {
  const { t } = useLang()
  const [supported, setSupported] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setSupported(!!document.fullscreenEnabled && typeof document.documentElement.requestFullscreen === 'function')
    const onChange = () => setActive(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  if (!supported) return null
  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
    else document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => undefined)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-ivory/25 px-4 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-ivory/85 transition-colors hover:border-ivory/60 hover:text-ivory ${className}`}
    >
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
        {active ? (
          <path d="M8 3v5H3M12 3v5h5M8 17v-5H3M12 17v-5h5" />
        ) : (
          <path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" />
        )}
      </svg>
      {active ? t('Exit full screen') : t('Full screen')}
    </button>
  )
}
