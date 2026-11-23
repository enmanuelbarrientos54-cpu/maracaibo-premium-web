import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { Eyebrow } from '../components/ui'
import { links, officialCopy } from '../data/restaurant'

const cards = [
  {
    kicker: 'Gift Cards',
    title: 'Give a taste of Venezuela.',
    text: officialCopy.giftCards,
    cta: 'Buy a gift card',
    href: links.giftCards,
  },
  {
    kicker: 'Events & Music',
    title: 'What’s happening at Maracaibo.',
    text: 'Current events and announcements are published on the official events page — check there for the latest dates.',
    cta: 'See events',
    href: links.events,
  },
  {
    kicker: 'Careers',
    title: 'Join our team.',
    text: officialCopy.careers,
    cta: 'Apply now',
    href: links.careers,
  },
]

export function Services() {
  return (
    <section id="more" aria-labelledby="more-title" className="relative bg-espresso py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow index="07">More from Maracaibo</Eyebrow>
            <SplitWords id="more-title" className="display-md mt-6 text-ivory" lines={['Gifts, events', { text: '& careers.', accent: true }]} />
          </div>
          <p data-fade className="max-w-sm text-sm leading-relaxed text-sand">
            Each of these runs on the restaurant’s official systems — links open the live pages.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.kicker}
              data-fade
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[2px] border border-ivory/10 bg-cocoa/50 p-8 transition-colors duration-700 hover:border-brass/50 md:p-10"
            >
              <span className="lattice absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
              <span className="relative eyebrow text-brass">{c.kicker}</span>
              <span className="relative mt-8 font-display text-[1.9rem] font-light leading-[1.08] text-ivory">{c.title}</span>
              <span className="relative mt-5 text-sm leading-relaxed text-sand">{c.text}</span>
              <span className="relative mt-auto flex items-center justify-between border-t border-ivory/10 pt-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory">
                {c.cta}
                <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/20 transition-[background-color,color,border-color,transform] duration-500 group-hover:rotate-45 group-hover:border-brass group-hover:bg-brass group-hover:text-ink" aria-hidden>
                  ↗
                </span>
              </span>
              <span className="sr-only"> (opens the official site in a new tab)</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
