/**
 * MACAW FILM — the cinematic surprise near the end of the page.
 * A blue-and-yellow macaw flies over the Maracaibo bridge, lands on a cachapa,
 * takes it and flies off into the sunset (Higgsfield render, AI-generated).
 *
 * Two independent films, like the intro:
 *  - `landscape`: desktops, laptops and devices held sideways (1920×1080).
 *  - `portrait`: phones/tablets held upright. Today it is the original film
 *    reframed for 9:16 (keyframed crop following the macaw and the cachapa,
 *    keeping the bridge in shot at the start and the end). To use a native
 *    vertical render, export 1080×1920 and replace the files below.
 *
 * Encoding for scroll control: H.264, keyframe every 6 frames, no B-frames,
 * so the browser can seek to any moment instantly (see README).
 */
import type { IntroVariant } from './introMedia'

export interface MacawVariant extends IntroVariant {
  /** Final frame (held at the end of the film). */
  end: string
  /** Key moment (the macaw on the cachapa), shown to reduced-motion visitors. */
  still: string
}

export const macawMedia = {
  duration: 10.04,
  /** 'scroll' = the visitor drives the film with the scroll; 'autoplay' = it plays once when in view. */
  mode: 'scroll' as 'scroll' | 'autoplay',
  landscape: {
    src: '/video/macaw-1080.mp4',
    poster: '/video/macaw-poster.jpg',
    end: '/video/macaw-end.jpg',
    still: '/video/macaw-still.jpg',
    width: 1920,
    height: 1080,
  },
  portrait: {
    kind: 'reframed-from-landscape' as 'reframed-from-landscape' | 'native',
    src: '/video/macaw-portrait.mp4',
    poster: '/video/macaw-poster-portrait.jpg',
    end: '/video/macaw-end-portrait.jpg',
    still: '/video/macaw-still-portrait.jpg',
    width: 1080,
    height: 1920,
  },
} satisfies Record<string, unknown>

export function pickMacawVariant(): MacawVariant {
  const touch = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-pointer: fine)').matches
  const upright = window.matchMedia('(orientation: portrait)').matches
  return touch && upright ? macawMedia.portrait : macawMedia.landscape
}
