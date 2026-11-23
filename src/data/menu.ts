/**
 * MENU DATA — single source of truth for the menu experience.
 *
 * Rules for this file:
 *  - Only items verified on the official domain (maracaibonj.com/items/...)
 *    are listed. Each item keeps its `source` URL.
 *  - `price: null` means the price could not be confirmed. The UI then shows
 *    "See official menu" instead of a number. Never fill in a guess.
 *  - `image: null` means no authorised photo is available yet. The UI renders
 *    an editorial typographic card instead.
 *
 * To import the complete menu later, append items following the same shape.
 * Categories are provisional groupings for this preview and should be
 * replaced with the official category names when the full menu is imported.
 */

export type MenuGroupId = 'del-mar' | 'clasicos' | 'acompanantes' | 'bebidas' | 'catering'

export interface MenuGroup {
  id: MenuGroupId
  label: string
  english: string
  motif: 'wave' | 'corn' | 'plantain' | 'glass' | 'tray'
}

export interface MenuItem {
  id: string
  name: string
  /** English gloss, when the official page provides one. */
  english?: string
  description?: string
  price: number | null
  group: MenuGroupId
  image: string | null
  source: string
  note?: string
}

const ITEM = (slug: string) => `https://www.maracaibonj.com/items/${slug}`

export const menuGroups: MenuGroup[] = [
  { id: 'del-mar', label: 'Del Mar', english: 'From the sea', motif: 'wave' },
  { id: 'clasicos', label: 'Clásicos', english: 'Venezuelan classics', motif: 'corn' },
  { id: 'acompanantes', label: 'Acompañantes', english: 'Sides', motif: 'plantain' },
  { id: 'bebidas', label: 'Bebidas Frías', english: 'Cold drinks', motif: 'glass' },
  { id: 'catering', label: 'Catering', english: 'For the party', motif: 'tray' },
]

export const menuItems: MenuItem[] = [
  {
    id: 'ceviche-vuelve-a-la-vida',
    name: 'Ceviche Vuelve a La Vida',
    description: 'A medley of shrimp, mussels & calamari marinated in a tangy and zesty cocktail sauce.',
    price: 16.95,
    group: 'del-mar',
    image: null,
    source: ITEM('ceviche-vuelve-a-la-vida'),
  },
  {
    id: 'camarones-al-ajillo',
    name: 'Camarones al Ajillo',
    english: 'Garlic shrimp',
    price: null,
    group: 'del-mar',
    image: null,
    source: ITEM('camarones-al-ajillo'),
  },
  {
    id: 'cachapa',
    name: 'Cachapa',
    price: null,
    group: 'clasicos',
    image: null,
    source: ITEM('cachapa'),
  },
  {
    id: 'tajadas-con-queso',
    name: 'Tajadas con Queso',
    description: 'Thinly sliced sweet plantains with cheese.',
    price: null,
    group: 'acompanantes',
    image: null,
    source: ITEM('tajadas-con-queso'),
  },
  {
    id: 'arroz-blanco',
    name: 'Arroz Blanco',
    english: 'White rice',
    price: null,
    group: 'acompanantes',
    image: null,
    source: ITEM('arroz-blanco'),
  },
  {
    id: 'chichas',
    name: 'Chichas',
    english: 'Chicha',
    price: 6.95,
    group: 'bebidas',
    image: null,
    source: ITEM('chichas'),
  },
  {
    id: '12-mini-arepas-queso',
    name: '12 Mini Arepas Queso',
    english: 'Twelve mini cheese arepas',
    price: 30,
    group: 'catering',
    image: null,
    source: ITEM('12-mini-arepas-queso'),
    note: 'Catering item',
  },
]

export function formatPrice(price: number | null) {
  if (price === null) return null
  return `$${price.toFixed(2).replace(/\.00$/, '')}`
}
