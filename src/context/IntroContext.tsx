import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface IntroState {
  /** True once the homepage may animate in (intro is wiping away, or was never shown). */
  revealed: boolean
  /** True while the intro overlay is mounted. */
  playing: boolean
  /** Called by the intro when its final wipe begins. */
  reveal: () => void
  /** Called by the intro once the wipe has completed — unmounts the overlay. */
  finish: () => void
  /** Plays the film again (footer “Watch the film”). */
  replay: () => void
}

const IntroContext = createContext<IntroState | null>(null)
const KEY = 'mcb:intro-seen'

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage unavailable (private mode) — the intro may replay, which is acceptable */
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const initialPlay = document.documentElement.getAttribute('data-intro') === 'play'
  const [playing, setPlaying] = useState(initialPlay)
  const [revealed, setRevealed] = useState(!initialPlay)

  const reveal = useCallback(() => {
    markIntroSeen()
    setRevealed(true)
  }, [])

  const finish = useCallback(() => {
    markIntroSeen()
    document.documentElement.setAttribute('data-intro', 'done')
    setRevealed(true)
    setPlaying(false)
  }, [])

  const replay = useCallback(() => {
    window.scrollTo(0, 0)
    document.documentElement.setAttribute('data-intro', 'play')
    setRevealed(false)
    setPlaying(true)
  }, [])

  const value = useMemo(
    () => ({ revealed, playing, reveal, finish, replay }),
    [revealed, playing, reveal, finish, replay],
  )
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used inside IntroProvider')
  return ctx
}
