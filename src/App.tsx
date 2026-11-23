import { useEffect, useLayoutEffect, useRef } from 'react'
import { IntroProvider, useIntro } from './context/IntroContext'
import { LangProvider, useLang } from './i18n/LangContext'
import { CinematicIntro } from './components/CinematicIntro'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MobileDock } from './components/MobileDock'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { Signature } from './sections/Signature'
import { MenuSection } from './sections/MenuSection'
import { Experience } from './sections/Experience'
import { Reservations } from './sections/Reservations'
import { PrivateEvents } from './sections/PrivateEvents'
import { Catering } from './sections/Catering'
import { Services } from './sections/Services'
import { Visit } from './sections/Visit'
import { Manifesto } from './sections/Manifesto'
import { FlavorOrbit } from './sections/FlavorOrbit'
import { Stamp } from './sections/Stamp'
import { restaurant } from './data/restaurant'
import { initSmoothScroll, scrollToTarget } from './lib/smoothScroll'
import { ScrollTrigger } from './lib/gsap'

function Site() {
  const { playing, revealed } = useIntro()
  const { lang, t } = useLang()

  // Switching language remounts <main> (scroll scenes re-measure their new text).
  // Keep the visitor on the same section while that happens.
  const scrollBefore = useRef(0)
  const firstLang = useRef(true)
  if (typeof window !== 'undefined') scrollBefore.current = window.scrollY
  useLayoutEffect(() => {
    if (firstLang.current) {
      firstLang.current = false
      return
    }
    const y = scrollBefore.current
    window.dispatchEvent(new Event('mcb:hold-header'))
    ScrollTrigger.refresh()
    window.scrollTo(0, y)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      window.scrollTo(0, y)
    })
  }, [lang])

  useEffect(() => {
    initSmoothScroll()
    // Recalculate pinned sections once fonts and images settle.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Deep links (#menu, #reserve…) work once the homepage is revealed.
  useEffect(() => {
    if (!revealed || !location.hash) return
    const t = window.setTimeout(() => scrollToTarget(location.hash, { immediate: true }), 60)
    return () => window.clearTimeout(t)
  }, [revealed])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brass focus:px-5 focus:py-3 focus:text-ink"
      >
        {t('Skip to content')}
      </a>
      {playing && <CinematicIntro />}
      <Header />
      <main key={lang} id="main" aria-hidden={playing && !revealed ? true : undefined}>
        <Hero />
        <Marquee words={[...restaurant.homepageHighlights, 'Cachapas']} />
        <Story />
        <Manifesto />
        <FlavorOrbit />
        <Signature />
        <MenuSection />
        <Experience />
        <Reservations />
        <PrivateEvents />
        <Catering />
        <Services />
        <Stamp />
        <Visit />
      </main>
      <Footer />
      <MobileDock />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <IntroProvider>
        <Site />
      </IntroProvider>
    </LangProvider>
  )
}
