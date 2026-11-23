import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { ParallaxImage } from '../components/ParallaxImage'
import { Eyebrow, LinkButton } from '../components/ui'
import { links, officialCopy, restaurant } from '../data/restaurant'
import { formatPrice, menuItems } from '../data/menu'
import { useLang } from '../i18n/LangContext'

export function Catering() {
  const { t } = useLang()
  const cateringItems = menuItems.filter((i) => i.group === 'catering')
  return (
    <section id="catering" aria-labelledby="catering-title" className="relative bg-ink py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <ParallaxImage
            src="/images/signature-platter.webp"
            alt={t("A shared platter on a wooden board, ready for the table.")}
            className="aspect-[5/4] rounded-[2px]"
            amount={8}
          />
        </div>
        <Reveal className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <Eyebrow index="06">{t('Catering')}</Eyebrow>
          <SplitWords
            id="catering-title"
            className="display-lg mt-8 text-ivory"
            lines={[t('Maracaibo,'), { text: t('wherever'), accent: true }, t('you gather.')]}
          />
          <p data-fade className="mt-8 leading-relaxed text-cream/80">
            {t(officialCopy.catering)} {t('Bring Venezuelan favorites to the office, the family table or the party.')}
          </p>

          {cateringItems.length > 0 && (
            <ul data-fade className="mt-10 divide-y divide-ivory/10 border-y border-ivory/10">
              {cateringItems.map((i) => (
                <li key={i.id} className="flex items-baseline justify-between gap-6 py-4">
                  <a href={i.source} target="_blank" rel="noopener noreferrer" className="link-underline font-display text-xl text-ivory">
                    {i.name}
                  </a>
                  <span className="font-display text-xl text-brass">{formatPrice(i.price) ?? t('See menu')}</span>
                </li>
              ))}
              <li className="py-4 text-xs uppercase tracking-[0.2em] text-sand">{t('More trays on the official catering menus')}</li>
            </ul>
          )}

          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <LinkButton href={links.catering} external>
              {t('Catering Menus')}
            </LinkButton>
            <a href={restaurant.phone.href} className="btn btn-ghost">
              <span>{t('Call to Plan')}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
