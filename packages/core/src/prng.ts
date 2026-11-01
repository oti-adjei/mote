/**
 * Seeded pseudo-randomness.
 *
 * Determinism is a public contract: a given (seed, options, packVersion) must
 * produce byte-identical frame-0 output forever. Everything here is therefore
 * frozen behaviour — changing a constant is a major version bump.
 *
 * `cyrb53` hashes string seeds; `sfc32` is the generator. Both are chosen for
 * being tiny, fast, well-distributed and trivially portable to other
 * languages, so a future server or Flutter renderer can agree on layout.
 */

/** 53-bit string hash. Stable across engines — no float arithmetic. */
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/** Normalises a user-supplied seed to a uint32. */
export function normaliseSeed(seed: number | string | undefined): number {
  if (seed === undefined) return 1;
  if (typeof seed === 'number') {
    // Fold non-integers and negatives into a stable uint32.
    return Number.isSafeInteger(seed) && seed >= 0
      ? seed >>> 0
      : cyrb53(String(seed)) >>> 0;
  }
  return cyrb53(seed) >>> 0;
}

export type Rng = () => number;

/**
 * sfc32 — 128-bit state, uniform output in [0, 1).
 *
 * The four state words are derived from one seed via cyrb53 so that adjacent
 * integer seeds (1, 2, 3 …) produce wholly unrelated streams. Seeding all
 * words from the raw integer would make seed 1 and seed 2 look similar, which
 * is exactly what a user shuffling seeds in the playground would notice.
 */
export function rng(seed: number | string): Rng {
  const s = normaliseSeed(seed);
  let a = (cyrb53('a', s) ^ 0x9e3779b9) >>> 0;
  let b = (cyrb53('b', s) ^ 0x243f6a88) >>> 0;
  let c = (cyrb53('c', s) ^ 0xb7e15162) >>> 0;
  let d = (s ^ 0x85ebca6b) >>> 0;
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) >>> 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) >>> 0;
    c = ((c << 21) | (c >>> 11)) >>> 0;
    d = (d + 1) >>> 0;
    t = (t + d) >>> 0;
    c = (c + t) >>> 0;
    return (t >>> 0) / 4294967296;
  };
}

/** Uniform float in [min, max). */
export function range(r: Rng, min: number, max: number): number {
  return min + r() * (max - min);
}

/** Uniform integer in [min, max]. */
export function rangeInt(r: Rng, min: number, max: number): number {
  return Math.floor(min + r() * (max - min + 1));
}

export function pick<T>(r: Rng, items: readonly T[]): T {
  if (items.length === 0) throw new Error('mote: pick() on an empty list');
  return items[Math.floor(r() * items.length) % items.length] as T;
}

/**
 * Stratified shuffle of [0, 1) into `n` buckets, one value per bucket, jittered
 * within it, then order-shuffled.
 *
 * Used for `phase`. Plain `r()` per particle clumps badly at low counts, which
 * reads on screen as a synchronised chorus line — the classic failure of this
 * kind of component, and the reason this helper exists rather than a bare
 * random call at each call site.
 */
export function stratified(r: Rng, n: number): number[] {
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = (i + r()) / n;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const tmp = out[i] as number;
    out[i] = out[j] as number;
    out[j] = tmp;
  }
  return out;
}
