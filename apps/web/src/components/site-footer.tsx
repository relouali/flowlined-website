"use client";

import Image from "next/image";
import { toast } from "sonner";

import { CtaButton } from "@/components/cta";
import GiantWordmark from "@/components/giant-wordmark";

import "./site-footer.css";

const FOOTER_NAV_LINKS = [
  { href: "/cases", label: "Cases" },
  { href: "/inzichten", label: "Inzichten" },
  { href: "/talent", label: "Talent" },
  { href: "/verhaal", label: "Ons verhaal" },
] as const;

const LEGAL_LINKS = [
  { href: "/legal/privacy-statement.pdf", label: "Privacybeleid" },
  { href: "/legal/terms-and-conditions.pdf", label: "Algemene voorwaarden" },
] as const;

export default function SiteFooter() {
  function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;

    toast.success("Bedankt voor je aanmelding", {
      description: `We sturen updates naar ${email}.`,
    });
    event.currentTarget.reset();
  }

  return (
    <footer
      id="contact"
      className="bg-[#0a1418] px-8 pt-16 text-white lg:px-16 lg:pt-[74px]"
    >
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[572px_188px_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-0">
          <div className="flex flex-col gap-8">
            <a
              aria-label="Flowlined home"
              className="relative block h-8 w-[182px]"
              href="/"
            >
              <Image
                alt="Flowlined"
                className="object-contain object-left"
                fill
                src="/logo/lettermark.svg"
              />
            </a>

            <div className="flex flex-col gap-6 text-sm leading-[1.5]">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Amsterdam</p>
                <p className="font-light">
                  Joop Geesinkweg 201, 1114 AB Amsterdam
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Eindhoven</p>
                <p className="font-light">
                  High Tech Campus 1e, 5656 AE Eindhoven
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Contact:</p>
                <a
                  className="font-light text-[#999999] transition-colors hover:text-white"
                  href="tel:+31202117832"
                >
                  +31 (0)20 211 7832
                </a>
                <a
                  className="font-light text-[#999999] transition-colors hover:text-white"
                  href="mailto:info@flowlined.nl"
                >
                  info@flowlined.nl
                </a>
              </div>
            </div>

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

          <nav aria-label="Voettekst navigatie">
            <p className="py-2 text-sm font-semibold">Menu</p>
            <ul className="flex flex-col">
              {FOOTER_NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    className="block py-2 text-sm font-light text-[#999999] transition-colors hover:text-white"
                    href={href}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-base font-semibold">Blijf op de hoogte</p>
              <p className="text-base font-light leading-[1.5]">
                Ontvang inzichten over dossierwerk, Venture building en
                nieuwe productlanceringen.
              </p>
            </div>

            <form
              className="flex w-full flex-col gap-3"
              onSubmit={handleNewsletterSubmit}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
                <label className="sr-only" htmlFor="newsletter-email">
                  E-mail
                </label>
                <input
                  autoComplete="email"
                  className="footer-newsletter-input"
                  id="newsletter-email"
                  name="email"
                  placeholder="E-mail"
                  required
                  type="email"
                />
                <CtaButton
                  className="footer-newsletter-submit w-full shrink-0 sm:w-auto"
                  type="submit"
                >
                  Aanmelden
                </CtaButton>
              </div>
              <p className="text-xs font-light leading-[1.5] text-white/80">
                Door je aan te melden ga je akkoord met ons privacybeleid
                en ontvang je periodiek updates van Flowlined.
              </p>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div aria-hidden className="h-px w-full bg-white/[0.07]" />
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="font-light">
              © {new Date().getFullYear()} Flowlined. Alle rechten
              voorbehouden.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  className="font-light text-[#999999] transition-colors hover:text-white"
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

      <div className="mx-auto mt-16 w-full max-w-[1320px] overflow-hidden lg:mt-20">
        <GiantWordmark />
      </div>
    </footer>
  );
}
