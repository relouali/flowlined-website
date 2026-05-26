"use client";

import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import HighlightText from "@/components/highlight-text";

import "./case-study-section.css";

type Stat = {
  value: string;
  label: string;
  description: string;
};

const STATS: ReadonlyArray<Stat> = [
  {
    value: "70%",
    label: "Tijdsbesparing op administratieve taken",
    description:
      "Dossierstudie, compleetheidscontroles en rapportopbouw kosten arbeidsdeskundigen het merendeel van hun dag. ADO Pro reduceert dat voorwerk met 70%.",
  },
  {
    value: "99,99%",
    label: "Nauwkeurigheid in documentenanalyse",
    description:
      "Het systeem extraheert en structureert informatie uit complexe dossiers met een foutmarge van minder dan 0,01%. Geen gemiste documenten, geen verkeerde koppelingen.",
  },
  {
    value: "3x",
    label: "Snellere complete rapportages",
    description:
      "Van dossier tot concept-rapport in een derde van de tijd. De arbeidsdeskundige reviewt en finaliseert, het systeem doet het structuurwerk.",
  },
  {
    value: "100%",
    label: "AVG-compliant gegevensverwerking",
    description:
      "Alle data wordt verwerkt conform de AVG. Geen externe opslag, geen ongeautoriseerde toegang. Privacygevoelige dossiers blijven beschermd gedurende het hele proces.",
  },
];

export default function CaseStudySection() {
  const statsRef = useRef<HTMLUListElement>(null);

  // Scramble-reveal the KPI numbers (70%, 99,99%, 3x, 100%) as the stats
  // grid scrolls into view. Each KPI is a single token so we scramble its
  // textContent directly (no SplitText needed) and stagger across the four
  // stats for a left-to-right cascade.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = statsRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(".case-study-stat-value"),
    );
    if (!targets.length) return;

    const originals = targets.map((el) => el.textContent ?? "");

    const tweens: gsap.core.Tween[] = [];
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      // One ScrollTrigger per KPI instead of a single sweep across all four.
      // On the 2×2 desktop grid this means the top-row KPIs (70%, 99,99%)
      // fire as a pair when their row reaches `top 80%`, then the bottom
      // row (3x, 100%) fires once the user scrolls a little further. On
      // single-column mobile each KPI scrambles independently as it lands.
      targets.forEach((target) => {
        const t = gsap.to(target, {
          duration: 1.9,
          ease: "none",
          scrambleText: {
            text: "{original}",
            // Digits-only scramble — feels native to the numeric KPI values
            // (uppercase letters would briefly read as "K8%" / "QM" etc.).
            chars: "0123456789",
            // Lower speed = chars cycle more slowly per frame, so the user
            // can actually see the digits ticking instead of a blur.
            speed: 0.6,
          },
          scrollTrigger: {
            trigger: target,
            scroller: document.body,
            // Fires as the KPI is just peeking in from the bottom of the
            // viewport — the 1.9s scramble has runway to play out so the
            // digits are mid-roll by the time the row is fully on screen.
            start: "top 95%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
        tweens.push(t);
      });
    };

    // Wait for the pixel font to load before scrambling so character widths
    // are measured against Geist Pixel Line rather than the Mono fallback.
    const fonts = (
      document as Document & { fonts?: { ready: Promise<unknown> } }
    ).fonts;
    if (fonts && fonts.ready) {
      fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      // Restore originals in case Strict Mode tore us down mid-scramble.
      targets.forEach((el, i) => {
        el.textContent = originals[i];
      });
    };
  }, []);

  return (
    <section
      id="ado-pro"
      data-progress-nav-anchor
      data-nav-theme="light"
      className="case-study-section relative flex min-h-[100dvh] flex-col bg-white lg:flex-row"
    >
      {/* Left column — heading + stats grid. The Figma uses justify-between
          to space the three blocks (heading, stats row 1, stats row 2)
          evenly across the column height. */}
      <div className="flex flex-1 flex-col justify-between gap-16 px-8 py-16 sm:px-16 lg:py-24">
        {/* Header — matches the HighlightText pattern used by problem &
            sectors sections (scroll-driven character fade, with a muted
            tone on the secondary clause to inverse the dark-bg accent). */}
        <div className="flex max-w-xl flex-col gap-8">
          <HighlightText className="text-4xl font-light leading-[1.15] text-black lg:text-[3.25rem] lg:leading-[1.1]">
            ADO Pro.{" "}
            <span className="text-black/45">
              Gebouwd voor en met arbeidsdeskundigen.
            </span>
          </HighlightText>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-black/80 lg:text-xl">
            ADO Pro automatiseert het voorbereidende werk van
            arbeidsdeskundigen, van dossierstudie tot rapportgeneratie. Live
            in productie, gebouwd op de methode die we voor elk domein
            inzetten.
          </p>
        </div>

        {/* Stats grid — 1 col on mobile, 2 cols on tablet+ */}
        <ul
          ref={statsRef}
          className="grid max-w-xl list-none grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2"
        >
          {STATS.map((stat) => (
            <li key={stat.value} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="case-study-stat-value text-[64px] lg:text-[80px]">
                  {stat.value}
                </span>
                <span className="text-base font-light leading-[1.45] text-black">
                  {stat.label}
                </span>
              </div>
              <p className="text-base font-extralight leading-[1.45] text-black/50">
                {stat.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Subtle vertical divider between the two columns on desktop */}
      <div className="case-study-divider hidden lg:block" aria-hidden />

      {/* Right column — cover photo van het ADO Pro project. The black
          backdrop on .case-study-visual is a neutral fallback while the
          photo decodes. */}
      <div className="case-study-visual relative flex flex-1 min-h-[40vh] lg:min-h-0">
        <Image
          src="/images/ADOPRO-cover.jpg"
          alt="Werksessie tijdens het ADO Pro project — domeinexperts werken samen aan dossier- en procesontwerp"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="case-study-visual__img"
        />
      </div>
    </section>
  );
}
