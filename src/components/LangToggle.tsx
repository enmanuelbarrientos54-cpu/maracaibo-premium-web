import { useLang, type Lang } from '../i18n/LangContext'

/**
 * Visible ES / EN switch: a two-option pill with a sliding highlight.
 * Each option is a real button with aria-pressed, labelled in its own language.
 */
export function LangToggle({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const { lang, setLang } = useLang()
  const opts: { id: Lang; short: string; label: string }[] = [
    { id: 'es', short: 'ES', label: 'Español' },
    { id: 'en', short: 'EN', label: 'English' },
  ]
  const h = size === 'sm' ? 'h-9' : 'h-10'
  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={`relative inline-flex ${h} items-center rounded-full border border-ivory/25 bg-ink/50 p-1 ${className}`}
    >
      <span
        aria-hidden
        className="absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-ivory transition-transform duration-500 [transition-timing-function:var(--ease-soft)]"
        style={{ transform: `translateX(${lang === 'es' ? '0%' : '100%'})`, left: 4 }}
      />
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          lang={o.id}
          aria-pressed={lang === o.id}
          aria-label={o.label}
          title={o.label}
          onClick={() => setLang(o.id)}
          className={`relative z-10 flex h-full min-w-[2.6rem] items-center justify-center rounded-full px-2.5 text-[0.66rem] font-bold tracking-[0.18em] transition-colors duration-500 ${
            lang === o.id ? 'text-ink' : 'text-ivory/75 hover:text-ivory'
          }`}
        >
          {o.short}
        </button>
      ))}
    </div>
  )
}
