"use client";

import { interpolate } from "flubber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

const STROKE = "#000c10";

type ProcessStepArtProps = {
  step: number;
};

export default function ProcessStepArt({ step }: ProcessStepArtProps) {
  return (
    <div className="relative aspect-square w-full isolate">
      {step === 0 ? (
        <VerkennenArt />
      ) : step === 1 ? (
        <ModellerenArt />
      ) : step === 2 ? (
        <BouwenArt />
      ) : step === 3 ? (
        <LancerenArt />
      ) : (
        <PlaceholderArt step={step} />
      )}
    </div>
  );
}

function useStepScrollTrigger(
  svgRef: React.RefObject<SVGSVGElement | null>,
  setup: (svg: SVGSVGElement, li: HTMLElement) => void,
  reduceState: (svg: SVGSVGElement) => void,
) {
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    const svg = svgRef.current;
    if (!locomotiveScroll || !svg) return;

    gsap.registerPlugin(ScrollTrigger);
    const li = svg.closest("li");
    if (!li) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        setup(svg, li as HTMLElement);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        reduceState(svg);
      });
    }, svg);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [locomotiveScroll, svgRef, setup, reduceState]);
}

/* ============================================================
   Verkennen — scattered signal dots fade in across the canvas,
   then stream inward and converge on a central insight point
   that pulses with an expanding ring (chaos → focus).
   ============================================================ */

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

