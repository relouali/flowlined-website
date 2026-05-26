import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

type SplitTextInstance = {
  revert: () => void;
  chars: Element[];
  words: Element[];
};

export function initStickyTitleScroll(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const wraps = Array.from(
    root instanceof HTMLElement && root.hasAttribute("data-sticky-title")
      ? [root]
      : root.querySelectorAll<HTMLElement>('[data-sticky-title="wrap"]'),
  );

  const splits: SplitTextInstance[] = [];
  const triggers: ScrollTrigger[] = [];

  wraps.forEach((wrap) => {
    const headings = Array.from(
      wrap.querySelectorAll<HTMLElement>('[data-sticky-title="heading"]'),
    );

    if (headings.length === 0) return;

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        scroller: document.body,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      },
    });

    if (masterTl.scrollTrigger) {
      triggers.push(masterTl.scrollTrigger);
    }

    const revealDuration = 0.7;
    const fadeOutDuration = 0.7;
    const overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      heading.setAttribute("aria-label", heading.textContent ?? "");

      const split = new SplitText(heading, {
        type: "words,chars",
      }) as unknown as SplitTextInstance;

      splits.push(split);

      split.words.forEach((word) => word.setAttribute("aria-hidden", "true"));

      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();

      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration,
      });

      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration,
        });
      }

      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });

  ScrollTrigger.refresh();

  return () => {
    triggers.forEach((trigger) => trigger.kill());
    splits.forEach((split) => split.revert());
    ScrollTrigger.refresh();
  };
}
