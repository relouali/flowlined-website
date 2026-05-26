"use client";

import { useRef } from "react";

import "./giant-wordmark.css";

/**
 * Giant wordmark stamp shown at the very bottom of the site, modelled
 * on the footer wordmark from payloadcms.com.
 *
 * The shape is the Flowlined wordmark (`/logo/full-Logo.svg`) used as
 * a CSS `mask-image`, so only the letterforms are visible. The fill
 * is the same mesh gradient as `.manifest-section` to keep the colour
 * story consistent across the page. On hover, a radial-gradient
 * spotlight follows the cursor (via CSS custom properties
 * `--mx`/`--my`) and brightens only the part of the wordmark
 * underneath — same local-highlight effect Payload uses.
 *
 * Purely decorative — `aria-hidden` keeps it out of the a11y tree.
 */
export default function GiantWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Translate the page-space cursor into element-local coordinates so
    // the radial-gradient spotlight lands exactly where the cursor is.
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    // Park the spotlight off-screen on exit so it isn't sitting at
    // its last position the next time the user hovers in. (Opacity is
    // also tied to :hover, so this is just defence in depth.)
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className="giant-wordmark"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="giant-wordmark__base" />
      <div className="giant-wordmark__spotlight" />
    </div>
  );
}
