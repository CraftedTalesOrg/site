import type { JSX } from 'react';

/**
 * Background effects component with animated gradient patterns and grid overlay.
 * These elements are positioned fixed and sit behind all page content.
 */
export default function BackgroundEffects(): JSX.Element {
  return (
    <>
      <div className={'bg-pattern'} />
      <div className={'grid-overlay'} />
    </>
  );
}
