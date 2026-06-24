import HighlightText from "@/components/highlight-text";
import ProcessArtPlayback from "@/components/process-art-playback";
import ProcessStepArt from "@/components/process-step-art";

import "./horizontal-steps.css";

export type HorizontalStep = {
  phase: string;
  title: string;
  description: string;
};

type HorizontalStepsProps = {
  steps: ReadonlyArray<HorizontalStep>;
  title: string;
  titleMuted: string;
  description: string;
};

export default function HorizontalSteps({
  steps,
  title,
  titleMuted,
  description,
}: HorizontalStepsProps) {
  return (
    <div className="horizontal-steps">
      <div className="horizontal-steps__inner">
        <header className="horizontal-steps__header">
          <HighlightText
            className="type-section-title text-center text-[#000c10]"
            scrollStart="top 82%"
            scrollEnd="top 48%"
            stagger={0.05}
          >
            {title}{" "}
            <span className="text-[#000c10]/45">{titleMuted}</span>
          </HighlightText>

          <p className="horizontal-steps__intro type-section-lead">
            {description}
          </p>
        </header>

        <ProcessArtPlayback>
          {steps.map((step, index) => (
            <ProcessCard key={step.title} index={index} step={step} />
          ))}
        </ProcessArtPlayback>
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
    <li data-gsap-slider-item className="horizontal-steps__card">
      <span className="horizontal-steps__pill">{step.phase}</span>
      <h3 className="horizontal-steps__title type-body-strong">
        {step.title}
      </h3>
      <p className="horizontal-steps__description type-body">{step.description}</p>
      <div className="horizontal-steps__art">
        <ProcessStepArt step={index} />
      </div>
    </li>
  );
}
