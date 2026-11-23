import { createElement, Fragment, type ElementType, type ReactNode } from 'react'

interface Props {
  /** Lines of text. Each string is one visual line on wide screens; words wrap naturally on small screens. */
  lines: (string | { text: string; accent?: boolean })[]
  as?: ElementType
  className?: string
  id?: string
  children?: ReactNode
}

/**
 * Renders a heading as masked words (`.sw-word > .sw-inner`) so GSAP can
 * slide each word up from behind its mask. Screen readers get the plain text.
 */
export function SplitWords({ lines, as = 'h2', className, id }: Props) {
  const plain = lines.map((l) => (typeof l === 'string' ? l : l.text)).join(' ')
  return createElement(
    as,
    { className, id, 'aria-label': plain },
    lines.map((line, li) => {
      const { text, accent } = typeof line === 'string' ? { text: line, accent: false } : line
      const words = text.split(' ')
      return (
        <span key={li} className="block" aria-hidden="true">
          {words.map((w, wi) => (
            <Fragment key={wi}>
              <span className="sw-word">
                <span className={`sw-inner ${accent ? 'italic-accent' : ''}`}>{w}</span>
              </span>
              {wi < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </span>
      )
    }),
  )
}
