"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

type StepsTimelineProps = {
  children: ReactNode;
};

export default function StepsTimeline({ children }: StepsTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !containerRef.current || !fillRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const fill = fillRef.current;
    const dots = Array.from(
      container.querySelectorAll<HTMLElement>("[data-step-dot]"),
    );

    gsap.set(fill, { height: 0 });

    const fillTween = gsap.to(fill, {
      height: () => container.offsetHeight,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        scroller: document.body,
        start: "top 65%",
        end: "bottom 65%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const dotTriggers = dots.map((dot) =>
      ScrollTrigger.create({
        trigger: dot,
        scroller: document.body,
        start: "top 65%",
        onEnter: () => dot.setAttribute("data-reached", "true"),
        onLeaveBack: () => dot.setAttribute("data-reached", "false"),
      }),
    );

    ScrollTrigger.refresh();

    return () => {
      fillTween.scrollTrigger?.kill();
      fillTween.kill();
      dotTriggers.forEach((trigger) => trigger.kill());
    };
  }, [locomotiveScroll]);

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 top-0 w-px bg-[#000c10]/15"
        style={{ left: "15.5px" }}
      />
      <div
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute top-0 w-px bg-gradient-to-b from-[#012A32] to-[#012A32]/20"
        style={{ left: "15.5px", height: 0 }}
      />
      {children}
    </div>
  );
}
