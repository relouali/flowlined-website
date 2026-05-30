"use client";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import ProcessStepArt from "@/components/process-step-art";

import "./horizontal-steps.css";

export type HorizontalStep = {
  phase: string;
  title: string;
  description: string;
};

type HorizontalStepsProps = {
  steps: ReadonlyArray<HorizontalStep>;
};

export default function HorizontalSteps({ steps }: HorizontalStepsProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll) return;
    const inner = innerRef.current;
    const track = trackRef.current;
    if (!inner || !track) return;

    gsap.registerPlugin(Draggable);

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const getBounds = () => ({
          minX: Math.min(0, inner.clientWidth - track.scrollWidth),
          maxX: 0,
        });

        const [draggable] = Draggable.create(track, {
          type: "x",
          bounds: getBounds(),
          inertia: false,
          edgeResistance: 0.85,
          allowNativeTouchScrolling: true,
          onPress: () => inner.classList.add("is-dragging"),
          onRelease: () => inner.classList.remove("is-dragging"),
        });

        const handleResize = () => {
          draggable.applyBounds(getBounds());
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      },
    );

    return () => {
      mm.revert();
    };
  }, [locomotiveScroll]);

  return (
    <div className="horizontal-steps">
      <div ref={innerRef} className="horizontal-steps__inner">
        <div ref={trackRef} className="horizontal-steps__track">
          {steps.map((step, index) => (
            <ProcessCard key={step.title} index={index} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ProcessCardProps = {
  index: number;
  step: HorizontalStep;
};

function ProcessCard({ index, step }: ProcessCardProps) {
  return (
    <article className="horizontal-steps__card">
      <span className="horizontal-steps__pill">{step.phase}</span>
      <h3 className="horizontal-steps__title">{step.title}</h3>
      <p className="horizontal-steps__description">{step.description}</p>
      <div className="horizontal-steps__art">
        <ProcessStepArt step={index} />
      </div>
    </article>
  );
}
