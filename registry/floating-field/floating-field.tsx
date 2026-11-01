/**
 * Mote — FloatingField (vendored copy).
 *
 * Installed via the shadcn registry, this file is yours: edit it freely.
 * It depends on @usemote/core for the engine; only the React binding lives
 * here, because that is the part people actually want to tweak.
 */
'use client';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
