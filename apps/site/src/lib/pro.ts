/**
 * The custom-packs page.
 *
 * Settled 2026-11-02 (01-Planning/specs/10-settled-position.md §3):
 * everything in the repository is free and MIT, permanently — the library,
 * all nine packs, the API. Nothing is ever locked.
 *
 * So this page is not a pricing page. There are no tiers, no prices and no
 * checkout. It makes one offer — a pack drawn in your own brand — and gives
 * one way to ask about it. What the inbox says then is the research.
 */

/**
 * Where the contact CTA points.
 *
 * Product-scoped rather than `inquiries@hearvie.dev`, so Mote enquiries stay
 * separable from everything else on the domain. Needs Cloudflare Email
 * Routing switched on for hearvie.dev before it actually delivers.
 */
export const CONTACT = {
  label: 'Get in touch',
  href: 'mailto:mote@hearvie.dev?subject=Custom%20Mote%20pack',
};

export interface ScopeCard {
  name: string;
  heading: string;
  note: string;
  summary: string;
  includes: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

/**
 * The honest division: not free-versus-paid, but *exists* versus
 * *does not exist until someone draws it*.
 */
export const SCOPE: ScopeCard[] = [
  {
    name: 'In the repository',
    heading: 'Free',
    note: 'MIT, permanently',
    summary:
      'Every line of it. Nine packs, every binding, the renderer. No tier above this one.',
    includes: [
      'The engine — deterministic layout, seven motion behaviours, collision, accessibility',
      'React, Vue, Svelte and the web component',
      'All nine packs — 137 shapes, each with its own palette and typeface',
      'Window frames and media particles — photos, GIFs and video that float',
      'The MCP server and agent skill',
      'The render API, source included, for OG cards and anywhere without JavaScript',
      'Forking, self-hosting and commercial use',
    ],
    cta: { label: 'Read the docs', href: '/docs.html' },
  },
  {
    name: 'Not in the repository',
    heading: 'Drawn',
    note: 'Commissioned, per pack',
    summary:
      'A pack in your own brand. It is not behind a paywall — it does not exist until a designer draws it.',
    includes: [
      '~15 shapes from the vocabulary of your product, not a generic domain',
      'Your palette as named themes, your display typeface',
      'A curated set of base primitives, so fields read as composed rather than literal',
      'Shipped as a normal package you own — no licence key, nothing phoning home',
      'Yours to publish openly if you want to',
    ],
    cta: CONTACT,
    featured: true,
  },
];

/** What commissioning actually involves. Four steps, no sales funnel. */
export const PROCESS: Array<{ step: string; title: string; body: string }> = [
  {
    step: '01',
    title: 'Tell me what the field should feel like',
    body:
      'A link to the product, the palette, and the handful of objects that mean something in your world. The nine existing packs are the reference for scope — around fifteen shapes each.',
  },
  {
    step: '02',
    title: 'A quote, before anything is drawn',
    body:
      'One figure and a turnaround, from the designer who drew the nine. No retainer, no subscription, no per-seat anything. If it is not worth it, nothing has been spent.',
  },
  {
    step: '03',
    title: 'The pack gets drawn and validated',
    body:
      'Every shape passes validatePack() — a single root SVG, no fixed sizes, currentColor only — so it behaves identically to the packs shipped here under every motion preset.',
  },
  {
    step: '04',
    title: 'You get a package, not access',
    body:
      'Installable, versioned, and pinned to the determinism contract: the same seed gives the same field forever. Keep it private or open it up — it is your artwork.',
  },
];

export const PRINCIPLES: Array<{ title: string; body: string }> = [
  {
    title: 'Nothing in the library is ever locked.',
    body:
      'Not the engine, not the nine packs, not the render API. An earlier draft of this page proposed putting eight packs behind a payment. That was abandoned, and this is the replacement.',
  },
  {
    title: 'Because a package cannot be gated anyway.',
    body:
      'If code ships to your machine, you have it, and a licence check inside a library is a few minutes of work to delete. Navii — the project Mote is modelled on — keeps the packs its docs call Pro in its open repository, for exactly this reason.',
  },
  {
    title: 'You would be paying for drawing time.',
    body:
      'The code is finished and free. Each pack is a designer working for days, and that cost does not go away however good the engine gets. It is the only honest thing to charge for.',
  },
  {
    title: 'No price is published, deliberately.',
    body:
      'Mote has no users yet, so any number on this page would be a guess about people who do not exist. A few real conversations will settle it better than any amount of reasoning.',
  },
];

export const QUESTIONS: Array<{ q: string; a: string }> = [
  {
    q: 'Is anything paywalled?',
    a: 'No, and nothing is planned to be. Everything in the repository is MIT: the engine, all nine packs, the frames, the bindings, the render API. If you never get in touch you are not missing a feature.',
  },
  {
    q: 'Then what am I paying for?',
    a: 'Illustration work that does not exist yet. A custom pack is a designer drawing around fifteen shapes in your brand — the one part of this project that cannot be made faster by writing more code.',
  },
  {
    q: 'Why is there no price here?',
    a: 'Because it would be invented. Scope varies enormously between a fintech pack and a games pack, and with zero users there is no evidence for a number. Ask and you get a real quote before anything starts.',
  },
  {
    q: 'Could I just draw my own pack?',
    a: 'Yes, and that is the better answer for most people. A pack is a plain array of SVG shapes with a palette; the authoring guide in the docs is the whole specification, and validatePack() tells you when it is right.',
  },
  {
    q: 'Do I own the pack afterwards?',
    a: 'Yes. It ships as a normal package with no licence check, no key in your bundle and no telemetry. Keep it private to your product, or publish it openly — including back into the Mote ecosystem if you want to.',
  },
  {
    q: 'What about the hosted render API?',
    a: 'Free and open, same as everything else. It is a thin wrapper around a function that is already in the library, it runs on a $5 server, and the source is in the repository. Paying someone to run it for you was considered and rejected — it is not worth charging for.',
  },
];
