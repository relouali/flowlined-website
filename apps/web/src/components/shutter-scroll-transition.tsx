"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

import "./shutter-scroll-transition.css";

type ShutterScrollTransitionProps = {
  rows?: number;
  rowsTablet?: number;
  rowsMobile?: number;
  mode?: "cover" | "reveal";
  color?: string;
  className?: string;
};

export default function ShutterScrollTransition({
  rows = 16,
  rowsTablet = 10,
  rowsMobile = 6,
  mode = "cover",
  color,
  className,
}: ShutterScrollTransitionProps) {
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

    const rowCount = window.matchMedia("(max-width: 767px)").matches
      ? rowsMobile
      : window.matchMedia("(max-width: 991px)").matches
        ? rowsTablet
        : rows;

    const panel = document.createElement("div");
    panel.classList.add("shutter-scroll-transition__panel");

    for (let i = 0; i < rowCount; i += 1) {
      const row = document.createElement("div");
      row.classList.add("shutter-scroll-transition__row");
      panel.appendChild(row);
    }

    wrapper.appendChild(panel);

    const rowList = Array.from(panel.children) as HTMLElement[];

    const fromScale = mode === "cover" ? 0 : 1;
    const toScale = mode === "cover" ? 1 : 0;
    const origin = mode === "cover" ? "bottom center" : "top center";

    gsap.set(rowList, {
      scaleY: fromScale,
      transformOrigin: origin,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        scroller: document.body,
        start: mode === "cover" ? "bottom bottom" : "top bottom",
        end: mode === "cover" ? "bottom top" : "top center",
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });

    tl.to(rowList, {
      scaleY: toScale,
      duration: 0.1,
      stagger: { each: 0.01, from: "end" },
      ease: "none",
    });

    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      panel.remove();
    };
  }, [locomotiveScroll, rows, rowsTablet, rowsMobile, mode]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={["shutter-scroll-transition", className]
        .filter(Boolean)
        .join(" ")}
      style={color ? { color } : undefined}
    />
  );
}
