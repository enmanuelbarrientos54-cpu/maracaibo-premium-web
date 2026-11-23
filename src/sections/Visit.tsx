import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { Eyebrow, LinkButton } from '../components/ui'
import { links, restaurant } from '../data/restaurant'
import { useLang } from '../i18n/LangContext'

export function Visit() {
  const { t } = useLang()
  const [mapOn, setMapOn] = useState(false)
  return (
    <section id="visit" aria-labelledby="visit-title" className="relative bg-ink py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow index="08">{t('Visit')}</Eyebrow>
          <SplitWords id="visit-title" className="display-lg mt-8 text-ivory" lines={[t('Find us on'), { text: 'Kennedy Blvd.', accent: true }]} />

          <address data-fade className="mt-10 not-italic">
            <p className="font-display text-2xl font-light leading-snug text-ivory md:text-3xl">
              {restaurant.address.line1}
              <br />
              {restaurant.address.line2}
            </p>
          </address>

          <dl data-fade className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-brass">{t('Hours')}</dt>
              {restaurant.hours.map((h) => (
                <dd key={h.days} className="mt-3 text-sm leading-relaxed text-cream/85">
                  <span className="block text-sand">{t(h.days)}</span>
                  {t(h.time)}
                </dd>
              ))}
            </div>
            <div>
              <dt className="eyebrow text-brass">{t('Contact')}</dt>
              <dd className="mt-3">
                <a href={restaurant.phone.href} className="link-underline font-display text-xl text-ivory">
                  {restaurant.phone.display}
                </a>
              </dd>
              <dd className="mt-3">
                <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-cream/85">
                  Instagram @maracaibonj ↗
                </a>
              </dd>
              <dd className="mt-2">
                <a href={links.contact} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-cream/85">
                  {t('Contact page')} ↗
                </a>
              </dd>
            </div>
          </dl>

          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <LinkButton href={links.directions} external>
              {t('Get Directions')}
            </LinkButton>
            <a href={restaurant.phone.href} className="btn btn-ghost">
              <span>{t('Call Now')}</span>
            </a>
          </div>
        </Reveal>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2px] border border-ivory/10 lg:col-span-7 lg:min-h-full">
          {mapOn ? (
            <iframe
              title={t("Map showing Maracaibo at 1218 John F. Kennedy Blvd, Union City, NJ")}
              src={links.mapEmbed}
              className="absolute inset-0 h-full w-full [filter:grayscale(0.6)_invert(0.9)_hue-rotate(180deg)_contrast(0.9)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="absolute inset-0">
              <img src="/images/concept-facade.webp" alt="" loading="lazy" className="h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                <p className="font-display text-3xl font-light text-ivory">{t('Union City, New Jersey')}</p>
                <button type="button" onClick={() => setMapOn(true)} className="btn btn-ghost">
                  <span>{t('Load interactive map')}</span>
                </button>
                <p className="max-w-xs text-xs text-sand">{t('Loads Google Maps. Nothing is loaded from Google until you ask.')}</p>
              </div>
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/70 backdrop-blur">
                {t('Concept still · AI-rendered')}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
