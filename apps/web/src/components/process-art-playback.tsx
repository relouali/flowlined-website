"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

type ProcessArtPlaybackProps = {
  children: ReactNode;
};

export default function ProcessArtPlayback({ children }: ProcessArtPlaybackProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;

    const trigger = ScrollTrigger.create({
      trigger: track,
      scroller: document.body,
      start: "top 48%",
      onEnter: () => {
        track.querySelectorAll<HTMLElement>(".process-art").forEach((art) => {
          art.classList.add("is--playing");
        });
      },
      onLeaveBack: () => {
        track.querySelectorAll<HTMLElement>(".process-art").forEach((art) => {
          art.classList.remove("is--playing");
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [locomotiveScroll]);

  return (
    <ol ref={trackRef} className="horizontal-steps__track">
      {children}
    </ol>
  );
}
