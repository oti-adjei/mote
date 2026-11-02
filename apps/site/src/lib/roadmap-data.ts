/**
 * Roadmap data.
 *
 * Mirrors `01-Planning/specs/08-roadmap.md` and the Linear project (P-GEO-29),
 * which stay the source of truth. This file is the public-facing copy, so it
 * says only what is true and does not promise dates.
 */

export type Stage = 'shipped' | 'building' | 'next' | 'considering';

export interface RoadmapItem {
  title: string;
  body: string;
  /** Concrete, checkable facts. Numbers where there are numbers. */
  facts?: string[];
  /** Honest caveat — what is NOT done, or deliberately not built. */
  caveat?: string;
}

export interface RoadmapGroup {
  stage: Stage;
  label: string;
  note: string;
  items: RoadmapItem[];
}

export const STAGE_META: Record<Stage, { label: string; dot: string; fg: string }> = {
  shipped: { label: 'Shipped', dot: '#d4ff1e', fg: '#121212' },
  building: { label: 'Building', dot: '#7cc4ff', fg: '#121212' },
  next: { label: 'Next', dot: '#f2f2ee', fg: '#121212' },
  considering: { label: 'Considering', dot: '#6b6b66', fg: '#f2f2ee' },
};

export const UPDATED = '1 November 2026';

export const ROADMAP: RoadmapGroup[] = [
  {
    stage: 'shipped',
    label: 'Shipped',
    note: 'Built, tested and verified in a browser. Not yet published to npm.',
    items: [
      {
        title: 'The engine',
        body:
          'A zero-dependency core. Layout is a pure function of the seed; motion is time applied on top. That split is why a field renders identically on the server and the client.',
        facts: [
          '7 motion presets — static, bob, hop, drift, across, bounce, gravity',
          'One shared animation loop for every field on the page',
          'Pauses offscreen, when the tab is hidden, and under reduced motion',
          '8.4 kB brotlied, enforced in CI',
        ],
      },
      {
        title: 'Nine shape packs · 137 shapes',
        body:
          'Each pack is a domain vocabulary with its own palette, display typeface and curated set of geometric primitives.',
        facts: [
          'esports · space · cyber · health · education',
          'devtools · ai · fintech · creative',
          'Four themes each, weighted so accents stay sparse',
          '~2 kB per pack — install only what you use',
        ],
        caveat: 'creative ships without a curated primitive set; the others all have one.',
      },
      {
        title: 'Window frames and media',
        body:
          'A particle does not have to be a drawn shape. Photos, GIFs and video float in the field exactly like geometry — same layout, same depth, same motion.',
        facts: [
          '13 frame kinds, from browser and app windows to polaroids and tickets',
          'Chrome drops detail rather than shrinking: controls merge into one capsule below 270px',
          'Video never autoplays — playback is a runtime decision, so reduced motion stays on the poster',
        ],
        caveat:
          'Frames are HTML, so the static SVG export cannot include them. Media renders in the browser only.',
      },
      {
        title: 'Five ways to install it',
        body:
          'Consume Mote however you already work — a dependency, vendored source you own, or a single script tag.',
        facts: [
          'React, Vue and Svelte bindings',
          '<floating-field> web component for plain HTML, Astro, Webflow and Framer',
          'shadcn registry — vendored source you can edit',
          'MCP server and agent skill, so coding agents get the API right',
        ],
        caveat: 'No Solid binding. Wrappers are added on demand rather than speculatively.',
      },
      {
        title: 'This playground',
        body:
          'Every prop editable, every pack browsable, and the config lives in the URL — so a link is the whole share mechanism. No accounts, no backend.',
      },
    ],
  },
  {
    stage: 'building',
    label: 'Building',
    note: 'In progress now.',
    items: [
      {
        title: 'Publishing',
        body:
          'Everything is built and nothing is public. The repo lives on one machine; no package is on npm; this site is not yet deployed.',
        facts: [
          'Claim the npm scope',
          'Push the repository',
          'Deploy to mote.hearvie.dev',
          'Publish 0.1.0 with provenance',
        ],
        caveat:
          'Blocked on a licence decision. Everything is free to change until the first publish, and expensive afterwards.',
      },
    ],
  },
  {
    stage: 'next',
    label: 'Next',
    note: 'Decided, not started.',
    items: [
      {
        title: 'Proof on a real site',
        body:
          'Mote exists because an esports publication needed shapes behind its hero. Using it there is the only honest validation the project has — everything else is self-assessment.',
        caveat:
          'If anything has to be patched locally to make it fit, that is the finding, not a workaround.',
      },
      {
        title: 'Documentation',
        body:
          'A getting-started page, a full prop reference, and guides for authoring packs and motion presets. Today the API lives in READMEs.',
      },
      {
        title: 'Performance on real phones',
        body:
          'Budgets are met on a laptop and enforced in CI. A mid-range Android has not been measured.',
      },
    ],
  },
  {
    stage: 'considering',
    label: 'Considering',
    note:
      'Not committed, and not in order. Listed so the shape of the thinking is visible — and so the gaps are legible rather than hidden.',
    items: [
      {
        title: 'More packs',
        body:
          'saas-dashboard, seasonal, travel, food, legal. Each is real illustration work, so the next one should be chosen by demand rather than guessed at.',
      },
      {
        title: 'React Native',
        body:
          'The engine is plain data and SVG strings, so the layout, the seeds and every motion preset carry over unchanged. What has to be rebuilt is the renderer — React Native has no DOM, so particles become Animated views over react-native-svg.',
        caveat:
          'The string renderer and the frame kinds are HTML, so media and window frames would not come along initially.',
      },
      {
        title: 'Flutter',
        body:
          'The same split again: a port of the PRNG and the layout solver into Dart, drawing through CustomPainter. Navii does this, and the determinism contract is what makes it tractable — the maths is small and deliberately portable.',
        caveat:
          'A second implementation of the layout solver is a second place for the determinism contract to drift. It would need the frame-0 snapshots shared across both languages, as a fixture.',
      },
      {
        title: 'A canvas renderer',
        body:
          'The DOM renderer is comfortable to about forty shapes. Several hundred would need canvas, behind the same interface.',
      },
      {
        title: 'A static render API',
        body:
          'Frame-zero SVG and PNG over HTTP, for OG images and email. The only idea here that would introduce hosting and uptime obligations.',
      },
    ],
  },
];

/** Things deliberately ruled out. Saying no in public is part of the roadmap. */
export const NOT_DOING: Array<{ title: string; why: string }> = [
  {
    title: 'A visual editor',
    why: 'A different product, and a different company. Mote is a component library.',
  },
  {
    title: 'A scene-composer API',
    why:
      'Stacking two fields already composes layers, and it is the documented idiom. A child-component DSL would be more surface and more ways to be wrong.',
  },
  {
    title: 'Shaders, 3D and WebGL',
    why:
      'Every competitor is already there. Designed shape sets are the thing only Mote does.',
  },
  {
    title: 'A hosted pack marketplace',
    why:
      'Packs are npm packages and a registry file. Accounts and uploads would be a business, not a feature.',
  },
  {
    title: 'Scroll-linked motion',
    why: 'A background that reacts to scrolling stops being a background.',
  },
];
