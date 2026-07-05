"use client";

import { useEffect, useRef } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initProcessGridLines } from "@/lib/init-process-grid-lines";

export type ProcessStep = {
  index: string;
  tags: readonly string[];
  title: string;
  description: string;
};

type ProcessStepsGridProps = {
  steps: readonly ProcessStep[];
};

export default function ProcessStepsGrid({ steps }: ProcessStepsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !gridRef.current) return;

    const revert = initProcessGridLines(gridRef.current);
    return revert;
  }, [locomotiveScroll]);

  return (
    <div ref={gridRef} className="process-steps-grid">
      {steps.map((step) => (
        <article
          key={step.index}
          className="process-step"
          data-process-grid-item
        >
          <span
            aria-hidden
            className="process-step__line process-step__line--left"
            data-process-grid-line="v"
          />
          <span
            aria-hidden
            className="process-step__line process-step__line--right"
            data-process-grid-line="v"
          />
          <span
            aria-hidden
            className="process-step__line process-step__line--top"
            data-process-grid-line="h"
          />
          <span
            aria-hidden
            className="process-step__line process-step__line--bottom"
            data-process-grid-line="h"
          />
          <span aria-hidden className="process-step__corner process-step__corner--tl" />
          <span aria-hidden className="process-step__corner process-step__corner--tr" />
          <span aria-hidden className="process-step__corner process-step__corner--bl" />
          <span aria-hidden className="process-step__corner process-step__corner--br" />
          <div
            className="process-step__head"
            data-process-grid-content="head"
          >
            <span className="process-step__number">{step.index}</span>
            <h3 className="process-step__title type-body-strong text-[#000c10]">
              {step.title}
            </h3>
          </div>
          <p
            className="process-step__desc"
            data-process-grid-content="copy"
          >
            {step.description}
          </p>
        </article>
      ))}
    </div>
  );
}
