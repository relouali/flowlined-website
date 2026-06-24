"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { registerTransitionNavigate } from "@/components/page-transition-controller";

import "./page-transition.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
  if (!CustomEase.get("osmo")) {
    CustomEase.create("osmo", "0.625, 0.05, 0, 1");
  }
}

const PANEL_COUNT = 5;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PageTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { locomotiveScroll } = useLocomotiveScroll();

  const wrapRef = useRef<HTMLDivElement>(null);

  // Href we navigated to during a cover animation; the reveal fires once the
  // matching pathname has mounted.
  const pendingHrefRef = useRef<string | null>(null);
  // Guards against re-entrant navigations while a wipe is in flight.
  const animatingRef = useRef(false);

  // Latest values, read inside the registered (stable) navigate function.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const locoRef = useRef(locomotiveScroll);
  locoRef.current = locomotiveScroll;

  const getColumns = () => {
    const wrap = wrapRef.current;
    if (!wrap) return [] as HTMLElement[];
    return Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-transition-column]"),
    );
  };

  const getLines = () =>
    wrapRef.current?.querySelector<HTMLElement>(".transition__lines") ?? null;

  // Reset scroll to the top and let Locomotive + ScrollTrigger recompute against
  // the new page's height.
  const settle = () => {
    window.scrollTo(0, 0);
    const loco = locoRef.current;
    if (loco) {
      try {
        loco.scrollTo(0, { immediate: true });
      } catch {
        /* noop */
      }
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  // Register the navigate implementation for links to call. Stable across
  // renders (reads live values via refs), so it only registers once.
  useEffect(() => {
    const navigate = (href: string) => {
      if (!href || href === pathnameRef.current || animatingRef.current) return;

      const columns = getColumns();

      if (prefersReducedMotion() || columns.length === 0) {
        router.push(href as Route);
        return;
      }

      animatingRef.current = true;
      pendingHrefRef.current = href;

      const wrap = wrapRef.current;
      const lines = getLines();
      gsap.killTweensOf(columns);
      if (lines) gsap.killTweensOf(lines);

      const tl = gsap.timeline({
        defaults: { ease: "osmo" },
        onComplete: () => {
          router.push(href as Route);
        },
      });

      // Make the overlay visible, then slide the columns down to cover the
      // screen, staggered from the right edge.
      tl.set(wrap, { autoAlpha: 1 }, 0);
      tl.fromTo(
        columns,
        { yPercent: 0 },
        {
          yPercent: 100,
          duration: 0.6,
          stagger: { each: 0.06, from: "end" },
        },
        0,
      );
      // The grid moves as one block, in lock-step with the panels.
      if (lines) {
        tl.fromTo(lines, { yPercent: 0 }, { yPercent: 100, duration: 0.6 }, 0);
      }
    };

    registerTransitionNavigate(navigate);
    return () => registerTransitionNavigate(null);
  }, [router]);

  // Once the pending route has mounted, continue the columns downward to reveal
  // the new page.
  useEffect(() => {
    if (pendingHrefRef.current === null) return;
    pendingHrefRef.current = null;

    const columns = getColumns();
    const lines = getLines();
    const wrap = wrapRef.current;

    settle();

    const finish = () => {
      gsap.set(columns, { yPercent: 0 });
      if (lines) gsap.set(lines, { yPercent: 0 });
      gsap.set(wrap, { autoAlpha: 0 });
      animatingRef.current = false;
    };

    if (prefersReducedMotion() || columns.length === 0) {
      finish();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "osmo" }, onComplete: finish });
    tl.to(
      columns,
      {
        yPercent: 200,
        duration: 0.6,
        stagger: 0.06,
        overwrite: "auto",
      },
      0,
    );
    // Grid uncovers together with the panels so it never sits over the new page.
    if (lines) {
      tl.to(lines, { yPercent: 200, duration: 0.6, overwrite: "auto" }, 0);
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {children}
      <div ref={wrapRef} className="transition" aria-hidden>
        <div className="transition__panels">
          {Array.from({ length: PANEL_COUNT }).map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              data-transition-column
              className="transition__panel"
            />
          ))}
        </div>
        <div className="transition__lines">
          {Array.from({ length: PANEL_COUNT }).map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`transition__line${
                i === PANEL_COUNT - 1 ? " is--last" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
