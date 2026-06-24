"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { transitionNavigate } from "@/components/page-transition-controller";
import Cta from "@/components/cta";
import TransitionLink from "@/components/transition-link";

import "./progress-nav.css";

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

export default function ProgressNav() {
  const navRef = useRef<HTMLElement>(null);
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

  // Reveal the dark surface once the page is scrolled away from the very top
  // (mirrors the hover state). Runs on every page.
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const setScrolled = (scrolled: boolean) =>
      navEl.classList.toggle("is--scrolled", scrolled);

    const lenis = locomotiveScroll?.lenisInstance;

    if (lenis) {
      const onScroll = () => setScrolled((lenis.scroll ?? 0) > 8);
      onScroll();
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [locomotiveScroll]);

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
    <nav ref={navRef} className="progress-nav" aria-label="Pagina navigatie">
      <div className="progress-nav__inner">
        <a className="progress-nav__logo" href="/" onClick={handleLogoClick}>
          <Image alt="Flowlined" fill priority src="/logo/full-Logo.svg" />
        </a>

        <div className="progress-nav__wrapper">
          <div className="progress-nav__list">
            {PROGRESS_NAV_ITEMS.map(({ href, label }) => (
              <NavButton key={href} href={href} label={label} />
            ))}
          </div>
        </div>

        <Cta href="#contact" onClick={(event) => handleNavigate(event, "#contact")}>
          Plan een gesprek
        </Cta>
      </div>
    </nav>
  );
}
