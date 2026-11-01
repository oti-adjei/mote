/**
 * CDN entry. Bundles core and the built-in packs, registers them by name, and
 * defines the element immediately — a <script> tag user should need no second
 * step beyond adding the tag.
 */
import { BASE_PACK } from '@usemote/core';
import { esports } from '@usemote/pack-esports';
import { define, registerPack } from './element.js';

registerPack(BASE_PACK, 'base');
registerPack(esports, 'esports');
define();

export * from '@usemote/core';
export { define, registerPack, registeredPacks, FloatingFieldElement } from './element.js';
