"use client";

import type { ReactNode } from "react";

import Cta from "@/components/cta";
import ScrollFadeText from "@/components/scroll-fade-text";
import SectionFrame from "@/components/section-frame";

import "./manifest-section.css";

type ManifestSectionProps = {
  title?: ReactNode;
  lead?: ReactNode;
};

const DEFAULT_TITLE = (
  <>
    Domeinkennis verdient{" "}
    <span className="text-[#cddfed]">een eigen product.</span>
  </>
);

const DEFAULT_LEAD = (
  <>
    Jouw vakkennis is het fundament. Wij bouwen erop.
    <br />
    Samen maken we er een product van dat ook van jou is.
  </>
);

export default function ManifestSection({
  title = DEFAULT_TITLE,
  lead = DEFAULT_LEAD,
}: ManifestSectionProps = {}) {
  return (
    <SectionFrame
      id="manifest"
      data-progress-nav-anchor
      className="manifest-section"
      frameClassName="manifest-section__frame relative flex min-h-[100dvh] items-center justify-center px-8 py-24 sm:px-16 md:py-32 lg:py-40"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center gap-8 text-center">
        <ScrollFadeText as="h2" className="type-section-title text-white">
          {title}
        </ScrollFadeText>

        <ScrollFadeText
          as="p"
          className="type-section-lead max-w-2xl text-white"
          delay={0.12}
        >
          {lead}
        </ScrollFadeText>

        <div className="mt-4">
          <Cta href="#contact">Plan een gesprek</Cta>
        </div>
      </div>
    </SectionFrame>
  );
}
