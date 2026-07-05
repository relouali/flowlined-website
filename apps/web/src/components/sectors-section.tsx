"use client";

import { useMemo, useState } from "react";

import LogoWall, { type LogoWallLogo } from "@/components/logo-wall";
import LoopingWords from "@/components/looping-words";
import MaskTextReveal from "@/components/mask-text-reveal";
import ScrollFadeText from "@/components/scroll-fade-text";
import SectionFrame from "@/components/section-frame";

import "./sectors-section.css";

type Sector = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

const SECTORS: ReadonlyArray<Sector> = [
  {
    id: "zorg",
    title: "Zorg",
    subtitle: "Beoordelingen, intake en zorgplanning",
    description:
      "Zorgprofessionals werken in dossiergedreven processen met veel administratieve overhead. We bouwen producten die de inhoudelijke beoordeling weer centraal zetten.",
  },
  {
    id: "arbeidsrecht",
    title: "Arbeidsrecht",
    subtitle: "Beoordelingen, re-integratie, belastbaarheid",
    description:
      "Arbeidsdeskundigen besteden uren aan dossierstudie, compleetheidscontroles en rapportopbouw.",
  },
  {
    id: "bouw",
    title: "Bouw",
    subtitle: "Calculaties, vergunningen en bouwbesluit",
    description:
      "Bouwprofessionals navigeren door complexe regelgeving en projectdocumentatie. We bouwen tooling die het werkproces stroomlijnt zonder maatwerk-overhead.",
  },
];

// Partner / domain-expert logos. Files live in
// `apps/web/public/partners-logos/`. Filenames with spaces or brackets
// are URL-encoded so they resolve correctly when used as <img src>.
const PARTNER_LOGOS: ReadonlyArray<LogoWallLogo> = [
  { src: "/partners-logos/uwv.svg", alt: "UWV" },
  { src: "/partners-logos/medtronic.svg", alt: "Medtronic" },
  { src: "/partners-logos/zuidweg-partners.svg", alt: "Zuidweg & Partners" },
  { src: "/partners-logos/maatwerk-arbeidsavies.svg", alt: "Maatwerk Arbeidsadvies" },
  { src: "/partners-logos/growspace.svg", alt: "GrowSpace" },
  { src: "/partners-logos/Manta-roofs.svg", alt: "Manta Roofs" },
  { src: "/partners-logos/Margolin.svg", alt: "Margolin" },
  { src: "/partners-logos/bright%206.svg", alt: "Bright 6" },
  { src: "/partners-logos/6d1ba59d-fd85-4dff-add9-aa74e12acd5c%201%20%5BVectorized%5D.svg", alt: "Partner" },
];

export default function SectorsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Stable reference so LoopingWords doesn't re-init on every parent render.
  const sectorTitles = useMemo(() => SECTORS.map((s) => s.title), []);

  return (
    <SectionFrame
      id="sectoren"
      data-progress-nav-anchor
      className="sectors-section"
      frameClassName="sectors-section__frame relative flex min-h-[100dvh] flex-col overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <div className="section-inner flex flex-1 flex-col items-center">
        {/* Top: header + picker. Anchored to the top of the available
            space (rather than vertically centered) so the headline sits
            high in the viewport, matching the rhythm of the problem and
            process sections. No `flex-1` here on purpose — letting this
            block be its natural height keeps the logo wall close
            beneath the picker instead of pushing it to the very bottom
            of the section and creating dead space in between. */}
        <div className="flex w-full flex-col items-center">
          {/* Header — same structure & spacing as the problem section */}
          <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
            <ScrollFadeText className="type-section-title text-white">
              Met wie wij <span className="text-[#cddfed]">bouwen</span>
            </ScrollFadeText>
            <ScrollFadeText
              as="p"
              className="type-section-lead max-w-2xl text-white hidden lg:block"
              delay={0.12}
            >
              Flowlined werkt met domeinexperts in sectoren waar het vakkundige
              oordeel centraal staat. Professionals die hun vak kennen, een
              markt zien, en er een product van willen maken.
            </ScrollFadeText>
          </div>

          {/* Mobile: title → looping words → detail. Desktop: detail | words. */}
          <div className="sectors-picker-grid mt-10 grid w-full grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="sectors-detail relative order-2 min-h-[220px] lg:order-1 lg:min-h-[240px]">
              {SECTORS.map((sector, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <article
                    key={sector.id}
                    data-state={isActive ? "active" : "inactive"}
                    className="sectors-detail__slide"
                    aria-hidden={!isActive}
                  >
                    <div className="flex flex-col items-center gap-3.5">
                      <MaskTextReveal
                        as="h3"
                        active={isActive}
                        className="type-body-strong hidden text-white lg:block"
                      >
                        {sector.title}
                      </MaskTextReveal>
                      <MaskTextReveal
                        as="p"
                        active={isActive}
                        delay={0.08}
                        className="type-body text-white"
                      >
                        {sector.subtitle}
                      </MaskTextReveal>
                    </div>
                    <MaskTextReveal
                      as="p"
                      active={isActive}
                      delay={0.16}
                      className="type-body text-white"
                    >
                      {sector.description}
                    </MaskTextReveal>
                  </article>
                );
              })}
            </div>

            <div className="sectors-picker-words order-1 flex items-center justify-center lg:order-2">
              <LoopingWords
              words={sectorTitles}
              onChange={setActiveIndex}
              intervalSeconds={5.5}
            />
            </div>
          </div>
        </div>

        {/* Partner logo wall — sits a fixed distance below the picker
            rather than being flex-pushed to the bottom of the section.
            `mt-auto` would re-introduce the dead space we want to
            avoid, so we use an explicit (larger) margin to give the
            picker visible breathing room before the logos start. */}
        <div className="sectors-logos-wrap mt-28 w-full lg:mt-40">
          <LogoWall
            logos={PARTNER_LOGOS}
            shuffle={false}
            className="logo-wall--compact"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
