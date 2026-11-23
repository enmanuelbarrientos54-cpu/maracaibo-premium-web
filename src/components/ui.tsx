import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useLang } from '../i18n/LangContext'

type Variant = 'solid' | 'ghost' | 'dark'

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  external?: boolean
  arrow?: string
  children: ReactNode
}

/** Pill button rendered as a link. External links open in a new tab with rel safety. */
export function LinkButton({ variant = 'solid', external, arrow = '→', className = '', children, ...rest }: LinkButtonProps) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const { t } = useLang()
  return (
    <a className={`btn btn-${variant} ${className}`} {...ext} {...rest}>
      <span>{children}</span>
      <span aria-hidden className="btn-arrow">
        {external ? '↗' : arrow}
      </span>
      {external && <span className="sr-only"> {t('(opens in a new tab)')}</span>}
    </a>
  )
}

export function Eyebrow({ children, className = '', index }: { children: ReactNode; className?: string; index?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-4 text-brass ${className}`} data-fade>
      {index && <span className="font-display text-[0.8rem] tracking-normal text-brass/70">{index}</span>}
      <span className="inline-block h-px w-10 bg-brass/60" />
      <span>{children}</span>
    </p>
  )
}

/** Small honest label used for demo-only or pending items. */
export function StatusTag({ children, tone = 'brass' }: { children: ReactNode; tone?: 'brass' | 'mute' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] ${
        tone === 'brass' ? 'border-brass/40 text-brass' : 'border-ivory/20 text-sand'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'brass' ? 'bg-brass' : 'bg-sand/70'}`} />
      {children}
    </span>
  )
}
