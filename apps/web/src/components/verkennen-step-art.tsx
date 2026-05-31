"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

const STROKE = "#000c10";
const CENTER = 200;

type VerkennenDot = { ox: number; oy: number; r: number; alpha: number };

const V_DOTS: ReadonlyArray<VerkennenDot> = [
  { ox: -110, oy: -120, r: 3, alpha: 0.7 },
  { ox: -30, oy: -130, r: 2.5, alpha: 0.55 },
  { ox: 60, oy: -110, r: 4, alpha: 0.85 },
  { ox: 130, oy: -60, r: 3, alpha: 0.7 },
  { ox: 140, oy: 40, r: 2.5, alpha: 0.6 },
  { ox: 110, oy: 110, r: 3.5, alpha: 0.75 },
  { ox: 40, oy: 140, r: 2.5, alpha: 0.55 },
  { ox: -60, oy: 130, r: 3, alpha: 0.7 },
  { ox: -130, oy: 100, r: 2.5, alpha: 0.6 },
  { ox: -140, oy: 10, r: 3.5, alpha: 0.8 },
  { ox: -120, oy: -40, r: 2.5, alpha: 0.55 },
  { ox: -70, oy: -50, r: 2, alpha: 0.5 },
  { ox: 70, oy: 30, r: 2, alpha: 0.5 },
  { ox: 30, oy: -70, r: 2, alpha: 0.5 },
];

function setVerkennenInitialState(
  dots: SVGCircleElement[],
  core: SVGCircleElement,
  ring1: SVGCircleElement,
  ring2: SVGCircleElement,
) {
  dots.forEach((dot, i) => {
    const d = V_DOTS[i];
    if (!d) return;
    gsap.set(dot, {
      attr: { cx: d.ox, cy: d.oy, r: d.r * 0.55 },
      opacity: 0,
    });
  });
  gsap.set(core, { attr: { r: 0, cx: 0, cy: 0 }, opacity: 0 });
  gsap.set(ring1, { attr: { r: 0, cx: 0, cy: 0 }, opacity: 0 });
  gsap.set(ring2, { attr: { r: 0, cx: 0, cy: 0 }, opacity: 0 });
}

function buildVerkennenTimeline(
  dots: SVGCircleElement[],
  core: SVGCircleElement,
  ring1: SVGCircleElement,
  ring2: SVGCircleElement,
) {
  setVerkennenInitialState(dots, core, ring1, ring2);

  const phase1Stagger = 0.1;
  const phase1Duration = 0.5;
  const convergeStart = 2.0;
  const convergeStagger = 0.055;
  const convergeDuration = 0.7;
  const dotCount = dots.length;
  const mergeComplete =
    convergeStart + (dotCount - 1) * convergeStagger + convergeDuration;

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.1,
    paused: true,
  });

  dots.forEach((dot, i) => {
    const d = V_DOTS[i];
    if (!d) return;
    tl.to(
      dot,
      {
        attr: { r: d.r },
        opacity: d.alpha,
        duration: phase1Duration,
        ease: "sine.out",
      },
      i * phase1Stagger,
    );
  });

  dots.forEach((dot, i) => {
    const d = V_DOTS[i];
    if (!d) return;

    const startAt = convergeStart + i * convergeStagger;
    const arriveAt = startAt + convergeDuration;
    const mergeProgress = (i + 1) / dotCount;

    tl.to(
      dot,
      {
        attr: { cx: 0, cy: 0, r: 0 },
        opacity: 0,
        duration: convergeDuration,
        ease: "sine.in",
      },
      startAt,
    );

    tl.to(
      core,
      {
        attr: { r: 2 + mergeProgress * 4 },
        opacity: 0.2 + mergeProgress * 0.8,
        duration: 0.35,
        ease: "sine.out",
      },
      arriveAt - 0.1,
    );
  });

  tl.set(core, { attr: { r: 6, cx: 0, cy: 0 }, opacity: 1 }, mergeComplete);

  tl.to(
    ring1,
    { attr: { r: 36 }, opacity: 0.55, duration: 0.55, ease: "sine.out" },
    mergeComplete + 0.05,
  );
  tl.to(
    ring1,
    { opacity: 0, duration: 0.4, ease: "sine.in" },
    mergeComplete + 0.55,
  );
  tl.to(
    ring2,
    { attr: { r: 60 }, opacity: 0.35, duration: 0.65, ease: "sine.out" },
    mergeComplete + 0.2,
  );
  tl.to(
    ring2,
    { opacity: 0, duration: 0.45, ease: "sine.in" },
    mergeComplete + 0.8,
  );

  tl.eventCallback("onRepeat", () => {
    setVerkennenInitialState(dots, core, ring1, ring2);
  });

  return tl;
}

function useVerkennenPlayback(
  rootRef: React.RefObject<HTMLDivElement | null>,
  svgRef: React.RefObject<SVGSVGElement | null>,
) {
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!locomotiveScroll || !root || !svg) return;

    let timeline: gsap.core.Timeline | null = null;
    let observer: MutationObserver | null = null;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const dots = Array.from(
          svg.querySelectorAll<SVGCircleElement>("[data-dot]"),
        );
        const core = svg.querySelector<SVGCircleElement>("[data-core]");
        const ring1 = svg.querySelector<SVGCircleElement>("[data-ring-1]");
        const ring2 = svg.querySelector<SVGCircleElement>("[data-ring-2]");
        if (!core || !ring1 || !ring2 || dots.length === 0) return;

        timeline = buildVerkennenTimeline(dots, core, ring1, ring2);

        const syncPlayback = () => {
          if (!timeline) return;
          if (root.classList.contains("is--playing")) {
            timeline.restart();
          } else {
            timeline.pause(0);
            setVerkennenInitialState(dots, core, ring1, ring2);
          }
        };

        observer = new MutationObserver(syncPlayback);
        observer.observe(root, {
          attributes: true,
          attributeFilter: ["class"],
        });

        syncPlayback();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const dots = svg.querySelectorAll<SVGCircleElement>("[data-dot]");
        const core = svg.querySelector<SVGCircleElement>("[data-core]");
        dots.forEach((d) => {
          d.style.opacity = "0";
        });
        if (core) {
          core.setAttribute("r", "6");
          core.style.opacity = "1";
        }
      });
    }, svg);

    return () => {
      observer?.disconnect();
      timeline?.kill();
      ctx.revert();
    };
  }, [locomotiveScroll, rootRef, svgRef]);
}

export default function VerkennenStepArt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useVerkennenPlayback(rootRef, svgRef);

  return (
    <div
      ref={rootRef}
      className="process-art relative aspect-square w-full isolate"
    >
      <svg
        ref={svgRef}
        aria-hidden
        className="process-art__svg absolute inset-0"
        fill="none"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`translate(${CENTER} ${CENTER})`}>
          <circle
            data-ring-2
            cx="0"
            cy="0"
            fill="none"
            r="0"
            stroke={STROKE}
            strokeWidth="0.9"
          />
          <circle
            data-ring-1
            cx="0"
            cy="0"
            fill="none"
            r="0"
            stroke={STROKE}
            strokeWidth="1"
          />
          <circle data-core cx="0" cy="0" fill={STROKE} r="0" />

          {V_DOTS.map((d, i) => (
            <circle
              key={i}
              data-dot
              cx={d.ox}
              cy={d.oy}
              fill={STROKE}
              opacity="0"
              r={d.r * 0.55}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
