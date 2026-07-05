import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GRID_MQ = "(min-width: 640px)";

function getGridTargets(root: ParentNode | HTMLElement) {
  if (
    root instanceof HTMLElement &&
    root.classList.contains("process-steps-grid")
  ) {
    return [root];
  }

  return Array.from(
    root.querySelectorAll<HTMLElement>(".process-steps-grid"),
  );
}

export function initProcessGridLines(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger);

  if (!window.matchMedia(GRID_MQ).matches) {
    return () => {};
  }

  const contexts: Array<ReturnType<typeof gsap.context>> = [];

  getGridTargets(root).forEach((grid) => {
    const items = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-process-grid-item]"),
    );

    if (!items.length) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          scroller: document.body,
          start: "top 94%",
          end: "top 28%",
          scrub: true,
        },
      });

      // Only the crosshairs that are actually rendered (display:block) for this
      // breakpoint — the 9 unique grid nodes.
      const corners = Array.from(
        grid.querySelectorAll<HTMLElement>(".process-step__corner"),
      ).filter((el) => getComputedStyle(el).display !== "none");

      gsap.set(corners, {
        autoAlpha: 0,
        scale: 0.4,
        transformOrigin: "center center",
      });

      items.forEach((item, index) => {
        const horizontalLines = item.querySelectorAll<HTMLElement>(
          '[data-process-grid-line="h"]',
        );
        const verticalLines = item.querySelectorAll<HTMLElement>(
          '[data-process-grid-line="v"]',
        );

        gsap.set(horizontalLines, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(verticalLines, {
          scaleY: 0,
          transformOrigin: "top center",
        });

        const itemOffset = index * 0.12;

        masterTl.to(
          horizontalLines,
          { scaleX: 1, duration: 0.45, ease: "none", stagger: 0.04 },
          itemOffset,
        );
        masterTl.to(
          verticalLines,
          { scaleY: 1, duration: 0.45, ease: "none", stagger: 0.04 },
          itemOffset + 0.05,
        );
      });

      // Pop the "+" registration marks in once the frame has mostly drawn.
      if (corners.length) {
        masterTl.to(
          corners,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.18,
            ease: "back.out(2)",
            stagger: 0.03,
          },
          0.55,
        );
      }
    }, grid);

    contexts.push(ctx);
  });

  ScrollTrigger.refresh();

  return () => {
    contexts.forEach((ctx) => ctx.revert());
    ScrollTrigger.refresh();
  };
}
