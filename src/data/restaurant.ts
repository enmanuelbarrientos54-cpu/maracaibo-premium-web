/**
 * Restaurant facts & official destinations.
 *
 * Every value here was verified against the restaurant's official domain
 * (maracaibonj.com) or its official reservation listing on 2026-11-23.
 * Anything that could NOT be verified is listed in `pendingVerification`
 * instead of being shown on the site.
 */

const OFFICIAL = 'https://www.maracaibonj.com'

export const restaurant = {
  name: 'Maracaibo',
  tagline: 'Venezuelan & Caribbean Cuisine',
  /** Wording based on the official homepage description. */
  concept:
    'Classic Venezuelan dishes and Venezuelan & Caribbean fusion cuisine, made with bold flavors and authentic recipes.',
  /** Homepage lists these as part of the menu. */
  homepageHighlights: ['Arepas', 'Tequeños', 'Patacón', 'Mandocas'],
  address: {
    line1: '1218 John F. Kennedy Blvd',
    line2: 'Union City, NJ 07087',
    full: '1218 John F. Kennedy Blvd, Union City, NJ 07087',
  },
  phone: {
    display: '(201) 300-4445',
    href: 'tel:+12013004445',
  },
  /** Source: official contact page (maracaibonj.com/contact). */
  hours: [
    { days: 'Sunday – Thursday', time: '11:30 am – 10:00 pm' },
    { days: 'Friday – Saturday', time: '11:30 am – 11:00 pm' },
  ],
  hoursSource: `${OFFICIAL}/contact`,
} as const

export const links = {
  official: `${OFFICIAL}/`,
  menu: `${OFFICIAL}/menu`,
  order: `${OFFICIAL}/popmenu-order`,
  reservationsPage: `${OFFICIAL}/reservations`,
  /** Official OpenTable listing for the restaurant (links back to maracaibonj.com). */
  openTable: 'https://www.opentable.com/r/maracaibo-union-city',
  events: `${OFFICIAL}/events`,
  privateEvents: `${OFFICIAL}/private-events`,
  catering: `${OFFICIAL}/catering`,
  giftCards: `${OFFICIAL}/gift-cards`,
  careers: `${OFFICIAL}/join-our-team`,
  contact: `${OFFICIAL}/contact`,
  about: `${OFFICIAL}/about`,
  instagram: 'https://www.instagram.com/maracaibonj/',
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=1218+John+F.+Kennedy+Blvd%2C+Union+City%2C+NJ+07087',
  mapEmbed:
    'https://www.google.com/maps?q=1218+John+F.+Kennedy+Blvd,+Union+City,+NJ+07087&output=embed',
} as const

/** Copy quoted / paraphrased from official pages. */
export const officialCopy = {
  privateRoom:
    'A private room ensures a dedicated space exclusively for you and your guests, allowing you to enjoy the event without external interruptions — ideal for confidential business meetings or an intimate atmosphere for personal celebrations.',
  giftCards:
    'Purchase a physical gift card directly at the restaurant, or send an e-gift card online — delivered instantly or on a scheduled date of your choice.',
  careers: 'Join the team: upload your resume (pdf, doc, docx, jpg, jpeg) through the official careers page.',
  catering: 'Catering is offered for delivery and for pick-up, each with its own official menu.',
  story:
    'Maracaibo was born from a deep love for Venezuelan cooking and the wish to share it with Union City — bringing true Venezuelan flavor to every plate.',
} as const

/**
 * Items requested in the brief that could not be verified from an official
 * source during this build. They are intentionally NOT presented on the site.
 */
export const pendingVerification = [
  'Full official menu (all categories, descriptions and current prices) — maracaibonj.com/menu is protected by a bot challenge.',
  'Parrilla Maracaibo, Maracaibo Sampler, Parrilladas, Pabellón, Tequeños, Patacones, desserts and cocktail list — names, descriptions and prices.',
  'Private event rooms (Turpial / Araguaney) — names and capacities.',
  'VIP program — no official page found.',
  'Upcoming events / live music calendar — none found on official pages.',
  'Live status of online ordering (an indexed copy of /popmenu-order showed “No menus available”).',
  'High-resolution dish photography for menu items.',
] as const