function VerkennenArt() {
  const svgRef = useRef<SVGSVGElement>(null);

  useStepScrollTrigger(
    svgRef,
    (svg, li) => {
      const dots = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-dot]"));
      const core = svg.querySelector<SVGCircleElement>("[data-core]");
      const ring1 = svg.querySelector<SVGCircleElement>("[data-ring-1]");
      const ring2 = svg.querySelector<SVGCircleElement>("[data-ring-2]");
      if (!core || !ring1 || !ring2 || dots.length === 0) return;

      dots.forEach((dot, i) => {
        const d = V_DOTS[i];
        if (!d) return;
        gsap.set(dot, {
          x: d.ox,
          y: d.oy,
          scale: 0,
          opacity: 0,
          transformOrigin: "200px 200px",
        });
      });
      gsap.set(core, { attr: { r: 0 }, opacity: 0 });
      gsap.set(ring1, { attr: { r: 0 }, opacity: 0 });
      gsap.set(ring2, { attr: { r: 0 }, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: li,
          scroller: document.body,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: scattered signals appear (chaos)
      dots.forEach((dot, i) => {
        const d = V_DOTS[i];
        if (!d) return;
        tl.to(
          dot,
          {
            opacity: d.alpha,
            scale: 1,
            duration: 0.2,
            ease: "back.out(2)",
          },
          i * 0.025,
        );
      });

      // Phase 2: signals stream to center, fading on arrival
      dots.forEach((dot, i) => {
        tl.to(
          dot,
          {
            x: 0,
            y: 0,
            scale: 0.4,
            opacity: 0,
            duration: 0.55,
            ease: "power2.in",
          },
          0.55 + i * 0.035,
        );
      });

      // Phase 3: insight crystallises at center
      tl.to(
        core,
        { attr: { r: 6 }, opacity: 1, duration: 0.3, ease: "back.out(2)" },
        1.1,
      );
      tl.to(
        ring1,
        { attr: { r: 36 }, opacity: 0.55, duration: 0.45, ease: "power2.out" },
        1.1,
      );
      tl.to(ring1, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.4);
      tl.to(
        ring2,
        { attr: { r: 60 }, opacity: 0.35, duration: 0.55, ease: "power2.out" },
        1.25,
      );
      tl.to(ring2, { opacity: 0, duration: 0.4, ease: "power1.in" }, 1.6);
    },
    (svg) => {
      const dots = svg.querySelectorAll<SVGCircleElement>("[data-dot]");
      const core = svg.querySelector<SVGCircleElement>("[data-core]");
      dots.forEach((d) => {
        d.style.opacity = "0";
      });
      if (core) {
        core.setAttribute("r", "6");
        core.style.opacity = "1";
      }
    },
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        data-ring-2
        cx="200"
        cy="200"
        fill="none"
        r="0"
        stroke={STROKE}
        strokeWidth="0.9"
      />
      <circle
        data-ring-1
        cx="200"
        cy="200"
        fill="none"
        r="0"
        stroke={STROKE}
        strokeWidth="1"
      />
      <circle data-core cx="200" cy="200" fill={STROKE} r="0" />

      {V_DOTS.map((d, i) => (
        <circle
          key={i}
          data-dot
          cx="200"
          cy="200"
          fill={STROKE}
          r={d.r}
        />
      ))}
    </svg>
  );
}

/* ============================================================
   Modelleren — bricks fall in row by row and stack into a
   pyramid. Bottom up: 4 → 3 → 2 → 1 keystone.
   ============================================================ */

const M_BRICKS = [
  // Row 1 (bottom): 4 bricks
  { x: 54, y: 280 },
  { x: 128, y: 280 },
  { x: 202, y: 280 },
  { x: 276, y: 280 },
  // Row 2: 3 bricks
  { x: 91, y: 246 },
  { x: 165, y: 246 },
  { x: 239, y: 246 },
  // Row 3: 2 bricks
  { x: 128, y: 212 },
  { x: 202, y: 212 },
  // Row 4: keystone
  { x: 165, y: 178 },
] as const;

const M_BRICK_W = 70;
const M_BRICK_H = 30;

function ModellerenArt() {
  const svgRef = useRef<SVGSVGElement>(null);

  useStepScrollTrigger(
    svgRef,
    (svg, li) => {
      const bricks = Array.from(svg.querySelectorAll<SVGRectElement>("[data-brick]"));
      if (bricks.length === 0) return;

      gsap.set(bricks, { y: -420, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: li,
          scroller: document.body,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      const lastIndex = bricks.length - 1;
      bricks.forEach((brick, i) => {
        const isKeystone = i === lastIndex;
        tl.to(
          brick,
          {
            y: 0,
            opacity: 1,
            duration: isKeystone ? 0.5 : 0.35,
            ease: isKeystone ? "back.out(1.8)" : "back.out(1.3)",
          },
          isKeystone ? 1.0 : i * 0.08,
        );
      });
    },
    (svg) => {
      const bricks = svg.querySelectorAll<SVGRectElement>("[data-brick]");
      bricks.forEach((b) => {
        b.style.opacity = "1";
        b.style.transform = "none";
      });
    },
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      {M_BRICKS.map((b, i) => (
        <rect
          key={i}
          data-brick
          fill="none"
          height={M_BRICK_H}
          rx="3"
          stroke={STROKE}
          strokeLinejoin="round"
          strokeWidth="1.1"
          width={M_BRICK_W}
          x={b.x}
          y={b.y}
        />
      ))}
    </svg>
  );
}

/* ============================================================
   Bouwen — a single horizontal line morphs into an app frame,
   then header dots, content rows, and CTA assemble inside.
   ============================================================ */

const B_LINE = "M 80 200 L 320 200 L 320 202 L 80 202 Z";
const B_FRAME = "M 60 110 L 340 110 L 340 290 L 60 290 Z";

function BouwenArt() {
  const svgRef = useRef<SVGSVGElement>(null);

  useStepScrollTrigger(
    svgRef,
    (svg, li) => {
      const master = svg.querySelector<SVGPathElement>("[data-master]");
      const headerLine = svg.querySelector<SVGLineElement>("[data-header-line]");
      const dots = svg.querySelectorAll<SVGCircleElement>("[data-dot]");
      const rows = svg.querySelectorAll<SVGLineElement>("[data-row]");
      const cta = svg.querySelector<SVGGElement>("[data-cta]");
      if (!master) return;

      const morph = interpolate(B_LINE, B_FRAME, { maxSegmentLength: 4 });

      master.setAttribute("d", B_LINE);
      gsap.set(headerLine, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
      gsap.set(rows, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });

      const dotRadii = Array.from(dots).map((el) =>
        Number(el.getAttribute("r") ?? "2.5"),
      );
      dots.forEach((el) => el.setAttribute("r", "0"));

      gsap.set(cta, { opacity: 0, scale: 0, transformOrigin: "124px 260px" });

      const state = { p: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: li,
          scroller: document.body,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        state,
        {
          p: 1,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => master.setAttribute("d", morph(state.p)),
        },
        0,
      );

      tl.to(
        headerLine,
        { strokeDashoffset: 0, opacity: 1, duration: 0.4, ease: "power1.out" },
        0.9,
      );

      dots.forEach((dot, i) => {
        tl.to(
          dot,
          {
            attr: { r: dotRadii[i] },
            duration: 0.3,
            ease: "back.out(2)",
          },
          1.0 + i * 0.06,
        );
      });

      tl.to(
        rows,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.08,
        },
        1.3,
      );

      tl.to(
        cta,
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        1.8,
      );
    },
    (svg) => {
      const master = svg.querySelector<SVGPathElement>("[data-master]");
      const headerLine = svg.querySelector<SVGLineElement>("[data-header-line]");
      const rows = svg.querySelectorAll<SVGLineElement>("[data-row]");
      const cta = svg.querySelector<SVGGElement>("[data-cta]");
      if (master) master.setAttribute("d", B_FRAME);
      if (headerLine) {
        headerLine.style.strokeDashoffset = "0";
        headerLine.style.opacity = "1";
      }
      rows.forEach((r) => {
        r.style.strokeDashoffset = "0";
        r.style.opacity = "1";
      });
      if (cta) cta.style.opacity = "1";
    },
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        data-master
        d={B_LINE}
        stroke={STROKE}
        strokeLinejoin="round"
        strokeWidth="1.2"
      />

      <line
        data-header-line
        opacity="0.45"
        pathLength={1}
        stroke={STROKE}
        strokeWidth="0.75"
        x1="60"
        x2="340"
        y1="140"
        y2="140"
      />

      <g fill={STROKE}>
        <circle data-dot cx="288" cy="125" r="2.5" />
        <circle data-dot cx="306" cy="125" r="2.5" />
        <circle data-dot cx="324" cy="125" r="2.5" />
      </g>

      <g
        opacity="0.75"
        stroke={STROKE}
        strokeLinecap="round"
        strokeWidth="1.1"
      >
        <line data-row pathLength={1} x1="84" x2="316" y1="170" y2="170" />
        <line data-row pathLength={1} x1="84" x2="282" y1="192" y2="192" />
        <line data-row pathLength={1} x1="84" x2="304" y1="214" y2="214" />
        <line data-row pathLength={1} x1="84" x2="248" y1="236" y2="236" />
      </g>

      <g data-cta>
        <rect
          fill={STROKE}
          height="22"
          rx="6"
          width="80"
          x="84"
          y="249"
        />
      </g>
    </svg>
  );
}

/* ============================================================
   Lanceren — a growth chart takes off. 5 bars rise in sequence,
   then a launch arrow shoots from the tallest bar up through the
   top-right corner with a fast burst at the exit.
   ============================================================ */

const L_BARS = [
  { x: 70, y: 270, h: 50 },
  { x: 122, y: 232, h: 88 },
  { x: 174, y: 190, h: 130 },
  { x: 226, y: 140, h: 180 },
  { x: 278, y: 80, h: 240 },
] as const;
const L_BAR_W = 40;
const L_BASELINE = 320;
const L_ARROW_PATH = "M 298 80 L 372 8";
const L_BURST = { x: 360, y: 20 };
const L_BURST_RAYS = 6;
const L_BURST_LEN = 22;

function LancerenArt() {
  const svgRef = useRef<SVGSVGElement>(null);

  useStepScrollTrigger(
    svgRef,
    (svg, li) => {
      const bars = Array.from(svg.querySelectorAll<SVGRectElement>("[data-bar]"));
      const arrow = svg.querySelector<SVGPathElement>("[data-arrow]");
      const rays = svg.querySelectorAll<SVGLineElement>("[data-ray]");
      const ring = svg.querySelector<SVGCircleElement>("[data-ring]");
      if (bars.length === 0 || !arrow || !ring) return;

      gsap.set(bars, { scaleY: 0, transformOrigin: "50% 100%", transformBox: "fill-box" });

      const arrowLen = arrow.getTotalLength();
      gsap.set(arrow, { strokeDasharray: arrowLen, strokeDashoffset: arrowLen });

      gsap.set(rays, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 });
      gsap.set(ring, { attr: { r: 0 }, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: li,
          scroller: document.body,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      bars.forEach((bar, i) => {
        tl.to(
          bar,
          {
            scaleY: 1,
            duration: 0.32,
            ease: "expo.out",
          },
          i * 0.11,
        );
      });

      // Launch arrow draws fast
      tl.to(
        arrow,
        {
          strokeDashoffset: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0.7,
      );

      // Snappy burst at exit
      tl.to(
        rays,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.18,
          ease: "power3.out",
        },
        0.98,
      );

      tl.to(
        ring,
        { attr: { r: 30 }, duration: 0.25, ease: "power2.out" },
        0.98,
      );
      tl.to(ring, { opacity: 1, duration: 0.05 }, 0.98);
      tl.to(ring, { opacity: 0, duration: 0.2, ease: "power1.in" }, 1.1);
    },
    (svg) => {
      const bars = svg.querySelectorAll<SVGRectElement>("[data-bar]");
      const arrow = svg.querySelector<SVGPathElement>("[data-arrow]");
      const rays = svg.querySelectorAll<SVGLineElement>("[data-ray]");
      bars.forEach((b) => {
        b.style.transform = "none";
      });
      if (arrow) arrow.setAttribute("stroke-dashoffset", "0");
      rays.forEach((r) => {
        r.style.strokeDashoffset = "0";
        r.style.opacity = "1";
      });
    },
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        opacity="0.25"
        stroke={STROKE}
        strokeLinecap="round"
        strokeWidth="0.75"
        x1="50"
        x2="350"
        y1={L_BASELINE}
        y2={L_BASELINE}
      />

      {L_BARS.map((b, i) => (
        <rect
          key={i}
          data-bar
          fill="none"
          height={b.h}
          rx="4"
          stroke={STROKE}
          strokeLinejoin="round"
          strokeWidth="1.1"
          width={L_BAR_W}
          x={b.x}
          y={b.y}
        />
      ))}

      <path
        data-arrow
        d={L_ARROW_PATH}
        stroke={STROKE}
        strokeLinecap="round"
        strokeWidth="1.4"
      />

      <g
        stroke={STROKE}
        strokeLinecap="round"
        strokeWidth="1.3"
        transform={`translate(${L_BURST.x} ${L_BURST.y})`}
      >
        {Array.from({ length: L_BURST_RAYS }).map((_, i) => {
          const angle = (i * Math.PI * 2) / L_BURST_RAYS;
          return (
            <line
              key={i}
              data-ray
              pathLength={1}
              x1="0"
              x2={Math.cos(angle) * L_BURST_LEN}
              y1="0"
              y2={Math.sin(angle) * L_BURST_LEN}
            />
          );
        })}
      </g>

      <circle
        data-ring
        cx={L_BURST.x}
        cy={L_BURST.y}
        fill="none"
        r="0"
        stroke={STROKE}
        strokeWidth="1.1"
      />
    </svg>
  );
}

function PlaceholderArt({ step }: { step: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-mono text-sm font-light tracking-widest text-[#000c10]/30">
        0{step + 1}
      </span>
    </div>
  );
}
