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
      {/* Mesh-gradient + noise background lives on this child so it can
          be translated by GlobalParallax while the foreground content
          stays at normal scroll speed. Decorative-only — kept behind
          the content via aria-hidden + z-index. */}
      <div
        aria-hidden
        className="manifest-section__bg"
        data-parallax="target"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center gap-8 text-center">
        <HighlightText
          as="h2"
          className="text-3xl font-light leading-[1.15] text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]"
        >
          De beste software ontstaat wanneer engineers het domein begrijpen
          en domeinexperts mede-eigenaar worden van wat ze bouwen.
        </HighlightText>

        <p className="max-w-2xl text-base font-light leading-relaxed text-white/70 lg:text-lg">
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
