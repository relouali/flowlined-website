"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import CaseStepVideo from "@/components/case-detail/case-step-video";
import { horizontalLoop } from "@/lib/horizontal-loop";

const SLIDE_EASE = "power3.inOut";
const SLIDE_DURATION = 0.725;

const STEPS = [
  {
    title: "Domeinregels toepassen",
    paragraphs: [
      "RIV-richtlijnen, UWV-vereisten en beroepsnormen zijn ingebouwd in het systeem. Niet als checklist, maar als logica die meeweegt bij elke stap van de rapportgeneratie. De regelgeving is een structureel onderdeel van de software, geen prompt of bijlage.",
    ],
    videoSrc: "/videos/Domeinregels-toepassen%20.mp4",
  },
  {
    title: "Dossier inlezen en structureren",
    paragraphs: [
      "Het systeem leest het volledige dossier in: medische rapportages, FML-gegevens, eerdere beoordelingen, en aanvullende documentatie. Informatie wordt automatisch gecategoriseerd en op relevantie gerangschikt. Compleetheidscheck signaleert ontbrekende documenten voordat de beoordeling begint.",
    ],
    videoSrc: "/videos/dossier-inlezen-en-structureren.mp4",
  },
  {
    title: "Expert beoordeelt en finaliseert",
    paragraphs: [
      "De arbeidsdeskundige reviewt het conceptrapport, past het oordeel aan waar nodig, en finaliseert. Het systeem doet het voorwerk, de professional neemt de beslissing. De expert besteedt de tijd aan wat er toe doet: het vakkundig oordeel.",
    ],
    videoSrc: "/videos/Expert-beoordeelt-en-finaliseert.mp4",
  },
  {
    title: "Rapport genereren",
    paragraphs: [
      "Op basis van het gestructureerde dossier en de toegepaste domeinregels genereert het systeem een conceptrapport. Volledig conform de vereiste structuur, met herleidbare conclusies.",
    ],
    videoSrc: "/videos/rapport-genereren%20.mp4",
  },
] as const;

const slideTransition = {
  ease: SLIDE_EASE,
  duration: SLIDE_DURATION,
};

function SliderArrow() {
  return (
    <svg
      aria-hidden
      className="case-step-slider__button-arrow"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 19L21 12L14 5"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
      <path d="M21 12H2" stroke="currentColor" strokeMiterlimit="10" />
    </svg>
  );
}

export default function CaseStepSlider() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ReturnType<typeof horizontalLoop> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    loopRef.current?.toIndex(index, slideTransition);
  };

  const goToPrevious = () => {
    loopRef.current?.previous(slideTransition);
  };

  const goToNext = () => {
    loopRef.current?.next(slideTransition);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let cancelled = false;
    let frame = 0;
    const cleanupRef = { current: () => {} };

    const resetSliderState = (slides: HTMLElement[]) => {
      gsap.set(slides, { x: 0, xPercent: 0, clearProps: "transform" });
    };

    if (!window.matchMedia("(min-width: 640px)").matches) return;

    const init = () => {
      if (cancelled) return;

      const slides = gsap.utils.toArray<HTMLElement>(
        wrapper.querySelectorAll('[data-centered-slider="slide"]'),
      );

      if (slides.length === 0) return;

      resetSliderState(slides);

      slides.forEach((slide, index) => {
        slide.id = `case-step-slide-${index}`;
      });

      const loop = horizontalLoop(slides, {
        paused: true,
        draggable: true,
        center: true,
        onChange: (_element, index) => {
          setActiveIndex(index);
        },
      });

      loopRef.current = loop;
      loop.toIndex(0, { duration: 0 });

      const slideHandlers = slides.map((slide, index) => {
        const handler = () => goTo(index);
        slide.addEventListener("click", handler);
        return { slide, handler };
      });

      cleanupRef.current = () => {
        slideHandlers.forEach(({ slide, handler }) => {
          slide.removeEventListener("click", handler);
        });
        loop.kill();
        loopRef.current = null;
        resetSliderState(slides);
      };
    };

    frame = requestAnimationFrame(() => {
      requestAnimationFrame(init);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanupRef.current();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-label="ADO Pro processtappen"
      className="case-step-slider"
      data-centered-slider="wrapper"
    >
      <div className="case-step-slider__controls">
        <button
          type="button"
          aria-label="Vorige stap"
          className="case-step-slider__button is--prev is--side"
          onClick={goToPrevious}
        >
          <SliderArrow />
        </button>

        <div className="case-step-slider__row">
          <div
            aria-label="Processtappen slides"
            className="case-step-slider__list"
            data-centered-slider="list"
            role="group"
          >
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className={`case-step-slider__slide${index === activeIndex ? " active" : ""}`}
                data-centered-slider="slide"
                id={`case-step-slide-${index}`}
              >
                <div className="case-step-slider__slide-inner">
                  <div className="case-step__frame w-full">
                    <div className="case-step__media">
                      {step.videoSrc ? (
                        <CaseStepVideo
                          isActive={index === activeIndex}
                          src={step.videoSrc}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="case-step-slider__copy">
                    <h3 className="type-body-strong text-black">
                      {step.title}
                    </h3>
                    {step.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="type-body-light"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Volgende stap"
          className="case-step-slider__button is--next is--side"
          onClick={goToNext}
        >
          <SliderArrow />
        </button>
      </div>

      <div
        aria-label="Processtappen"
        className="case-step-slider__indicators"
        role="tablist"
      >
        {STEPS.map((step, index) => (
          <button
            key={step.title}
            type="button"
            aria-label={`Stap ${index + 1}: ${step.title}`}
            aria-selected={index === activeIndex}
            className={`case-step-slider__indicator${index === activeIndex ? " is--active" : ""}`}
            onClick={() => goTo(index)}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
