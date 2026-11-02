/**
 * Pro tier content.
 *
 * NOTHING HERE IS DECIDED. The business model is an open question
 * (Linear GEO-217 Q6), so this page states a proposal and says plainly that
 * it is one. It exists to make the shape of the idea concrete and to be
 * argued with — not to take money.
 */

export interface Tier {
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  includes: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export const TIERS: Tier[] = [
  {
    name: 'Open',
    price: 'Free',
    priceNote: 'MIT, forever',
    summary:
      'The whole engine, every framework binding, and the shapes you need to build something real.',
    includes: [
      'The engine — layout, seven motion behaviours, deterministic layout',
      'React, Vue, Svelte and the web component',
      'The base pack — 13 geometric primitives',
      'The esports pack — 16 objects, four themes',
      'Window frames and media particles',
      'The MCP server and agent skill',
      'Self-hosting, forking and commercial use',
    ],
    cta: { label: 'Read the docs', href: '/docs.html' },
  },
  {
    name: 'Pro',
    price: 'TBC',
    priceNote: 'One payment, proposed',
    summary:
      'The eight remaining domain packs — the part that is illustration work rather than code.',
    includes: [
      'Space, Cyber, Health, Education',
      'Devtools, AI, Fintech, Creative',
      '121 further shapes, each with its own palette and typeface',
      'New packs as they are drawn',
      'Everything in Open, unchanged',
    ],
    cta: { label: 'Register interest', href: '/docs.html' },
    featured: true,
  },
];

export const PRINCIPLES: Array<{ title: string; body: string }> = [
  {
    title: 'The engine never gets paywalled.',
    body:
      'Layout, motion, determinism, accessibility, every framework binding — MIT, permanently. A paid tier that holds the engine hostage would make the open version a demo, and a demo is not worth building on.',
  },
  {
    title: 'You pay for drawings, not for code.',
    body:
      'The code took weeks; it is finished and it is free. The 137 shapes took a designer, and every further pack takes another one. That is the part with an ongoing cost, so that is the part with a price.',
  },
  {
    title: 'Buying is not a subscription.',
    body:
      'The proposal is one payment for the packs as they stand plus whatever is drawn later. Nothing stops working if you stop paying — they are npm packages, and you keep the versions you installed.',
  },
  {
    title: 'Nothing phones home.',
    body:
      'There is no licence check at runtime, no key in your bundle, no telemetry. A pack is a file of shapes. Enforcement is the honour system plus the registry, which is how every other paid component library works.',
  },
];

export const QUESTIONS: Array<{ q: string; a: string }> = [
  {
    q: 'Is any of this live?',
    a: 'No. Nothing is on npm, there is no checkout, and no price has been set. This page describes a proposal so it can be judged before it is built.',
  },
  {
    q: 'Why not keep everything free?',
    a: 'It might stay that way. The honest argument for charging is that packs are illustration work with a real ongoing cost, and a project that cannot fund its own artwork stops at nine packs forever. The honest argument against is that nine packs may be plenty, and friction costs more than the revenue is worth.',
  },
  {
    q: 'Where did this idea come from?',
    a: 'Navii, the avatar engine Mote is architecturally modelled on, sells exactly this: an MIT core with premium packs behind a licence. It is the same niche and the same audience, so it is the closest thing to evidence available.',
  },
  {
    q: 'What happens to the packs already built?',
    a: 'They exist and they work. If the free tier stays as it is, the eight domain packs move behind Pro at the first publish — before anyone has installed them, so nothing is taken away from anyone.',
  },
  {
    q: 'Could I buy a single pack?',
    a: 'Possibly. Per-pack pricing is simpler to justify and harder to administer. Undecided, like everything else here.',
  },
];
