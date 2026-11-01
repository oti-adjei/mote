/**
 * <FloatingField /> — a thin React wrapper around `createField`.
 *
 * Deliberately thin: all logic lives in @usemote/core so there is one
 * implementation to maintain and test across every framework wrapper.
 *
 * SSR works by rendering core's frame-0 markup via `dangerouslySetInnerHTML`.
 * Because layout is a pure function of (seed, options), the server and client
 * agree exactly, so there is no hydration mismatch and no first-paint flash of
 * an empty section. On mount the field adopts that existing markup rather than
 * throwing it away.
 */
import {
  createField,
  renderFieldHTML,
  type FieldHandle,
  type FieldOptions,
} from '@usemote/core';
import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, ReactElement } from 'react';

export interface FloatingFieldProps extends FieldOptions {
  className?: string;
  style?: CSSProperties;
  /**
   * Size used for the server-rendered frame. Only affects the pre-hydration
   * paint; the client re-measures its real box on mount.
   */
  ssrWidth?: number;
  ssrHeight?: number;
}

const BASE_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
};

export function FloatingField({
  className,
  style,
  ssrWidth = 1200,
  ssrHeight = 600,
  ...options
}: FloatingFieldProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useRef<FieldHandle | null>(null);

  // `packs` and `shapes` are commonly written as inline literals, which would
  // make every render look like a structural change. Serialise them so the
  // effect keys on content rather than identity.
  const poolKey = useMemo(
    () =>
      JSON.stringify([
        options.packs?.map((p) => `${p.id}@${p.version}`) ?? null,
        options.shapes ?? null,
        Array.isArray(options.theme) ? options.theme : (options.theme ?? null),
      ]),
    [options.packs, options.shapes, options.theme],
  );

  const modeIsObject = typeof options.mode === 'object';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    handle.current = createField(el, options);
    return () => {
      handle.current?.destroy();
      handle.current = null;
    };
    // A custom preset object is identity-unstable by nature; re-creating the
    // field on every render would be worse than keying off the first one, so
    // callers passing an object preset should memoise it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolKey,
    options.seed,
    options.count,
    options.size,
    options.set,
    options.depth,
    options.direction,
    modeIsObject ? 'custom' : options.mode,
  ]);

  // Live props: applied without rebuilding the layout.
  //
  // Keys are omitted rather than set to undefined. Under
  // exactOptionalPropertyTypes an explicit `undefined` is a real value, and
  // `update` would read it as "unset this" instead of "leave it alone".
  useEffect(() => {
    const live: Partial<FieldOptions> = {};
    if (options.speed !== undefined) live.speed = options.speed;
    if (options.interactive !== undefined) live.interactive = options.interactive;
    if (options.avoid !== undefined) live.avoid = options.avoid;
    if (options.paused !== undefined) live.paused = options.paused;
    handle.current?.update(live);
  }, [options.speed, options.interactive, options.avoid, options.paused]);

  const ssrHTML = useMemo(
    () => renderFieldHTML({ ...options, width: ssrWidth, height: ssrHeight }),
    [poolKey, options.seed, options.count, options.size, options.set, options.depth, ssrWidth, ssrHeight],
  );

  return (
    <div
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{ ...BASE_STYLE, ...style }}
      dangerouslySetInnerHTML={{ __html: ssrHTML }}
    />
  );
}
