"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";

import "./logo-wall.css";

export type LogoWallLogo = {
  src: string;
  alt: string;
};

type LogoWallProps = {
  logos: ReadonlyArray<LogoWallLogo>;
  shuffle?: boolean;
  loopDelay?: number;
  duration?: number;
  className?: string;
};

export default function LogoWall({
  logos,
  shuffle = false,
  loopDelay = 1.5,
  duration = 0.9,
  className,
}: LogoWallProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!locomotiveScroll) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const list = root.querySelector<HTMLElement>("[data-logo-wall-list]");
    if (!list) return;

    const itemEls = Array.from(
      list.querySelectorAll<HTMLElement>("[data-logo-wall-item]"),
    );

    const shuffleFront =
      root.getAttribute("data-logo-wall-shuffle") !== "false";

    // Detach the original targets and keep them as the pool's seed so we
    // can restore them on cleanup (important for React Strict Mode + HMR).
    const originalTargets = itemEls
      .map((item) =>
        item.querySelector<HTMLElement>("[data-logo-wall-target]"),
      )
      .filter((el): el is HTMLElement => el !== null);

    let visibleItems: HTMLElement[] = [];
    let visibleCount = 0;
    let pool: HTMLElement[] = [];
    let pattern: number[] = [];
    let patternIndex = 0;
    let tl: gsap.core.Timeline | null = null;

    function isVisible(el: HTMLElement) {
      return window.getComputedStyle(el).display !== "none";
    }

    function shuffleArray<T>(arr: ReadonlyArray<T>): T[] {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function setup() {
      if (tl) tl.kill();

      visibleItems = itemEls.filter(isVisible);
      visibleCount = visibleItems.length;

      pattern = shuffleArray(
        Array.from({ length: visibleCount }, (_, i) => i),
      );
      patternIndex = 0;

      itemEls.forEach((item) => {
        item.querySelectorAll("[data-logo-wall-target]").forEach((old) => {
          old.remove();
        });
      });

      pool = originalTargets.map(
        (n) => n.cloneNode(true) as HTMLElement,
      );

      let front: HTMLElement[];
      let rest: HTMLElement[];
      if (shuffleFront) {
        const shuffledAll = shuffleArray(pool);
        front = shuffledAll.slice(0, visibleCount);
        rest = shuffleArray(shuffledAll.slice(visibleCount));
      } else {
        front = pool.slice(0, visibleCount);
        rest = shuffleArray(pool.slice(visibleCount));
      }
      pool = front.concat(rest);

      for (let i = 0; i < visibleCount; i += 1) {
        const parent =
          visibleItems[i].querySelector<HTMLElement>(
            "[data-logo-wall-target-parent]",
          ) || visibleItems[i];
        const next = pool.shift();
        if (next) parent.appendChild(next);
      }

      tl = gsap.timeline({ repeat: -1, repeatDelay: loopDelay });
      tl.call(swapNext);
      tl.play();
    }

    function swapNext() {
      const nowCount = itemEls.filter(isVisible).length;
      if (nowCount !== visibleCount) {
        setup();
        return;
      }
      if (!pool.length) return;

      const idx = pattern[patternIndex % visibleCount];
      patternIndex += 1;

      const container = visibleItems[idx];
      const parent =
        container.querySelector<HTMLElement>(
          "[data-logo-wall-target-parent]",
        ) || container;

      const existing = parent.querySelectorAll("[data-logo-wall-target]");
      if (existing.length > 1) return;

      const current = parent.querySelector<HTMLElement>(
        "[data-logo-wall-target]",
      );
      const incoming = pool.shift();
      if (!incoming) return;

      gsap.set(incoming, { yPercent: 50, autoAlpha: 0 });
      parent.appendChild(incoming);

      if (current) {
        gsap.to(current, {
          yPercent: -50,
          autoAlpha: 0,
          duration,
          ease: "expo.inOut",
          onComplete: () => {
            current.remove();
            pool.push(current);
          },
        });
      }

      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        delay: 0.1,
        ease: "expo.inOut",
      });
    }

    setup();

    const scrollTrigger = ScrollTrigger.create({
      trigger: root,
      scroller: document.body,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => tl?.play(),
      onLeave: () => tl?.pause(),
      onEnterBack: () => tl?.play(),
      onLeaveBack: () => tl?.pause(),
    });

    const onVisibilityChange = () => {
      if (document.hidden) tl?.pause();
      else tl?.play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (tl) tl.kill();
      scrollTrigger.kill();
      document.removeEventListener("visibilitychange", onVisibilityChange);

      // Wipe whatever is currently in the items so we don't accumulate
      // duplicate clones across HMR / Strict-Mode double-mount cycles.
      itemEls.forEach((item) => {
        item.querySelectorAll("[data-logo-wall-target]").forEach((el) => {
          el.remove();
        });
      });

      // Re-attach the original (detached) targets so the next mount sees
      // the same DOM the first one did.
      itemEls.forEach((item, i) => {
        const original = originalTargets[i];
        if (!original) return;
        const parent =
          item.querySelector<HTMLElement>(
            "[data-logo-wall-target-parent]",
          ) || item;
        parent.appendChild(original);
      });
    };
  }, [locomotiveScroll, logos, shuffle, loopDelay, duration]);

  return (
    <div
      ref={rootRef}
      data-logo-wall-cycle-init
      data-logo-wall-shuffle={shuffle ? "true" : "false"}
      className={["logo-wall", className].filter(Boolean).join(" ")}
    >
      <div className="logo-wall__collection">
        <div data-logo-wall-list className="logo-wall__list">
          {logos.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              data-logo-wall-item
              className="logo-wall__item"
            >
              <div
                data-logo-wall-target-parent
                className="logo-wall__logo"
              >
                <div className="logo-wall__logo-before" />
                <div
                  data-logo-wall-target
                  className="logo-wall__logo-target"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    width={100}
                    className="logo-wall__logo-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
