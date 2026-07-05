"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initStickyTitleScroll } from "@/lib/init-sticky-title-scroll";

import "./sticky-title-scroll.css";

type StickyTitleScrollProps = {
  headings: ReadonlyArray<ReactNode>;
  className?: string;
  heightVh?: number;
  gradientBackground?: boolean;
};

export default function StickyTitleScroll({
  headings,
  className,
  heightVh,
  gradientBackground = false,
}: StickyTitleScrollProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !wrapRef.current) return;

    let cancelled = false;
    let revert = () => {};

    // Wait for fonts + layout so the split lines and the trigger's start/end are
    // measured against the final pinned geometry, then let Locomotive recompute
    // its scroll height before refreshing ScrollTrigger.
    const setup = () => {
      if (cancelled || !wrapRef.current) return;

      revert();
      revert = initStickyTitleScroll(wrapRef.current);
      locomotiveScroll.resize();
      ScrollTrigger.refresh(true);
    };

    const fonts = (
      document as Document & { fonts?: { ready: Promise<unknown> } }
    ).fonts;

    const run = () => {
      requestAnimationFrame(() => requestAnimationFrame(setup));
    };

    if (fonts?.ready) {
      void fonts.ready.then(run);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      revert();
    };
  }, [locomotiveScroll, headings]);

  return (
    <div
      ref={wrapRef}
      data-sticky-title="wrap"
      data-sticky-height={heightVh}
      className={["sticky-title-wrap", className].filter(Boolean).join(" ")}
    >
      <div className="sticky-title-container">
        {gradientBackground && (
          <div className="sticky-title-gradient" aria-hidden>
            <span className="sticky-title-blob sticky-title-blob--1" />
            <span className="sticky-title-blob sticky-title-blob--2" />
            <span className="sticky-title-blob sticky-title-blob--3" />
            <span className="sticky-title-blob sticky-title-blob--4" />
          </div>
        )}
        <div className="sticky-title-inner">
          {headings.map((text, index) => (
            <h2
              key={index}
              data-sticky-title="heading"
              className={[
                "sticky-title-el type-section-title",
                index > 0 ? "is--stacked" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {text}
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
}
