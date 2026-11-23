import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { ParallaxImage } from '../components/ParallaxImage'
import { Eyebrow, LinkButton, StatusTag } from '../components/ui'
import { links, officialCopy } from '../data/restaurant'

const occasions = [
  { title: 'Personal celebrations', text: 'Birthdays, anniversaries and family gatherings in an intimate, dedicated room.' },
  { title: 'Business meetings', text: 'A private space for confidential conversations, away from the dining room.' },
  { title: 'Catered gatherings', text: 'Maracaibo’s kitchen, delivered or ready for pick-up for your own venue.' },
]

export function PrivateEvents() {
  return (
    <section id="events" aria-labelledby="events-title" className="relative overflow-hidden bg-jungle py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-20 h-[38rem] w-[38rem] rounded-full bg-fern/25 blur-[120px]" />
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow index="05">Private Events</Eyebrow>
            <SplitWords
              id="events-title"
              className="display-lg mt-8 text-ivory"
              lines={['Celebrate', { text: 'together.', accent: true }]}
            />
            <blockquote data-fade className="mt-10 max-w-xl border-l border-brass/50 pl-6 font-display text-xl font-light italic leading-relaxed text-cream/90 md:text-2xl">
              “{officialCopy.privateRoom}”
            </blockquote>
            <p data-fade className="mt-4 pl-6 text-[0.62rem] uppercase tracking-[0.22em] text-sand">
              From maracaibonj.com/private-events
            </p>
          </Reveal>
          <div className="lg:col-span-6">
            <ParallaxImage
              src="/images/reception.webp"
              alt="The reception at Maracaibo, with brass lanterns and the illuminated name."
              className="aspect-[4/3] rounded-[2px]"
              amount={14}
            />
          </div>
        </div>

        <Reveal as="div" className="mt-20 grid gap-px overflow-hidden rounded-[2px] border border-ivory/10 bg-ivory/10 md:grid-cols-3">
          {occasions.map((o, i) => (
            <div key={o.title} data-fade className="group bg-jungle p-8 transition-colors duration-700 hover:bg-[#1a2a20] md:p-10">
              <span className="font-display text-sm text-brass">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-10 font-display text-3xl font-light text-ivory">{o.title}</h3>
              <p className="mt-4 leading-relaxed text-sand">{o.text}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h3 data-fade className="display-md text-ivory">
              Plan your event <span className="italic-accent">with us.</span>
            </h3>
            <p data-fade className="mt-6 max-w-md leading-relaxed text-cream/80">
              Room details, menus and availability are handled directly by the Maracaibo team through the official
              private events page.
            </p>
            <div data-fade className="mt-10 flex flex-wrap gap-3">
              <LinkButton href={links.privateEvents} external>
                Inquire About Private Events
              </LinkButton>
              <LinkButton href={links.events} external variant="ghost">
                Events &amp; Private Dining
              </LinkButton>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <DemoInquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Presentation-only form. It is intentionally not connected to any backend
 * and never transmits data. Wire it to the restaurant's inbox/CRM after
 * approval (see README › "Going live").
 */
function DemoInquiryForm() {
  const [notice, setNotice] = useState(false)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setNotice(true)
      }}
      className="relative rounded-[2px] border border-ivory/10 bg-ink/30 p-6 backdrop-blur md:p-10"
      aria-describedby="demo-form-note"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow text-brass">Event inquiry</p>
        <StatusTag tone="mute">Demo form · not connected</StatusTag>
      </div>
      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <Field label="Full name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
        <Field label="Preferred date" name="date" type="date" />
        <Field label="Number of guests" name="guests" type="number" inputMode="numeric" min={1} />
        <label className="block">
          <span className="eyebrow text-sand">Occasion</span>
          <select
            name="occasion"
            defaultValue=""
            className="mt-3 w-full appearance-none border-b border-ivory/20 bg-transparent py-3 text-ivory focus:border-brass focus:outline-none"
          >
            <option value="" disabled className="bg-espresso">
              Select…
            </option>
            {occasions.map((o) => (
              <option key={o.title} className="bg-espresso">
                {o.title}
              </option>
            ))}
            <option className="bg-espresso">Other</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="eyebrow text-sand">Tell us about your event</span>
          <textarea
            name="message"
            rows={3}
            className="mt-3 w-full resize-none border-b border-ivory/20 bg-transparent py-3 text-ivory focus:border-brass focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="demo-form-note" className="max-w-sm text-xs leading-relaxed text-sand">
          Design preview only — this form does not send or store anything. Use the official private events page to
          contact the restaurant.
        </p>
        <button type="submit" className="btn btn-ghost shrink-0">
          <span>Preview submit</span>
        </button>
      </div>
      {notice && (
        <p role="status" className="mt-6 rounded-[2px] border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-cream">
          Demo mode: nothing was sent. To reach Maracaibo, use{' '}
          <a href={links.privateEvents} target="_blank" rel="noopener noreferrer" className="underline decoration-brass underline-offset-4">
            the official private events page ↗
          </a>{' '}
          or call (201) 300-4445.
        </p>
      )}
    </form>
  )
}

function Field({ label, ...input }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-sand">{label}</span>
      <input
        {...input}
        className="mt-3 w-full border-b border-ivory/20 bg-transparent py-3 text-ivory [color-scheme:dark] placeholder:text-mute focus:border-brass focus:outline-none"
      />
    </label>
  )
}
