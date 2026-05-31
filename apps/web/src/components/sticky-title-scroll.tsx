"use client";

import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initStickyTitleScroll } from "@/lib/init-sticky-title-scroll";

import "./sticky-title-scroll.css";

type StickyTitleScrollProps = {
  headings: ReadonlyArray<string>;
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

    const revert = initStickyTitleScroll(wrapRef.current);

    return () => {
      revert();
    };
  }, [locomotiveScroll]);

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
              key={text}
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
