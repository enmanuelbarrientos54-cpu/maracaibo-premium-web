import { restaurant } from '../data/restaurant'

/**
 * Today's opening hours in the restaurant's timezone (America/New_York),
 * derived from the official hours. Holidays/special closures are not known,
 * so the UI only ever shows the regular schedule.
 */
export function todaysHours() {
  let weekday = new Date().getDay()
  try {
    const name = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(new Date())
    weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(name)
  } catch {
    /* fall back to local day */
  }
  const weekend = weekday === 5 || weekday === 6
  return weekend ? restaurant.hours[1] : restaurant.hours[0]
}
