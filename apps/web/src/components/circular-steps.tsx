"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import HighlightText from "@/components/highlight-text";
import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

import "./circular-steps.css";

export type CircularStep = {
  phase: string;
  title: string;
  description: string;
};

type CircularStepsProps = {
  steps: ReadonlyArray<CircularStep>;
  title: string;
  titleMuted: string;
  description: string;
};

// Flowlined brand mark — the same icon used in the nav
// (/images/flowlined-logo.svg), inlined so it can be recolored to dark ink
// for the light theme (the asset ships with a white fill).
function BrandMark() {
  return (
    <svg
      className="circular-steps__logo"
      viewBox="0 0 30.1701 34"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9437 30.6582C11.9437 29.1943 13.1047 28.0076 14.5368 28.0076C15.9689 28.0076 17.1298 29.1943 17.1298 30.6582C17.1298 32.1222 15.9689 33.3089 14.5368 33.3089C13.1047 33.3089 11.9437 32.1222 11.9437 30.6582Z"
        fill="#000c10"
      />
      <path
        d="M27.4235 33.3089C28.8556 33.3089 30.0165 32.1222 30.0165 30.6582C30.0165 29.1943 28.8556 28.0076 27.4235 28.0076C25.9914 28.0076 24.8304 29.1943 24.8304 30.6582C24.8304 32.1222 25.9914 33.3089 27.4235 33.3089Z"
        fill="#000c10"
      />
      <path
        d="M30.0165 16.7623C30.0165 15.2984 28.8556 14.1116 27.4235 14.1116C25.9914 14.1116 24.8304 15.2984 24.8304 16.7623C24.8304 18.2262 25.9914 19.413 27.4235 19.413C28.8556 19.413 30.0165 18.2262 30.0165 16.7623Z"
        fill="#000c10"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2.38262C2.89707e-07 1.18584 0.949094 0.215658 2.11986 0.215658H29.0736L29.0736 4.55312L7.24599 4.55312L16.6164 14.1318C18.349 15.9028 17.1219 18.931 14.6717 18.931H4.24317V33.3089H2.22019e-06L4.19039e-07 17.4049C2.43199e-07 15.8522 1.23131 14.5936 2.7502 14.5936L11.0674 14.5936L0.620892 3.9149C0.223342 3.50852 -1.39122e-07 2.95734 0 2.38262Z"
        fill="#000c10"
      />
    </svg>
  );
}

export default function CircularSteps({
  steps,
  title,
  titleMuted,
  description,
}: CircularStepsProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // The connector line is only shown while a number is docked at the apex.
  // On each step change it hides, then reappears once the ring finishes
  // rotating the new active node into place.
  const [connected, setConnected] = useState(true);
  const isFirstRender = useRef(true);
  const { locomotiveScroll } = useLocomotiveScroll();

  const stepCount = steps.length;
  const anglePer = 360 / stepCount;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setConnected(false);
    const timeout = window.setTimeout(() => setConnected(true), 700);

    return () => window.clearTimeout(timeout);
  }, [activeIndex]);

  // Map scroll progress through the pinned stage onto a discrete step index.
  // Runs on every viewport — the stepper is pinned and scroll-driven on mobile
  // and desktop alike (only the layout differs, via CSS).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!locomotiveScroll || !wrapRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrap = wrapRef.current;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: wrap,
        scroller: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const next = Math.round(self.progress * (stepCount - 1));
          setActiveIndex((prev) => (prev === next ? prev : next));
        },
      });

      ScrollTrigger.refresh();

      return () => trigger.kill();
    });

    return () => {
      mm.revert();
    };
  }, [locomotiveScroll, stepCount]);

  // Click-to-jump: scroll the pinned stage to the position of the chosen step.
  const goToStep = (index: number) => {
    const wrap = wrapRef.current;
    if (!wrap || !locomotiveScroll || stepCount < 2) return;

    const distance = wrap.offsetHeight - window.innerHeight;
    const target = wrap.offsetTop + (index / (stepCount - 1)) * distance;
    locomotiveScroll.scrollTo(target);
  };

  const active = steps[activeIndex];

  return (
    <div
      ref={wrapRef}
      className="circular-steps"
      style={{ "--step-count": stepCount } as CSSProperties}
    >
      <div className="circular-steps__stage">
        <header className="circular-steps__header">
          <HighlightText
            className="type-section-title text-[#000c10]"
            scrollStart="top 82%"
            scrollEnd="top 50%"
            stagger={0.05}
          >
            {title} <span className="text-[#000c10]/45">{titleMuted}</span>
          </HighlightText>
          <p className="circular-steps__intro type-section-lead">{description}</p>
        </header>

        {/* Scroll-driven circular stepper (all viewports). On desktop the
            content sits inside the dome; on mobile it flows below it. */}
        <div className="circular-steps__scene" aria-hidden>
          <div className="circular-steps__dome">
            <div
              className="circular-steps__ring"
              style={{ transform: `rotate(${-activeIndex * anglePer}deg)` }}
            >
              <span className="circular-steps__ring-line" />
              {steps.map((step, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={step.title}
                    type="button"
                    tabIndex={-1}
                    className={`circular-steps__node${isActive ? " is--active" : ""}`}
                    style={
                      {
                        transform: `rotate(${index * anglePer}deg) translateY(calc(-1 * var(--ring-radius)))`,
                      } as CSSProperties
                    }
                    onClick={() => goToStep(index)}
                  >
                    <span
                      className="circular-steps__node-inner"
                      style={
                        {
                          transform: `rotate(${(activeIndex - index) * anglePer}deg)`,
                        } as CSSProperties
                      }
                    >
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="circular-steps__center">
              <span
                className={`circular-steps__connector${connected ? " is--connected" : ""}`}
              />
              <span className="circular-steps__mark">
                <BrandMark />
              </span>
            </div>
          </div>

          <div key={activeIndex} className="circular-steps__content">
            <span className="circular-steps__phase">{active.phase}</span>
            <h3 className="circular-steps__title type-card-title-lg">
              {active.title}
            </h3>
            <p className="circular-steps__description type-body">
              {active.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
