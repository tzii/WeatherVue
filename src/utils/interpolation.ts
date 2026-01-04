/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t
}

/**
 * Inverse linear interpolation
 * Returns a value between 0 and 1 representing where v lies between a and b
 */
export const invLerp = (a: number, b: number, v: number): number => {
  return (v - a) / (b - a)
}

/**
 * Remap a value from one range to another
 */
export const remap = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const t = invLerp(inMin, inMax, v)
  return lerp(outMin, outMax, t)
}

/**
 * Smooth step interpolation
 */
export const smoothStep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}
