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
    root instanceof HTMLElement && root.matches('[data-sticky-title="wrap"]')
      ? [root]
      : root.querySelectorAll<HTMLElement>('[data-sticky-title="wrap"]'),
  );

  const splits: SplitTextInstance[] = [];
  const triggers: ScrollTrigger[] = [];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    wraps.forEach((wrap) => {
      wrap.querySelectorAll<HTMLElement>('[data-sticky-title="heading"]').forEach(
        (heading) => {
          gsap.set(heading, { autoAlpha: 1, visibility: "visible" });
        },
      );
    });
    return () => {};
  }

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
    const fadedValue = 0.2;

    headings.forEach((heading, index) => {
      heading.setAttribute("aria-label", heading.textContent ?? "");

      const split = new SplitText(heading, {
        type: "words,chars",
      }) as unknown as SplitTextInstance;

      splits.push(split);

      split.words.forEach((word) => word.setAttribute("aria-hidden", "true"));

      const isFirst = index === 0;
      const isLast = index === headings.length - 1;

      // First heading starts dimmed-but-visible; stacked headings start fully
      // hidden so they never overlap the line that's currently showing.
      gsap.set(heading, { visibility: "visible" });
      gsap.set(split.chars, { autoAlpha: isFirst ? fadedValue : 0 });

      const headingTl = gsap.timeline();

      // Reveal: brighten each character up to full opacity.
      headingTl.to(split.chars, {
        autoAlpha: 1,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration,
        ease: "linear",
      });

      if (!isLast) {
        headingTl.to(
          split.chars,
          {
            autoAlpha: 0,
            stagger: { amount: fadeOutDuration, from: "end" },
            duration: fadeOutDuration,
            ease: "linear",
          },
          ">",
        );
      }

      if (isFirst) {
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
