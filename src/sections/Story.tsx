import { Reveal } from '../components/Reveal'
import { SplitWords } from '../components/SplitWords'
import { ParallaxImage } from '../components/ParallaxImage'
import { Eyebrow } from '../components/ui'
import { links, officialCopy } from '../data/restaurant'

export function Story() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden py-24 md:py-40">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6 lg:pt-10">
          <Eyebrow index="01">Our Story</Eyebrow>
          <SplitWords
            id="story-title"
            className="display-lg mt-8 text-ivory"
            lines={['Born from a love', 'of Venezuelan', { text: 'cooking.', accent: true }]}
          />
          <p data-fade className="mt-10 max-w-lg text-lg leading-relaxed text-cream/85">
            {officialCopy.story}
          </p>
          <p data-fade className="mt-5 max-w-lg leading-relaxed text-sand">
            The kitchen moves between classic Venezuelan recipes and Venezuelan &amp; Caribbean fusion — from crispy
            arepas and savory tequeños to sweet patacón creations and traditional mandocas.
          </p>
          <a
            data-fade
            href={links.about}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-10 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brass"
          >
            Read more on the official site <span aria-hidden>↗</span>
          </a>
        </Reveal>

        <div className="relative lg:col-span-6">
          <ParallaxImage
            src="/images/dining-room-bar.webp"
            alt="The dining room at Maracaibo: brown leather chairs, white tables and a backlit bar with a gold leaf-patterned wall."
            className="aspect-[4/5] rounded-[2px] md:aspect-[5/6]"
            amount={14}
          />
          <ParallaxImage
            src="/images/reception-640.webp"
            alt="Brass lantern and lattice detail at the reception."
            className="absolute -bottom-10 -left-4 hidden aspect-square w-[42%] rounded-[2px] border-[6px] border-ink shadow-2xl shadow-black/60 md:block lg:-left-16"
            amount={20}
          />
        </div>
      </div>
    </section>
  )
}
