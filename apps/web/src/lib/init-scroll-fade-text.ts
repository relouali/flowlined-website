import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function getFadeTargets(root: ParentNode | HTMLElement) {
  if (root instanceof HTMLElement && root.hasAttribute("data-scroll-fade")) {
    return [root];
  }

  return Array.from(root.querySelectorAll("[data-scroll-fade]")).filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
}

export function initScrollFadeText(root: ParentNode | HTMLElement = document) {
  gsap.registerPlugin(ScrollTrigger);

  const cleanups: Array<() => void> = [];

  getFadeTargets(root).forEach((el) => {
    const delay = parseFloat(el.getAttribute("data-scroll-fade-delay") || "0");
    const start = el.getAttribute("data-scroll-fade-start") || "top 88%";
    const y = parseFloat(el.getAttribute("data-scroll-fade-y") || "28");

    gsap.set(el, { y, autoAlpha: 0 });

    const tween = gsap.to(el, {
      y: 0,
      autoAlpha: 1,
      duration: 0.85,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        scroller: document.body,
        start,
        once: true,
      },
      onComplete: () => {
        el.classList.add("is--inview");
        gsap.set(el, { clearProps: "transform" });
      },
    });

    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.classList.remove("is--inview");
      gsap.set(el, { clearProps: "all" });
    });
  });

  ScrollTrigger.refresh();

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    ScrollTrigger.refresh();
  };
}
