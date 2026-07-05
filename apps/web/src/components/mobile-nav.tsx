"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { transitionNavigate } from "@/components/page-transition-controller";
import TransitionLink from "@/components/transition-link";

import "./mobile-nav.css";

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/over-ons", label: "Ons verhaal" },
  { href: "/talent", label: "Talent" },
  { href: "/cases/ado-pro", label: "ADO Pro" },
] as const;

export default function MobileNav() {
  const [active, setActive] = useState(false);
  const { locomotiveScroll } = useLocomotiveScroll();
  const pathname = usePathname();
  const router = useRouter();

  const close = () => setActive(false);

  // Stop Locomotive/Lenis while the menu is open so the page behind can't scroll.
  useEffect(() => {
    const lenis = locomotiveScroll?.lenisInstance;
    if (!lenis) return;
    if (active) lenis.stop();
    else lenis.start();
  }, [active, locomotiveScroll]);

  // Close on ESC.
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  // Close when the viewport grows past the desktop breakpoint (the desktop nav
  // takes over there), so the scroll lock can't get stuck.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setActive(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setActive(false);
    if (pathname === "/") {
      locomotiveScroll?.scrollTo(0, { duration: 1.2 });
      return;
    }
    router.push("/");
  }

  function handleCtaClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setActive(false);
    const lenis = locomotiveScroll?.lenisInstance;
    lenis?.start();
    if (locomotiveScroll) {
      locomotiveScroll.scrollTo("#contact", { duration: 1.2, offset: -96 });
    } else {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const status = active ? "active" : "not-active";

  return (
    <nav
      data-navigation-status={status}
      className="navigation"
      aria-label="Mobiele navigatie"
    >
      <div
        data-navigation-toggle="close"
        className="navigation__dark-bg"
        onClick={close}
      />
      <div className="centered-nav">
        <div className="centered-nav__bg" />
        <div className="centered-nav__header">
          <a
            aria-label="Flowlined home"
            className="centered-nav__logo"
            href="/"
            onClick={handleLogoClick}
          >
            <Image
              alt="Flowlined"
              className="object-contain object-left"
              fill
              sizes="104px"
              src="/logo/full-Logo.svg"
            />
          </a>
          <button
            aria-expanded={active}
            aria-label="Menu"
            className="centered-nav__toggle"
            data-navigation-toggle="toggle"
            onClick={() => setActive((value) => !value)}
            type="button"
          >
            <div className="centered-nav__toggle-bar" />
            <div className="centered-nav__toggle-bar" />
          </button>
        </div>
        <div className="centered-nav__content">
          <div className="centered-nav__inner">
            <ul className="centered-nav__ul">
              {MOBILE_NAV_ITEMS.map(({ href, label }, index) => (
                <li
                  key={href}
                  className="centered-nav__li"
                  data-navigation-item
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <TransitionLink
                    className="hamburger-nav__a"
                    href={href}
                    onClick={close}
                  >
                    <p className="hamburger-nav__p">{label}</p>
                  </TransitionLink>
                </li>
              ))}
              <li
                className="centered-nav__li"
                data-navigation-item
                style={{ transitionDelay: `${MOBILE_NAV_ITEMS.length * 0.05}s` }}
              >
                <a
                  className="hamburger-nav__a"
                  href="#contact"
                  onClick={handleCtaClick}
                >
                  <p className="hamburger-nav__p">Plan een gesprek</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
