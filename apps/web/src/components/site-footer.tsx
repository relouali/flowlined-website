"use client";

import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import Image from "next/image";

import SectionFrame from "@/components/section-frame";
import TransitionLink from "@/components/transition-link";

import "./site-footer.css";

// `ready: false` links point to pages that don't exist yet, so they render as
// plain anchors (no page transition) until the route is built.
const FOOTER_NAV_LINKS = [
  { href: "/cases/ado-pro", label: "Cases", ready: true },
  { href: "/inzichten", label: "Inzichten", ready: false },
  { href: "/talent", label: "Talent", ready: true },
  { href: "/over-ons", label: "Ons verhaal", ready: true },
] as const;

const LEGAL_LINKS = [
  { href: "/legal/privacy-statement.pdf", label: "Privacybeleid" },
  { href: "/legal/terms-and-conditions.pdf", label: "Algemene voorwaarden" },
] as const;

export default function SiteFooter() {
  return (
    <SectionFrame
      as="footer"
      id="contact"
      className="site-footer"
      frameClassName="section-frame--dark pb-8 pt-16 text-white lg:pt-[74px]"
    >
      <div className="footer-inner flex flex-col gap-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left half — logo pinned top, text + contact pushed to bottom */}
          <div className="flex flex-col lg:h-full">
            {/* Logo — large */}
            <TransitionLink
              aria-label="Flowlined home"
              className="footer-logo relative block"
              href="/"
            >
              <Image
                alt="Flowlined"
                className="object-contain object-left"
                fill
                src="/logo/full-Logo.svg"
              />
            </TransitionLink>

            <div className="mt-12 flex flex-col gap-10 lg:mt-auto lg:pt-24">
            {/* Intro paragraph */}
            <p className="footer-about type-body font-light text-white">
              Flowlined is ontworpen om vast te leggen hoe experts werken en hun
              workflows om te zetten in heldere, herhaalbare systemen, wat
              consistente uitvoering en schaalbare resultaten mogelijk maakt voor
              verschillende toepassingen.
            </p>

            {/* Company information */}
            <div className="footer-details flex flex-col gap-8">
              <div className="footer-section">
                <h3 className="footer-section-title">Locatie</h3>
                <div className="type-ui flex flex-col gap-4">
                  <p className="footer-contact-item font-light">
                    <MapPinIcon
                      aria-hidden
                      className="footer-contact-icon"
                      weight="regular"
                    />
                    <span>Joop Geesinkweg 201, 1114 AB Amsterdam</span>
                  </p>
                  <p className="footer-contact-item font-light">
                    <MapPinIcon
                      aria-hidden
                      className="footer-contact-icon"
                      weight="regular"
                    />
                    <span>High Tech Campus 1e, 5656 AE Eindhoven</span>
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right half — navigation + contact */}
          <div className="footer-right flex flex-col gap-10">
            <nav aria-label="Voettekst navigatie" className="footer-menu">
              <h3 className="footer-section-title">Navigatie</h3>
              {FOOTER_NAV_LINKS.map(({ href, label, ready }) =>
                ready ? (
                  <TransitionLink key={href} className="footer-menu__link" href={href}>
                    <span className="footer-menu__label">{label}</span>
                  </TransitionLink>
                ) : (
                  <a key={href} className="footer-menu__link" href={href}>
                    <span className="footer-menu__label">{label}</span>
                  </a>
                ),
              )}
            </nav>

            <div className="footer-section">
              <h3 className="footer-section-title">Contact</h3>
              <div className="type-ui flex flex-col gap-4">
                <a
                  className="footer-contact-item footer-contact-item--link font-light"
                  href="tel:+31202117832"
                >
                  <PhoneIcon
                    aria-hidden
                    className="footer-contact-icon"
                    weight="regular"
                  />
                  <span>+31 (0)20 211 7832</span>
                </a>
                <a
                  className="footer-contact-item footer-contact-item--link font-light"
                  href="mailto:info@flowlined.nl"
                >
                  <EnvelopeIcon
                    aria-hidden
                    className="footer-contact-icon"
                    weight="regular"
                  />
                  <span>info@flowlined.nl</span>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">Socials</h3>
              <div className="flex items-center gap-3">
                <a
                  aria-label="Flowlined op LinkedIn"
                  className="group inline-flex h-7 w-7 items-center justify-center"
                  href="https://www.linkedin.com/company/flowlined"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt=""
                    aria-hidden
                    className="h-6 w-6 opacity-60 brightness-0 invert transition-opacity group-hover:opacity-100"
                    height={24}
                    src="/icons/linkedin-1.svg"
                    width={24}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom flex flex-col gap-8">
          <div aria-hidden className="h-px w-full bg-white/[0.07]" />
          <div className="type-ui flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-light">
              © {new Date().getFullYear()} Flowlined. Alle rechten
              voorbehouden.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  className="font-light text-[#666d70] transition-colors hover:text-white"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
