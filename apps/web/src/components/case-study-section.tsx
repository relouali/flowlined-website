"use client";

import { CaretRightIcon } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import GsapSlider from "@/components/gsap-slider";
import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import ScrollFadeText from "@/components/scroll-fade-text";
import SectionFrame from "@/components/section-frame";
import TransitionLink from "@/components/transition-link";
import { initCaseStudyGrid } from "@/lib/init-case-study-grid";
import { MOBILE_CAROUSEL_MQ } from "@/lib/sync-lenis-prevent-mobile";

import "./case-study-section.css";

type Stat = {
  value: string;
  number: string;
  unit: string;
  scrambleMin: number;
  scrambleMax: number;
  label: string;
  description: string;
};

const SCRAMBLE_DURATION = 2.8;
const SCRAMBLE_MIN_TICK = 0.04;
const SCRAMBLE_MAX_TICK = 0.62;
const SCRAMBLE_SLOWDOWN = 3.8;

const STATS: ReadonlyArray<Stat> = [
  {
    value: "70%",
    number: "70",
    unit: "%",
    scrambleMin: 1,
    scrambleMax: 70,
    label: "Tijdsbesparing op administratieve taken",
    description:
      "ADO Pro neemt 70% van het voorbereidende dossierwerk over, van studie tot rapportopbouw.",
  },
  {
    value: "99,99%",
    number: "99,99",
    unit: "%",
    scrambleMin: 1,
    scrambleMax: 99,
    label: "Nauwkeurigheid in documentenanalyse",
    description:
      "Complexe dossiers worden geanalyseerd met een foutmarge van minder dan 0,01%.",
  },
  {
    value: "3x",
    number: "3",
    unit: "x",
    scrambleMin: 1,
    scrambleMax: 3,
    label: "Snellere complete rapportages",
    description:
      "Van dossier tot concept-rapport in een derde van de tijd. De expert finaliseert, het systeem structureert.",
  },
  {
    value: "100%",
    number: "100",
    unit: "%",
    scrambleMin: 1,
    scrambleMax: 100,
    label: "AVG-compliant",
    description:
      "Verwerking conform AVG. Geen externe opslag, geen ongeautoriseerde toegang.",
  },
];

function splitNumberParts(number: string) {
  const commaIndex = number.indexOf(",");
  if (commaIndex === -1) {
    return { integer: number, fraction: null as string | null };
  }
  return {
    integer: number.slice(0, commaIndex),
    fraction: number.slice(commaIndex + 1),
  };
}

