"use client";

import { useEffect, useRef, useState } from "react";

import GsapSlider from "@/components/gsap-slider";
import LottieIcon from "@/components/lottie-icon";
import ScrollFadeText from "@/components/scroll-fade-text";
import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import SectionFrame from "@/components/section-frame";
import { initProblemGridLines } from "@/lib/init-problem-grid-lines";
import { PROBLEM_SECTION_LOTTIE_COLORS } from "@/lib/remap-lottie-colors";

import "./problem-section.css";

const ITEMS = [
  {
    title: "Verspreide kennis",
    description:
      "Cruciale expertise zit in mensen, spreadsheets en mailketens. Kwetsbaar en moeilijk toegankelijk op het moment dat het ertoe doet.",
    lottieSrc: "/icons/spreaded-knowledge.json",
    iconSize: 48,
  },
  {
    title: "Herhalend voorwerk",
    description:
      "Experts besteden tot 40% van hun tijd aan werk dat ze al eerder hebben gedaan. Dezelfde output, steeds opnieuw handmatig opgebouwd.",
    lottieSrc: "/icons/repeating-work.json",
    iconSize: 48,
  },
  {
    title: "Wisselende kwaliteit",
    description:
      "Zonder gestructureerde systemen levert hetzelfde proces verschillende resultaten op, afhankelijk van wie het uitvoert, wanneer, en onder welke druk.",
    lottieSrc: "/icons/inconsistent-quality.json",
    iconSize: 48,
  },
  {
    title: "Schaalbaarheid",
    description:
      "Groei betekent meer experts inhuren. Maar onboarding is traag, talent is schaars, en marges krimpen met elke nieuwe aanname.",
    lottieSrc: "/icons/scale.json",
    iconSize: 48,
  },
] as const;

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !sectionRef.current) return;

    const cleanup = initProblemGridLines(sectionRef.current);
    return cleanup;
  }, [locomotiveScroll]);

  return (
    <SectionFrame
      id="probleem"
      data-progress-nav-anchor
      data-nav-theme="dark"
      className="problem-section"
      frameClassName="problem-section__frame flex min-h-[100dvh] items-center py-24 md:py-32 lg:py-40"
    >
      <div
        ref={sectionRef}
        className="section-inner flex flex-col"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <ScrollFadeText className="type-section-title text-white">
            Kenniswerk draait op ervaring, niet op systemen.{" "}
            <span className="text-[#cddfed]">
              Dat werkt, tot het niet meer schaalt.
            </span>
          </ScrollFadeText>

          <ScrollFadeText
            as="p"
            className="type-section-lead max-w-2xl text-white"
            delay={0.12}
          >
            Beoordelaars, auditors en inspecteurs leveren werk van hoog niveau. Maar de
            systemen waarop dat werk draait zijn dat niet. Dit zijn de gevolgen:
          </ScrollFadeText>
        </div>

        <GsapSlider
          className="problem-items"
          collectionClassName="problem-items__collection"
          trackClassName="problem-items__track"
          ariaLabel="Probleemstellingen"
        >
          {ITEMS.map((item, index) => (
            <ProblemItem key={index} item={item} />
          ))}
        </GsapSlider>
      </div>
    </SectionFrame>
  );
}

function ProblemItem({ item }: { item: (typeof ITEMS)[number] }) {
  const [hovered, setHovered] = useState(false);
  // On mobile the items become a carousel; the slider tags the slide currently
  // in focus with data-gsap-slider-item-status="active". We mirror that so the
  // icon only plays once you've actually landed on its slide. On desktop the
  // attribute is absent, so playback falls back to hover.
  const [isActiveSlide, setIsActiveSlide] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const read = () =>
      setIsActiveSlide(
        el.getAttribute("data-gsap-slider-item-status") === "active",
      );

    read();
    const observer = new MutationObserver(read);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-gsap-slider-item-status"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      data-gsap-slider-item
      data-problem-grid-item
      className="problem-item flex flex-col gap-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        aria-hidden
        className="problem-item__line problem-item__line--top"
        data-problem-grid-line="h"
      />
      <span
        aria-hidden
        className="problem-item__line problem-item__line--left"
        data-problem-grid-line="v"
      />
      <span
        aria-hidden
        className="problem-item__line problem-item__line--right"
        data-problem-grid-line="h"
      />
      <span
        aria-hidden
        className="problem-item__line problem-item__line--bottom"
        data-problem-grid-line="v"
      />
      <div className="problem-item__body">
        <div
          className="problem-item__icon"
          data-problem-grid-content="icon"
        >
          <LottieIcon
            size={item.iconSize}
            src={item.lottieSrc}
            play={hovered || isActiveSlide}
            colors={PROBLEM_SECTION_LOTTIE_COLORS}
          />
        </div>
        <div
          className="problem-item__copy flex flex-col gap-3 text-white"
          data-problem-grid-content="copy"
        >
          <h3 className="type-body-strong text-white">{item.title}</h3>
          <p className="type-body text-white">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
