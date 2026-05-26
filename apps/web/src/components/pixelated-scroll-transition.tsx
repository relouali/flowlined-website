"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

import "./pixelated-scroll-transition.css";

type PixelatedScrollTransitionProps = {
  columns?: number;
  columnsTablet?: number;
  columnsLandscape?: number;
  columnsMobile?: number;
  rows?: number;
  rowsTablet?: number;
  rowsLandscape?: number;
  rowsMobile?: number;
  mode?: "cover" | "reveal";
  scrollStart?: string;
  scrollEnd?: string;
  color?: string;
  pixelRatio?: string;
  className?: string;
};

const SCRUB = 0.3;
const PIXEL_DURATION = 0.1;
const STAGGER_AMOUNT = 1.5;

export default function PixelatedScrollTransition({
  columns = 16,
  columnsTablet = 10,
  columnsLandscape,
  columnsMobile = 6,
  rows = 6,
  rowsTablet,
  rowsLandscape,
  rowsMobile,
  mode = "cover",
  scrollStart,
  scrollEnd,
  color,
  pixelRatio,
  className,
}: PixelatedScrollTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !wrapperRef.current) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const trigger = wrapper.parentElement;
    if (!trigger) return;

    const isMobile = window.matchMedia("(max-width: 478px)").matches;
    const isLandscape = window.matchMedia(
      "(min-width: 479px) and (max-width: 767px)"
    ).matches;
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 991px)"
    ).matches;

    const cols = isMobile
      ? (columnsMobile ?? Math.max(4, Math.round(columns * 0.4)))
      : isLandscape
        ? (columnsLandscape ?? Math.max(6, Math.round(columns * 0.6)))
        : isTablet
          ? (columnsTablet ?? Math.max(8, Math.round(columns * 0.75)))
          : columns;

    const rowCount = isMobile
      ? (rowsMobile ?? rows)
      : isLandscape
        ? (rowsLandscape ?? rows)
        : isTablet
          ? (rowsTablet ?? rows)
          : rows;

    const panel = document.createElement("div");
    panel.classList.add("pixelated-scroll-transition__panel");
    panel.setAttribute("data-pixelated-scroll-panel", "");

    const fragment = document.createDocumentFragment();
    for (let c = 0; c < cols; c += 1) {
      const col = document.createElement("div");
      col.classList.add("pixelated-scroll-transition__col");
      col.setAttribute("data-pixelated-scroll-column", "");
      for (let r = 0; r < rowCount; r += 1) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-scroll-transition__pixel");
        pixel.setAttribute("data-pixelated-scroll-pixel", "");
        col.appendChild(pixel);
      }
      fragment.appendChild(col);
    }
    panel.appendChild(fragment);
    wrapper.appendChild(panel);

    const columnEls = panel.querySelectorAll(
      "[data-pixelated-scroll-column]"
    );
    const cellData: { element: Element; priority: number }[] = [];

    for (let r = 0; r < rowCount; r += 1) {
      columnEls.forEach((col, c) => {
        const pixel = col.children[r];
        if (!pixel) return;

        // Bias the randomness so pixels generally reveal bottom-to-top
        // while keeping a scattered, organic feel.
        const dist = rowCount - 1 - r;
        const priority =
          dist * 50 + Math.random() * 300 + Math.sin(c * 0.3) * 30;

        cellData.push({ element: pixel, priority });
      });
    }

    cellData.sort((a, b) => a.priority - b.priority);
    const cells = cellData.map((d) => d.element);

    const fromAlpha = mode === "cover" ? 0 : 1;
    const toAlpha = mode === "cover" ? 1 : 0;

    gsap.set(cells, { autoAlpha: fromAlpha });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        scroller: document.body,
        start: scrollStart ?? (mode === "cover" ? "bottom bottom" : "top bottom"),
        end: scrollEnd ?? (mode === "cover" ? "bottom top" : "top center"),
        scrub: SCRUB,
        invalidateOnRefresh: true,
      },
    });

    tl.to(cells, {
      autoAlpha: toAlpha,
      duration: PIXEL_DURATION,
      stagger: { amount: STAGGER_AMOUNT, from: "start" },
      ease: "none",
    });

    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      panel.remove();
    };
  }, [
    locomotiveScroll,
    columns,
    columnsTablet,
    columnsLandscape,
    columnsMobile,
    rows,
    rowsTablet,
    rowsLandscape,
    rowsMobile,
    mode,
    scrollStart,
    scrollEnd,
  ]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      data-pixelated-scroll-transition=""
      data-mode={mode}
      data-pixel-ratio={pixelRatio}
      className={["pixelated-scroll-transition", className]
        .filter(Boolean)
        .join(" ")}
      style={color ? { color } : undefined}
    />
  );
}
