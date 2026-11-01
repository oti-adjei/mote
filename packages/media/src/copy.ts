/**
 * Per-pack chrome copy, from the design source.
 *
 * A browser frame in a devtools field should read `localhost:3000`, not
 * `example.com` — the chrome is part of the pack's vocabulary, and generic
 * placeholder text is what makes a mockup look like a mockup.
 */
import type { PackCopy } from './types.js';

export const COPY: Record<string, PackCopy> = {
  esports: {
    url: 'publication.gg/live', title: 'Grand Final · Lagos',
    stream: ['K9 vs NOVA', '2–1'],
    caps: [['K9', 'ACCRA'], ['NOVA', 'LAGOS'], ['ADA', 'ACCRA'], ['DEMZY', 'LAGOS']],
  },
  devtools: {
    url: 'localhost:3000', title: 'deploy — main',
    caps: [['v2.4.0', 'SHIPPED'], ['main', 'GREEN'], ['#128', 'MERGED'], ['api', '200 OK']],
  },
  ai: {
    url: 'chat.model.ai', title: 'Inference',
    caps: [['Prompt', 'TEXT'], ['Vision', 'IMAGE'], ['Voice', 'AUDIO'], ['Agent', 'RUN']],
  },
  fintech: {
    url: 'app.ledger.io', title: 'Portfolio',
    caps: [['+2.4%', 'TODAY'], ['Savings', 'GOAL'], ['Card', 'ACTIVE'], ['NGN/USD', 'LIVE']],
  },
  creative: {
    url: 'studio.work', title: 'Moodboard',
    caps: [['Brand', 'V3'], ['Poster', 'DRAFT'], ['Type', 'SPEC'], ['Motion', 'WIP']],
  },
  space: {
    url: 'mission.live', title: 'Telemetry',
    caps: [['Orbit 3', 'LIVE'], ['Mars', 'SOL 214'], ['Launch', 'T-10'], ['Lunar', 'PASS']],
  },
  cyber: {
    url: 'vault.secure', title: 'audit.log',
    caps: [['Firewall', 'ON'], ['2FA', 'VERIFIED'], ['Scan', 'CLEAN'], ['Vault', 'LOCKED']],
  },
  health: {
    url: 'care.app', title: 'Vitals',
    caps: [['72 BPM', 'REST'], ['Sleep', '7H 40'], ['Steps', '9,420'], ['Dose', '08:00']],
  },
  education: {
    url: 'learn.school', title: 'Lesson 04',
    caps: [['Algebra', 'UNIT 2'], ['Physics', 'LAB'], ['History', 'QUIZ'], ['Art', 'STUDIO']],
  },
};

export const fallbackCopy = COPY.esports as PackCopy;
