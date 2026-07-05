import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DESKTOP_GRID_MQ = "(min-width: 640px)";

function getTrackTargets(root: ParentNode | HTMLElement) {
  if (
    root instanceof HTMLElement &&
    root.classList.contains("case-study-section__stats-track")
  ) {
    return [root];
  }

  return Array.from(
    root.querySelectorAll<HTMLElement>(".case-study-section__stats-track"),
  );
}

export function initCaseStudyGrid(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger);

  if (!window.matchMedia(DESKTOP_GRID_MQ).matches) {
    return () => {};
  }

  const contexts: Array<ReturnType<typeof gsap.context>> = [];

  getTrackTargets(root).forEach((track) => {
    const items = Array.from(
      track.querySelectorAll<HTMLElement>("[data-case-study-grid-item]"),
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
        const kpi = item.querySelector<HTMLElement>(
          '[data-case-study-grid-content="kpi"]',
        );
        const copy = item.querySelector<HTMLElement>(
          '[data-case-study-grid-content="copy"]',
        );

        if (kpi) {
          gsap.set(kpi, { yPercent: 50, autoAlpha: 0 });
        }
        if (copy) {
          gsap.set(copy, { autoAlpha: 0 });
        }

        const itemOffset = index * 0.16;

        if (kpi) {
          masterTl.to(
            kpi,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "none",
            },
            itemOffset,
          );
        }

        if (copy) {
          masterTl.to(
            copy,
            {
              autoAlpha: 1,
              duration: 0.5,
              ease: "none",
            },
            itemOffset + 0.12,
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