function parseScrambleTarget(finalText: string, fallbackMax: number) {
  const parsed = parseFloat(finalText.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallbackMax;
}

function scrambleDurationFor(stat: Stat) {
  const range = Math.max(stat.scrambleMax - stat.scrambleMin, 1);
  return Math.min(0.28 + range * 0.036, SCRAMBLE_DURATION);
}

function scrambleTickInterval(progress: number) {
  const eased = Math.pow(Math.min(Math.max(progress, 0), 1), SCRAMBLE_SLOWDOWN);
  return SCRAMBLE_MIN_TICK + (SCRAMBLE_MAX_TICK - SCRAMBLE_MIN_TICK) * eased;
}

function valueForProgress(progress: number, min: number, target: number) {
  const eased = 1 - Math.pow(1 - Math.min(Math.max(progress, 0), 1), SCRAMBLE_SLOWDOWN);
  return min + (target - min) * eased;
}

function scrambleCapFor(target: number, min: number) {
  return Math.max(min, target - 1);
}

function nextIndependentUpward(
  last: number,
  target: number,
  progress: number,
  min: number,
) {
  if (progress >= 0.93) return target;

  const cap = scrambleCapFor(target, min);
  if (cap <= min) {
    return progress >= 0.93 ? target : min;
  }

  if (last >= cap) {
    let candidate = min + Math.floor(Math.random() * (cap - min + 1));
    if (candidate === last) {
      candidate = last >= cap ? last - 1 : last + 1;
    }
    return Math.max(min, Math.min(candidate, cap));
  }

  const room = cap - last;
  const slowdown = Math.pow(progress, 2.2);
  const maxStep = Math.max(
    1,
    Math.floor(room * (0.1 + Math.random() * (0.5 - slowdown * 0.38))),
  );

  return Math.min(last + maxStep, cap);
}

type ScramblePartOptions = {
  independent?: boolean;
  seed?: number;
  duration?: number;
  delay?: number;
};

function animateNumericScramble(
  el: HTMLElement,
  finalText: string,
  min: number,
  max: number,
  scrollTrigger: ScrollTrigger.Vars | undefined,
  options: ScramblePartOptions = {},
) {
  let lastTick = -Infinity;
  const countTarget = Math.floor(parseScrambleTarget(finalText, max));
  let lastValue = options.independent
    ? Math.min(countTarget, min + ((options.seed ?? 0) % 17))
    : min;

  const state = { t: 0 };
  return gsap.to(state, {
    t: 1,
    duration: options.duration ?? SCRAMBLE_DURATION,
    delay: options.delay ?? 0,
    ease: "none",
    onUpdate() {
      const progress = this.progress();
      if (progress >= 1) {
        el.textContent = finalText;
        return;
      }

      const time = this.time();
      const tickInterval = scrambleTickInterval(progress);
      if (time - lastTick < tickInterval) return;
      lastTick = time;

      if (progress >= 0.93) {
        el.textContent = finalText;
        return;
      }

      const cap = scrambleCapFor(countTarget, min);
      const next = options.independent
        ? nextIndependentUpward(lastValue, countTarget, progress, min)
        : Math.min(
            Math.max(
              lastValue,
              Math.round(valueForProgress(progress, min, cap)),
            ),
            cap,
          );

      lastValue = next;
      el.textContent = String(lastValue);
    },
    onComplete() {
      el.textContent = finalText;
    },
    ...(scrollTrigger ? { scrollTrigger } : {}),
  });
}

function scrambleStatItem(
  item: HTMLElement,
  index: number,
  tweens: gsap.core.Tween[],
) {
  const stat = STATS[index];
  if (!stat) return;

  const parts = splitNumberParts(stat.number);
  const partValues = parts.fraction
    ? [parts.integer, parts.fraction]
    : [stat.number];

  const scrambleEls = Array.from(
    item.querySelectorAll<HTMLElement>(".case-study-stat-value__scramble"),
  );

  const statDuration = scrambleDurationFor(stat);

  scrambleEls.forEach((target, partIndex) => {
    const finalPart = partValues[partIndex];
    if (!finalPart) return;

    const isFraction = partIndex === 1;

    const tween = animateNumericScramble(
      target,
      finalPart,
      stat.scrambleMin,
      stat.scrambleMax,
      undefined,
      isFraction
        ? {
            independent: true,
            seed: index * 31 + partIndex * 17,
            duration: statDuration * 1.08,
            delay: 0.08,
          }
        : { duration: statDuration },
    );
    tweens.push(tween);
  });
}

export default function CaseStudySection() {
  const statsRef = useRef<HTMLUListElement>(null);
  const syncMobileStatScrambleRef = useRef<() => void>(() => {});
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !statsRef.current) return;

    const cleanup = initCaseStudyGrid(statsRef.current);
    return cleanup;
  }, [locomotiveScroll]);

  // Scramble-reveal only the numeric portion of each KPI. Digits count upward
  // through a stat-specific range before settling on the final value.
  // Units (% / x) stay static beside the rolling digits.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = statsRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const statItems = Array.from(
      container.querySelectorAll<HTMLElement>(".case-study-stat"),
    );
    if (!statItems.length) return;

    const scrambleTargets = statItems.flatMap((item) =>
      Array.from(item.querySelectorAll<HTMLElement>(".case-study-stat-value__scramble")),
    );
    if (!scrambleTargets.length) return;

    const originals = scrambleTargets.map((el) => el.textContent ?? "");

    const tweens: gsap.core.Tween[] = [];
    let cancelled = false;

    function createScrambleIndex(scrambled: Set<number>) {
      return (index: number) => {
        if (cancelled || scrambled.has(index)) return;
        scrambled.add(index);
        const item = statItems[index];
        if (!item) return;
        scrambleStatItem(item, index, tweens);
      };
    }

    const track = container;

    function isCollectionInView(collection: HTMLElement) {
      const rect = collection.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
    }

    const mm = gsap.matchMedia();

    mm.add(MOBILE_CAROUSEL_MQ, () => {
      const scrambled = new Set<number>();
      const scrambleIndex = createScrambleIndex(scrambled);
      const triggers: ScrollTrigger[] = [];

      function syncMobileActiveStat() {
        const slider = track.closest<HTMLElement>("[data-gsap-slider-init]");
        const collection =
          slider?.querySelector<HTMLElement>("[data-gsap-slider-collection]") ??
          track.parentElement;

        if (!collection || !isCollectionInView(collection)) return;

        const activeItem =
          slider?.querySelector<HTMLElement>(
            '[data-gsap-slider-item-status="active"]',
          ) ?? statItems[0];

        if (!activeItem) return;

        const index = statItems.indexOf(activeItem);
        if (index >= 0) {
          scrambleIndex(index);
        }
      }

      syncMobileStatScrambleRef.current = syncMobileActiveStat;

      const setup = () => {
        const collection =
          track.closest<HTMLElement>("[data-gsap-slider-collection]") ??
          track.parentElement;
        if (!collection) return;

        triggers.push(
          ScrollTrigger.create({
            trigger: collection,
            scroller: document.body,
            start: "top 88%",
            end: "bottom top",
            onEnter: syncMobileActiveStat,
            onEnterBack: syncMobileActiveStat,
          }),
        );

        ScrollTrigger.refresh();
      };

      const fonts = (
        document as Document & { fonts?: { ready: Promise<unknown> } }
      ).fonts;

      if (fonts?.ready) {
        fonts.ready.then(setup);
      } else {
        setup();
      }

      return () => {
        triggers.forEach((trigger) => trigger.kill());
        syncMobileStatScrambleRef.current = () => {};
      };
    });

    mm.add("(min-width: 640px)", () => {
      const scrambled = new Set<number>();
      const scrambleIndex = createScrambleIndex(scrambled);
      const triggers: ScrollTrigger[] = [];

      const setup = () => {
        statItems.forEach((item, index) => {
          triggers.push(
            ScrollTrigger.create({
              trigger: item,
              scroller: document.body,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
              onEnter: () => scrambleIndex(index),
            }),
          );
        });

        ScrollTrigger.refresh();
      };

      const fonts = (
        document as Document & { fonts?: { ready: Promise<unknown> } }
      ).fonts;

      if (fonts?.ready) {
        fonts.ready.then(setup);
      } else {
        setup();
      }

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    });

    return () => {
      cancelled = true;
      syncMobileStatScrambleRef.current = () => {};
      mm.revert();
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      scrambleTargets.forEach((el, i) => {
        el.textContent = originals[i];
      });
    };
  }, []);

  return (
    <SectionFrame
      id="ado-pro"
      data-progress-nav-anchor
      data-nav-theme="dark"
      className="case-study-section"
      frameClassName="case-study-section__frame relative flex min-h-[100dvh] flex-col lg:h-[100dvh] lg:max-h-[100dvh] lg:flex-row lg:overflow-hidden"
    >
      <div className="case-study-section__content flex flex-1 flex-col px-8 py-16 sm:px-16 lg:min-h-0 lg:px-16 lg:pt-20 lg:pb-14">
        <div className="case-study-section__header flex max-w-3xl shrink-0 flex-col gap-8">
          <ScrollFadeText className="case-study-section__title type-section-title text-white">
            ADO Pro.{" "}
            <span className="text-[#cddfed]">
              Gebouwd voor en met arbeidsdeskundigen.
            </span>
          </ScrollFadeText>
          <ScrollFadeText
            as="p"
            className="case-study-section__intro type-section-lead max-w-2xl text-white"
            delay={0.12}
          >
            ADO Pro automatiseert het voorbereidende werk van
            arbeidsdeskundigen, van dossierstudie tot rapportgeneratie. Live
            in productie, gebouwd op de methode die we voor elk domein
            inzetten.
          </ScrollFadeText>
        </div>

        <div className="case-study-section__stats-wrap flex w-full flex-1 flex-col pt-12 lg:min-h-0 lg:pt-6">
          <GsapSlider
            className="case-study-section__stats my-auto"
            collectionClassName="case-study-section__stats-collection"
            trackClassName="case-study-section__stats-track"
            trackAs="ul"
            trackRef={statsRef}
            ariaLabel="Case study statistieken"
            onUpdate={() => syncMobileStatScrambleRef.current()}
          >
            {STATS.map((stat) => {
              const { integer, fraction } = splitNumberParts(stat.number);

              return (
                <li
                  key={stat.value}
                  data-gsap-slider-item
                  data-case-study-grid-item
                  className="case-study-stat"
                >
                  <div className="case-study-stat__body">
                    <span
                      className="case-study-stat-value type-stat"
                      data-case-study-grid-content="kpi"
                      aria-label={stat.value}
                    >
                      <span className="case-study-stat-value__scramble">{integer}</span>
                      {fraction !== null ? (
                        <>
                          <span className="case-study-stat-value__separator">,</span>
                          <span className="case-study-stat-value__scramble">{fraction}</span>
                        </>
                      ) : null}
                      {stat.unit ? (
                        <span className="case-study-stat-value__unit">{stat.unit}</span>
                      ) : null}
                    </span>
                    <div
                      className="case-study-stat__copy flex flex-col gap-3"
                      data-case-study-grid-content="copy"
                    >
                      <h3 className="type-body-strong text-white">
                        {stat.label}
                      </h3>
                      <p className="case-study-stat__description type-body font-extralight text-white">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </GsapSlider>

          <div className="case-study-section__cta shrink-0 pt-10 lg:pt-8">
            <TransitionLink
              className="case-study-section__cta-link"
              href="/cases/ado-pro"
            >
              <span>Volledige case lezen</span>
              <CaretRightIcon
                aria-hidden
                className="case-study-section__cta-icon"
                weight="thin"
              />
            </TransitionLink>
          </div>
        </div>
      </div>

      <div className="case-study-visual relative flex flex-1 min-h-[40vh] lg:min-h-0">
        <Image
          src="/images/ADOPRO-cover2.png"
          alt="Werksessie tijdens het ADO Pro project, domeinexperts werken samen aan dossier- en procesontwerp"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="case-study-visual__img"
        />
      </div>
    </SectionFrame>
  );
}
