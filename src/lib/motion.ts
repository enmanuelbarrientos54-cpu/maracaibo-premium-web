/** Small math helpers shared by the scroll-driven scenes. */
export const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
/** Smoothstep between a and b. */
export const ease = (a: number, b: number, n: number) => {
  const t = clamp01((n - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const mix = (a: number, b: number, t: number) => a + (b - a) * t
