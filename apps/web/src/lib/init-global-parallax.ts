import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initGlobalParallax() {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)",
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions ?? {};

      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
          const disable = trigger.getAttribute("data-parallax-disable");

          if (
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet)
          ) {
            return;
          }

          const target = trigger.querySelector('[data-parallax="target"]') || trigger;
          const direction = trigger.getAttribute("data-parallax-direction") || "vertical";
          const prop = direction === "horizontal" ? "xPercent" : "yPercent";

          const scrubAttr = trigger.getAttribute("data-parallax-scrub");
          const scrub =
            scrubAttr === null || scrubAttr === "true" ? true : parseFloat(scrubAttr);

          const startAttr = trigger.getAttribute("data-parallax-start");
          const startVal = startAttr !== null ? parseFloat(startAttr) : 20;

          const endAttr = trigger.getAttribute("data-parallax-end");
          const endVal = endAttr !== null ? parseFloat(endAttr) : -20;

          const scrollStartRaw =
            trigger.getAttribute("data-parallax-scroll-start") || "top bottom";
          const scrollStart = `clamp(${scrollStartRaw})`;

          const scrollEndRaw =
            trigger.getAttribute("data-parallax-scroll-end") || "bottom top";
          const scrollEnd = `clamp(${scrollEndRaw})`;

          gsap.fromTo(
            target,
            { [prop]: startVal },
            {
              [prop]: endVal,
              ease: "none",
              scrollTrigger: {
                trigger,
                scroller: document.body,
                start: scrollStart,
                end: scrollEnd,
                scrub,
              },
            },
          );
        });
      });

      return () => ctx.revert();
    },
  );

  return () => mm.revert();
}
