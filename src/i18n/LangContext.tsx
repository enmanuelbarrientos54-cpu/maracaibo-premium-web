import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { es } from './es'

export type Lang = 'en' | 'es'
const KEY = 'mcb:lang'

interface LangState {
  lang: Lang
  setLang: (l: Lang) => void
  /** Translate an English source string. Falls back to English when no translation exists. */
  t: (en: string) => string
}

const Ctx = createContext<LangState | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* storage blocked */
  }
  const q = new URLSearchParams(location.search).get('lang')
  if (q === 'en' || q === 'es') return q
  return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(KEY, l)
    } catch {
      /* storage blocked: choice lasts for this visit */
    }
    setLangState(l)
  }, [])

  const t = useCallback(
    (en: string) => {
      if (lang === 'en') return en
      const hit = es[en]
      if (hit === undefined && import.meta.env.DEV) console.warn('[i18n] missing es:', en)
      return hit ?? en
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useLang must be used inside LangProvider')
  return c
}
