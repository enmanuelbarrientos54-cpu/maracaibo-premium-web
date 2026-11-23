/**
 * INTRO FILM — two independent videos.
 *
 *  - `landscape`: the horizontal film for desktops, laptops and for phones or
 *    tablets held sideways. Variants are chosen by screen size.
 *  - `portrait`: the vertical film for phones and tablets held upright.
 *
 * Today the portrait film is the ORIGINAL Higgsfield film reframed for 9:16
 * (a keyframed crop of the 4K master that follows the entrance, the stairs,
 * the arch and the reception sign — see README › "Encuadre móvil").
 *
 * To switch to a dedicated vertical render later: export it at 1080×1920
 * (H.264, ~6–8 Mbps, no audio, "fast start") and replace
 * `public/video/intro-portrait.mp4` + its poster, or point `src` below at the
 * new file and set `kind: 'native'`. No other code changes are needed.
 */

export interface IntroVariant {
  src: string
  poster: string
  width: number
  height: number
}

export const introMedia = {
  landscape: {
    /** 2K / 4K / Retina desktop screens */
    uhd: { src: '/video/intro-1440.mp4', poster: '/video/intro-poster.jpg', width: 2560, height: 1440 },
    /** Full HD desktops and laptops, landscape phones/tablets */
    hd: { src: '/video/intro-1080.mp4', poster: '/video/intro-poster.jpg', width: 1920, height: 1080 },
    /** Data Saver / 2G */
    lite: { src: '/video/intro-720.mp4', poster: '/video/intro-poster.jpg', width: 1280, height: 720 },
  },
  portrait: {
    kind: 'reframed-from-landscape' as 'reframed-from-landscape' | 'native',
    hd: { src: '/video/intro-portrait.mp4', poster: '/video/intro-poster-portrait.jpg', width: 1080, height: 1920 },
    lite: { src: '/video/intro-portrait-lite.mp4', poster: '/video/intro-poster-portrait.jpg', width: 720, height: 1280 },
  },
} satisfies Record<string, unknown>

type NetInfo = { saveData?: boolean; effectiveType?: string }

/**
 * Chooses the film by DEVICE and ORIENTATION, never by window size, so a
 * narrow desktop window still gets the horizontal film.
 */
export function pickIntroVariant(): IntroVariant {
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection
  const lite = !!conn?.saveData || /^(slow-)?2g$/.test(conn?.effectiveType ?? '')
  const touch = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-pointer: fine)').matches
  const upright = window.matchMedia('(orientation: portrait)').matches
  const screenPx = Math.max(window.screen.width, window.screen.height) * (window.devicePixelRatio || 1)

  if (touch && upright) return lite ? introMedia.portrait.lite : introMedia.portrait.hd
  if (lite) return introMedia.landscape.lite
  if (!touch && screenPx >= 2200) return introMedia.landscape.uhd
  return introMedia.landscape.hd
}
