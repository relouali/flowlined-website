"use client";

import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { transitionNavigate } from "@/components/page-transition-controller";
import MobileNav from "@/components/mobile-nav";
import TransitionLink from "@/components/transition-link";

import "./progress-nav.css";

gsap.registerPlugin(Flip, ScrollTrigger);

const FLIP_DURATION = 0.4;

export const PROGRESS_NAV_ITEMS = [
  { href: "/over-ons", label: "Ons verhaal" },
  { href: "/talent", label: "Talent" },
  { href: "/cases/ado-pro", label: "ADO Pro" },


] as const;

function NavButton({ href, label }: { href: string; label: string }) {
  return (
    <TransitionLink className="progress-nav__btn" href={href}>
      <span className="progress-nav__btn-text">{label}</span>
    </TransitionLink>
  );
}

function NavContactButton({
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      className="progress-nav__btn progress-nav__btn--contact"
      href="#contact"
      onClick={onClick}
    >
      <span className="progress-nav__btn-text">Plan een gesprek</span>
      <ArrowSquareOutIcon
        aria-hidden
        className="progress-nav__btn-icon"
        weight="regular"
      />
    </a>
  );
}

export default function ProgressNav() {
  const navRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (isHome) {
      // Already home: smooth-scroll back to the top.
      if (locomotiveScroll) {
        locomotiveScroll.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    transitionNavigate("/");
  }

  function handleNavigate(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    // Smooth-scroll when the target section exists on the current page
    // (e.g. the home page, or the footer's #contact on any page).
    const target =
      typeof document !== "undefined" ? document.querySelector(href) : null;

    if (target) {
      event.preventDefault();

      if (locomotiveScroll) {
        locomotiveScroll.scrollTo(href, { duration: 1.2, offset: -96 });
        return;
      }

      target.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Otherwise the section lives on the home page — navigate there.
    if (!isHome) {
      event.preventDefault();
      window.location.href = `/${href}`;
    }
  }

  // Two scroll behaviours, both driven off the same handler:
  //   1. Reveal the dark surface once scrolled away from the very top
  //      (mirrors the hover state).
  //   2. Past the hero / first section, hide the nav while scrolling down and
  //      bring it back while scrolling up. Within the first section the nav is
  //      always shown. The hide state lives on <body> so both the desktop bar
  //      and the mobile pill can react to it via CSS.
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const lenis = locomotiveScroll?.lenisInstance;
    const getScroll = () => (lenis ? lenis.scroll ?? 0 : window.scrollY);

    const setHidden = (hidden: boolean) =>
      document.body.classList.toggle("nav--hidden", hidden);

    const flipTargets = () =>
      [surfaceRef.current, logoRef.current, wrapperRef.current].filter(
        Boolean,
      ) as Element[];

    let flipTween: gsap.core.Animation | null = null;

    const applyScrolled = (scrolled: boolean, animate = true) => {
      if (!navEl || navEl.classList.contains("is--scrolled") === scrolled) return;

      const targets = flipTargets();
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!animate || reducedMotion || targets.length === 0) {
        flipTween?.kill();
        flipTween = null;
        navEl.classList.toggle("is--scrolled", scrolled);
        return;
      }

      flipTween?.kill();
      const state = Flip.getState(targets);
      navEl.classList.toggle("is--scrolled", scrolled);

      flipTween = Flip.from(state, {
        duration: FLIP_DURATION,
        ease: "power2.out",
        simple: true,
        onComplete: () => {
          flipTween = null;
        },
      });
    };

    // Hysteresis avoids flicker when crossing the top threshold.
    const SCROLL_ENTER = 28;
    const SCROLL_EXIT = 4;
    let isScrolled = getScroll() > SCROLL_ENTER;

    // Absolute document position of the first section's bottom edge.
    let heroBottom = window.innerHeight;
    const computeHeroBottom = () => {
      const first = document.querySelector("main")?.firstElementChild;
      heroBottom = first
        ? first.getBoundingClientRect().bottom + getScroll()
        : window.innerHeight;
    };

    // Direction is accumulated: lastScroll only advances once the move is
    // larger than the dead-zone, so smooth-scroll jitter doesn't flip the bar.
    const DEAD_ZONE = 6;
    let lastScroll = getScroll();

    const onScroll = () => {
      const y = getScroll();

      if (!isScrolled && y > SCROLL_ENTER) {
        isScrolled = true;
        applyScrolled(true);
      } else if (isScrolled && y < SCROLL_EXIT) {
        isScrolled = false;
        applyScrolled(false);
      }

      if (y <= heroBottom + 1) {
        setHidden(false);
        lastScroll = y;
        return;
      }

      const delta = y - lastScroll;
      if (Math.abs(delta) < DEAD_ZONE) return;
      setHidden(delta > 0);
      lastScroll = y;
    };

    applyScrolled(isScrolled, false);
    setHidden(false);
    computeHeroBottom();
    // Recompute once layout has settled (images/fonts can change section height).
    const raf = requestAnimationFrame(computeHeroBottom);

    window.addEventListener("resize", computeHeroBottom);
    ScrollTrigger.addEventListener("refresh", computeHeroBottom);

    if (lenis) {
      lenis.on("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", computeHeroBottom);
      ScrollTrigger.removeEventListener("refresh", computeHeroBottom);
      if (lenis) {
        lenis.off("scroll", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
      }
      flipTween?.kill();
      setHidden(false);
    };
    // `pathname` re-binds the handler per route so heroBottom tracks the new
    // page's first section (the nav itself never remounts).
  }, [locomotiveScroll, pathname]);

  useEffect(() => {
    if (!locomotiveScroll || !isHome) return;

    const anchors = gsap.utils.toArray<HTMLElement>("[data-progress-nav-anchor]");
    const navEl = navRef.current;

    function setNavLight(isLight: boolean) {
      if (!navEl) return;
      navEl.classList.toggle("is--light", isLight);
    }

    const themeTriggers = anchors
      .filter((anchor) => anchor.getAttribute("data-nav-theme") === "light")
      .map((anchor) =>
        ScrollTrigger.create({
          trigger: anchor,
          scroller: document.body,
          start: "top top",
          end: "bottom top",
          onEnter: () => setNavLight(true),
          onLeave: () => setNavLight(false),
          onEnterBack: () => setNavLight(true),
          onLeaveBack: () => setNavLight(false),
        }),
      );

    const initialLight = anchors.some((anchor) => {
      if (anchor.getAttribute("data-nav-theme") !== "light") return false;
      const rect = anchor.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > 0;
    });
    setNavLight(initialLight);

    ScrollTrigger.refresh();

    return () => {
      themeTriggers.forEach((trigger) => trigger.kill());
    };
    // `pathname` rebuilds the triggers on every client-side navigation so they
    // bind to the new page's sections (the nav itself never remounts).
  }, [locomotiveScroll, isHome, pathname]);

  // Sub-pages (e.g. case detail) render on a white background, so the nav
  // defaults to its light (dark-text) theme. Sections marked
  // data-nav-theme="dark" (e.g. the manifest + footer) flip it back to the
  // dark-background theme while they sit under the nav.
  useEffect(() => {
    if (isHome) return;

    const navEl = navRef.current;
    if (!navEl) return;

    const setNavLight = (isLight: boolean) => {
      navEl.classList.toggle("is--light", isLight);
    };

    setNavLight(true);

    if (!locomotiveScroll) return;

    const darkSections = gsap.utils.toArray<HTMLElement>(
      '[data-nav-theme="dark"]',
    );

    const triggers = darkSections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        scroller: document.body,
        start: "top top",
        end: "bottom top",
        onEnter: () => setNavLight(false),
        onLeave: () => setNavLight(true),
        onEnterBack: () => setNavLight(false),
        onLeaveBack: () => setNavLight(true),
      }),
    );

    const initialDark = darkSections.some((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > 0;
    });
    setNavLight(!initialDark);

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
    // `pathname` rebuilds the triggers on every client-side navigation so they
    // bind to the new page's data-nav-theme sections.
  }, [isHome, locomotiveScroll, pathname]);

  return (
    <>
    <nav ref={navRef} className="progress-nav" aria-label="Pagina navigatie">
      <div className="progress-nav__track">
        <div className="progress-nav__pill">
          <div
            ref={surfaceRef}
            aria-hidden
            className="progress-nav__surface"
          />
          <a
            ref={logoRef}
            aria-label="Flowlined home"
            className="progress-nav__logo"
            href="/"
            onClick={handleLogoClick}
          >
            <span className="progress-nav__logo-full">
              <Image
                alt=""
                aria-hidden
                className="object-contain object-left"
                fill
                priority
                sizes="149px"
                src="/logo/full-Logo.svg"
              />
            </span>
            <span className="progress-nav__logo-emblem">
              <Image
                alt=""
                aria-hidden
                className="object-contain"
                fill
                priority
                sizes="24px"
                src="/images/flowlined-logo.svg"
              />
            </span>
          </a>

          <div ref={wrapperRef} className="progress-nav__wrapper">
            <div className="progress-nav__list">
              {PROGRESS_NAV_ITEMS.map(({ href, label }) => (
                <NavButton key={href} href={href} label={label} />
              ))}
              <NavContactButton
                onClick={(event) => handleNavigate(event, "#contact")}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
    <MobileNav />
    </>
  );
}
