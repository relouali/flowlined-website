"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initGlobalParallax } from "@/lib/init-global-parallax";

export default function GlobalParallax() {
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll) return;

    const revertParallax = initGlobalParallax();
    ScrollTrigger.refresh();

    return () => {
      revertParallax();
    };
  }, [locomotiveScroll]);

  return null;
}
