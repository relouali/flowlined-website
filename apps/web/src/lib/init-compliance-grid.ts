import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DESKTOP_GRID_MQ = "(min-width: 640px)";

function getTrackTargets(root: ParentNode | HTMLElement) {
  if (root instanceof HTMLElement && root.classList.contains("compliance-grid")) {
    return [root];
  }

  return Array.from(root.querySelectorAll<HTMLElement>(".compliance-grid"));
}

export function initComplianceGrid(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger);

  if (!window.matchMedia(DESKTOP_GRID_MQ).matches) {
    return () => {};
  }

  const contexts: Array<ReturnType<typeof gsap.context>> = [];

  getTrackTargets(root).forEach((track) => {
    const items = Array.from(
      track.querySelectorAll<HTMLElement>("[data-compliance-grid-item]"),
    );

    if (!items.length) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          scroller: document.body,
          start: "top 95%",
          end: "top 42%",
          scrub: 0.8,
        },
      });

      items.forEach((item, index) => {
        const icon = item.querySelector<HTMLElement>(
          '[data-compliance-grid-content="icon"]',
        );
        const copy = item.querySelector<HTMLElement>(
          '[data-compliance-grid-content="copy"]',
        );
        const horizontalLines = item.querySelectorAll<HTMLElement>(
          '[data-compliance-grid-line="h"]',
        );
        const verticalLines = item.querySelectorAll<HTMLElement>(
          '[data-compliance-grid-line="v"]',
        );

        if (icon) {
          gsap.set(icon, { yPercent: 50, autoAlpha: 0 });
        }
        if (copy) {
          gsap.set(copy, { autoAlpha: 0 });
        }
        gsap.set(horizontalLines, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(verticalLines, {
          scaleY: 0,
          transformOrigin: "top center",
        });

        const itemOffset = index * 0.16;

        masterTl.to(
          horizontalLines,
          {
            scaleX: 1,
            duration: 0.45,
            ease: "none",
            stagger: 0.04,
          },
          itemOffset,
        );
        masterTl.to(
          verticalLines,
          {
            scaleY: 1,
            duration: 0.45,
            ease: "none",
            stagger: 0.04,
          },
          itemOffset + 0.04,
        );

        if (copy) {
          masterTl.to(
            copy,
            {
              autoAlpha: 1,
              duration: 0.5,
              ease: "none",
            },
            itemOffset + 0.08,
          );
        }

        if (icon) {
          masterTl.to(
            icon,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "none",
            },
            itemOffset + 0.16,
          );
        }
      });
    }, track);

    contexts.push(ctx);
  });

  ScrollTrigger.refresh();

  return () => {
    contexts.forEach((ctx) => ctx.revert());
    ScrollTrigger.refresh();
  };
}
