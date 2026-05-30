"use client";

import Cta from "@/components/cta";
import HighlightText from "@/components/highlight-text";

import "./manifest-section.css";

export default function ManifestSection() {
  return (
    <section
      id="manifest"
      data-progress-nav-anchor
      data-parallax="trigger"
      data-parallax-start="15"
      data-parallax-end="-15"
      className="manifest-section relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-8 py-24 sm:px-16"
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
        <HighlightText
          as="h2"
          className="text-4xl font-light leading-[1.15] text-white lg:text-[3.5rem] lg:leading-[1.1]"
        >
          Domeinkennis verdient een eigen product.


        </HighlightText>

        <p className="max-w-2xl text-lg font-light leading-relaxed text-white/80 lg:text-xl">
          Jij kent het domein. Wij bouwen het systeem. Samen wordt het een product waar je mede-eigenaar van bent.
          Plan een gesprek en ontdek wat een verticaal product voor jouw sector kan betekenen.
        </p>

        <div className="mt-4">
          <Cta href="#contact">Plan een gesprek</Cta>
        </div>
      </div>
    </section>
  );
}
