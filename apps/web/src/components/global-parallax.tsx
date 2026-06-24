"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initGlobalParallax } from "@/lib/init-global-parallax";

export default function GlobalParallax() {
  const { locomotiveScroll } = useLocomotiveScroll();
  const pathname = usePathname();

  useEffect(() => {
    if (!locomotiveScroll) return;

    const revertParallax = initGlobalParallax();
    ScrollTrigger.refresh();

    return () => {
      revertParallax();
    };
    // `pathname` re-wires the parallax triggers on every client-side navigation
    // so they bind to the new page's [data-parallax] elements.
  }, [locomotiveScroll, pathname]);

  return null;
}
