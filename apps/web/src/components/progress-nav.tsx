"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import Cta from "@/components/cta";

import "./progress-nav.css";

export const PROGRESS_NAV_ITEMS = [
  { id: "top", label: "Intro" },
  { id: "probleem", label: "Probleem" },
  { id: "proces", label: "Proces" },
  { id: "sectoren", label: "Sectoren" },
  { id: "ado-pro", label: "ADO Pro" },
] as const;

function NavButton({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <a
      className="progress-nav__btn"
      data-progress-nav-target={href}
      href={href}
      onClick={(event) => onNavigate(event, href)}
    >
      <span className="progress-nav__btn-text">{label}</span>
      <span className="progress-nav__btn-text is--duplicate">{label}</span>
    </a>
  );
}

export default function ProgressNav() {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  useEffect(() => {
    if (!locomotiveScroll || !isHome) return;

    const navList = listRef.current;
    const indicator = indicatorRef.current;
    if (!navList || !indicator) return;

    const nav = navList;
    const indicatorEl = indicator;

    function updateIndicator(activeLink: Element) {
      const parentWidth = nav.offsetWidth;
      const parentHeight = nav.offsetHeight;
      const parentRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const linkPos = {
        left: linkRect.left - parentRect.left,
        top: linkRect.top - parentRect.top,
      };

      indicatorEl.style.left = `${(linkPos.left / parentWidth) * 100}%`;
      indicatorEl.style.top = `${(linkPos.top / parentHeight) * 100}%`;
      indicatorEl.style.width = `${(activeLink.clientWidth / parentWidth) * 100}%`;
      indicatorEl.style.height = `${(activeLink.clientHeight / parentHeight) * 100}%`;
    }

    function setActiveLink(anchorID: string) {
      const activeLink = nav.querySelector(`[data-progress-nav-target="#${anchorID}"]`);
      if (!activeLink) return;

      nav.querySelectorAll("[data-progress-nav-target]").forEach((link) => {
        link.classList.remove("is--active");
      });

      activeLink.classList.add("is--active");
      updateIndicator(activeLink);
    }

    const anchors = gsap.utils.toArray<HTMLElement>("[data-progress-nav-anchor]");

    const anchorTriggers = anchors.map((anchor) => {
      const anchorID = anchor.id;

      return ScrollTrigger.create({
        trigger: anchor,
        scroller: document.body,
        start: "0% 50%",
        end: "100% 50%",
        onEnter: () => setActiveLink(anchorID),
        onEnterBack: () => setActiveLink(anchorID),
      });
    });

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

    const onResize = () => {
      const activeLink = nav.querySelector("[data-progress-nav-target].is--active");
      if (activeLink) updateIndicator(activeLink);
    };

    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();
    setActiveLink("top");

    return () => {
      anchorTriggers.forEach((trigger) => trigger.kill());
      themeTriggers.forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", onResize);
    };
  }, [locomotiveScroll, isHome]);

  // Sub-pages (e.g. case detail) render on a white background, so the nav
  // uses its light (dark-text) theme there. The home page drives its own
  // theme from section scroll triggers above.
  useEffect(() => {
    if (isHome) return;
    navRef.current?.classList.add("is--light");
  }, [isHome]);

  return (
    <nav ref={navRef} className="progress-nav" aria-label="Pagina navigatie">
      <div className="progress-nav__inner">
        <a className="progress-nav__logo" href="#top" onClick={(event) => handleNavigate(event, "#top")}>
          <Image alt="Flowlined" fill priority src="/images/flowlined-logo.svg" />
        </a>

        <div className="progress-nav__wrapper">
          <div ref={listRef} data-progress-nav-list className="progress-nav__list">
            <div ref={indicatorRef} className="progress-nav__indicator" />
            <div data-progress-nav-target="#top" className="progress-nav__btn is--before" />
            {PROGRESS_NAV_ITEMS.map(({ id, label }) => (
              <NavButton key={id} href={`#${id}`} label={label} onNavigate={handleNavigate} />
            ))}
            <div data-progress-nav-target="#contact" className="progress-nav__btn is--after" />
          </div>
        </div>

        <Cta href="#contact" onClick={(event) => handleNavigate(event, "#contact")}>
          Plan een gesprek
        </Cta>
      </div>
    </nav>
  );
}
