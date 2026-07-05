import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function getGroupTargets(root: ParentNode | HTMLElement) {
  if (root instanceof HTMLElement && root.hasAttribute("data-scroll-fade-group")) {
    return [root];
  }

  return Array.from(root.querySelectorAll("[data-scroll-fade-group]")).filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
}

export function initScrollFadeGroup(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger);

  const cleanups: Array<() => void> = [];

  getGroupTargets(root).forEach((group) => {
    const items = Array.from(
      group.querySelectorAll<HTMLElement>("[data-scroll-fade-item]"),
    );

    if (!items.length) return;

    const stagger = parseFloat(
      group.getAttribute("data-scroll-fade-stagger") || "0.12",
    );
    const start = group.getAttribute("data-scroll-fade-start") || "top 88%";
    const y = parseFloat(group.getAttribute("data-scroll-fade-y") || "32");

    gsap.set(items, { y, autoAlpha: 0 });

    const tween = gsap.to(items, {
      y: 0,
      autoAlpha: 1,
      duration: 0.85,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        scroller: document.body,
        start,
        once: true,
      },
      onComplete: () => {
        group.classList.add("is--inview");
        items.forEach((item) => item.classList.add("is--inview"));
        gsap.set(items, { clearProps: "transform" });
      },
    });

    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
      group.classList.remove("is--inview");
      items.forEach((item) => {
        item.classList.remove("is--inview");
        gsap.set(item, { clearProps: "all" });
      });
    });
  });

  ScrollTrigger.refresh();

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    ScrollTrigger.refresh();
  };
}
