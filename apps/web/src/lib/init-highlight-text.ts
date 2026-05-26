import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

type SplitTextInstance = {
  revert: () => void;
  chars: Element[];
};

function getHighlightTargets(root: ParentNode | HTMLElement) {
  if (root instanceof HTMLElement && root.hasAttribute("data-highlight-text")) {
    return [root];
  }

  return Array.from(root.querySelectorAll("[data-highlight-text]")).filter(
    (heading): heading is HTMLElement => heading instanceof HTMLElement,
  );
}

export function initHighlightText(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const splits: SplitTextInstance[] = [];

  getHighlightTargets(root).forEach((heading) => {
    const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 90%";
    const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%";
    const fadedValue = parseFloat(heading.getAttribute("data-highlight-fade") || "0.2");
    const staggerValue = parseFloat(heading.getAttribute("data-highlight-stagger") || "0.1");

    const split = new SplitText(heading, {
      type: "words,chars",
      autoSplit: true,
      onSplit(self) {
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              scrub: true,
              trigger: heading,
              scroller: document.body,
              start: scrollStart,
              end: scrollEnd,
            },
          });

          tl.from(self.chars, {
            autoAlpha: fadedValue,
            stagger: staggerValue,
            ease: "linear",
          });
        });

        return ctx;
      },
    }) as unknown as SplitTextInstance;

    splits.push(split);
  });

  ScrollTrigger.refresh();

  return () => {
    splits.forEach((split) => split.revert());
    ScrollTrigger.refresh();
  };
}
