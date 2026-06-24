"use client";

import type { ReactNode } from "react";

import Cta from "@/components/cta";
import HighlightText from "@/components/highlight-text";

import "./manifest-section.css";

type ManifestSectionProps = {
  title?: ReactNode;
  lead?: ReactNode;
};

const DEFAULT_LEAD = (
  <>
    Jouw vakkennis is het fundament. Wij bouwen erop.
    <br />
    Samen maken we er een product van dat ook van jou is.
  </>
);

export default function ManifestSection({
  title = "Domeinkennis verdient een eigen product.",
  lead = DEFAULT_LEAD,
}: ManifestSectionProps = {}) {
  return (
    <section
      id="manifest"
      data-progress-nav-anchor
      data-parallax="trigger"
      data-parallax-start="15"
      data-parallax-end="-15"
      className="manifest-section relative flex min-h-[100dvh] items-center justify-center overflow-hidden rounded-b-[1.75rem] px-8 py-24 sm:rounded-b-[2rem] sm:px-16 md:py-32 lg:rounded-b-[3rem] lg:py-40"
    >
      {/* Figma stack: Full Black → photo → blue-teal color wash → tint */}
      <div
        aria-hidden
        className="manifest-section__bg"
        data-parallax="target"
      >
        <div className="manifest-section__bg-base" />
        <div className="manifest-section__bg-image" />
        <div className="manifest-section__bg-overlay" />
        <div className="manifest-section__bg-tint" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center gap-8 text-center">
        <HighlightText as="h2" className="type-section-title text-white">
          {title}
        </HighlightText>

        <p className="type-section-lead max-w-2xl text-white/80">{lead}</p>

        <div className="mt-4">
          <Cta href="#contact">Plan een gesprek</Cta>
        </div>
      </div>
    </section>
  );
}
