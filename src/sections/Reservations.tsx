import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { ParallaxImage } from '../components/ParallaxImage'
import { Eyebrow, LinkButton } from '../components/ui'
import { links, restaurant } from '../data/restaurant'
import { todaysHours } from '../lib/hours'

export function Reservations() {
  const today = todaysHours()
  return (
    <section id="reserve" aria-labelledby="reserve-title" className="relative overflow-hidden bg-cream text-ink">
      <div className="grid lg:min-h-[100svh] lg:grid-cols-2">
        <ParallaxImage
          src="/images/dining-room-bar.webp"
          alt="Maracaibo's dining room set for service, with the backlit bar beyond."
          className="aspect-[4/3] lg:aspect-auto lg:h-full"
          amount={16}
        />

        <Reveal className="flex flex-col justify-center px-[clamp(1.25rem,5vw,5rem)] py-20 lg:py-28">
          <Eyebrow index="04" className="!text-brass-deep">
            Reservations
          </Eyebrow>
          <SplitWords
            id="reserve-title"
            className="display-lg mt-8 text-ink"
            lines={['Your table', { text: 'awaits.', accent: true }]}
          />
          <p data-fade className="mt-8 max-w-md text-lg leading-relaxed text-umber">
            Lunch, dinner or cocktails — book through Maracaibo’s official reservation partner and see live
            availability.
          </p>

          <dl data-fade className="mt-10 max-w-md divide-y divide-ink/10 border-y border-ink/10">
            {restaurant.hours.map((h) => (
              <div key={h.days} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-umber">{h.days}</dt>
                <dd className={`font-display text-lg ${h === today ? 'text-ink' : 'text-umber/80'}`}>
                  {h.time}
                  {h === today && <span className="ml-3 align-middle text-[0.6rem] uppercase tracking-[0.2em] text-brass-deep">Today</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <LinkButton href={links.openTable} external variant="dark">
              Book a Table
            </LinkButton>
            <a href={restaurant.phone.href} className="btn border border-ink/25 text-ink transition-colors hover:border-ink">
              <span>Call {restaurant.phone.display}</span>
            </a>
          </div>
          <p data-fade className="mt-6 max-w-md text-xs leading-relaxed text-umber/80">
            Reservations are handled by OpenTable, the booking partner listed by the restaurant. Availability and
            confirmations are shown there. You can also use the{' '}
            <a href={links.reservationsPage} target="_blank" rel="noopener noreferrer" className="underline decoration-brass-deep underline-offset-4">
              official reservations page ↗
            </a>
            . For large groups, see private events below.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
