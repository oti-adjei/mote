import { useState } from 'react';

/**
 * Code panel with a copy button.
 *
 * Copying can fail — an insecure origin, a denied permission — so the button
 * reports what actually happened rather than always claiming success, and
 * falls back to selecting the text so the code is still obtainable.
 */
export function CodeBlock({
  label,
  code,
  id,
  copyLabel = 'Copy',
}: {
  label: string;
  code: string;
  id?: string;
  /** Button text — "Copy prompt" on the MCP page, "Copy" elsewhere. */
  copyLabel?: string;
}): React.ReactElement {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2400);
  };

  return (
    <div className="code-block" {...(id ? { id } : {})}>
      <div className="code-bar">
        <span>{label}</span>
        <button type="button" onClick={copy}>
          {state === 'copied'
            ? 'Copied'
            : state === 'failed'
              ? 'Select and copy'
              : copyLabel}
        </button>
      </div>
      <pre>{code}</pre>
      {state === 'failed' && (
        <label className="sr-only" htmlFor={`${id ?? 'code'}-fallback`}>
          Copy this code manually
        </label>
      )}
      {state === 'failed' && (
        <textarea
          id={`${id ?? 'code'}-fallback`}
          className="copy-fallback"
          readOnly
          value={code}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
      <p className="sr-only" role="status">
        {state === 'copied' ? 'Code copied to clipboard' : ''}
      </p>
    </div>
  );
}
