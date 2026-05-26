import "./process-step-art.css";

type ProcessStepArtProps = {
  step: number;
};

export default function ProcessStepArt({ step }: ProcessStepArtProps) {
  return (
    <div className="process-art relative aspect-square w-full">
      {step === 0 ? (
        <VerkennenArt />
      ) : step === 1 ? (
        <ModellerenArt />
      ) : step === 2 ? (
        <BouwenArt />
      ) : step === 3 ? (
        <LancerenArt />
      ) : (
        <PlaceholderArt step={step} />
      )}
    </div>
  );
}

function VerkennenArt() {
  return (
    <svg
      aria-hidden
      className="process-art__svg absolute inset-0"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="process-art__breath"
        cx="200"
        cy="200"
        fill="none"
        r="130"
        stroke="#000c10"
        strokeOpacity="0.12"
        strokeWidth="0.75"
      />

      <path
        className="process-art__route"
        d="M 70 110 C 110 90 150 120 180 150 S 240 170 260 200 S 310 250 280 290 S 200 320 170 280 S 130 220 200 200"
        pathLength="1"
        stroke="#000c10"
        strokeLinecap="round"
        strokeWidth="1.1"
      />

      <g
        className="process-art__markers"
        fill="none"
        stroke="#000c10"
        strokeLinecap="round"
        strokeWidth="1"
      >
        <g className="process-art__marker process-art__marker--1" transform="translate(180 150)">
          <line x1="-4.5" x2="4.5" y1="-4.5" y2="4.5" />
          <line x1="-4.5" x2="4.5" y1="4.5" y2="-4.5" />
        </g>
        <g className="process-art__marker process-art__marker--2" transform="translate(280 290)">
          <line x1="-4.5" x2="4.5" y1="-4.5" y2="4.5" />
          <line x1="-4.5" x2="4.5" y1="4.5" y2="-4.5" />
        </g>
        <g className="process-art__marker process-art__marker--3" transform="translate(170 280)">
          <line x1="-4.5" x2="4.5" y1="-4.5" y2="4.5" />
          <line x1="-4.5" x2="4.5" y1="4.5" y2="-4.5" />
        </g>
      </g>

      <g className="process-art__target" transform="translate(200 200)">
        <circle fill="none" r="12" stroke="#000c10" strokeWidth="0.9" />
        <circle fill="#000c10" r="2" />
      </g>
    </svg>
  );
}

function ModellerenArt() {
  return (
    <svg
      aria-hidden
      className="process-art__svg absolute inset-0"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="process-art__breath"
        cx="200"
        cy="200"
        fill="none"
        r="130"
        stroke="#000c10"
        strokeOpacity="0.12"
        strokeWidth="0.75"
      />

      <g fill="none" stroke="#000c10" strokeLinecap="round" strokeWidth="1">
        <path
          className="process-art__branch process-art__branch--l1-a"
          d="M 200 120 C 200 158 146 158 146 196"
          pathLength="1"
        />
        <path
          className="process-art__branch process-art__branch--l1-b"
          d="M 200 120 C 200 158 254 158 254 196"
          pathLength="1"
        />

        <path
          className="process-art__branch process-art__branch--l2-a"
          d="M 146 196 C 146 234 125 234 125 272"
          pathLength="1"
        />
        <path
          className="process-art__branch process-art__branch--l2-b"
          d="M 146 196 C 146 234 173 234 173 272"
          pathLength="1"
        />
        <path
          className="process-art__branch process-art__branch--l2-c"
          d="M 254 196 C 254 234 227 234 227 272"
          pathLength="1"
        />
        <path
          className="process-art__branch process-art__branch--l2-d"
          d="M 254 196 C 254 234 275 234 275 272"
          pathLength="1"
        />
      </g>

      <g fill="#000c10">
        <circle
          className="process-art__tree-node process-art__tree-node--root"
          cx="200"
          cy="120"
          r="4"
        />

        <circle
          className="process-art__tree-node process-art__tree-node--l1-a"
          cx="146"
          cy="196"
          r="3.5"
        />
        <circle
          className="process-art__tree-node process-art__tree-node--l1-b"
          cx="254"
          cy="196"
          r="3.5"
        />

        <circle
          className="process-art__tree-node process-art__tree-node--l2-a"
          cx="125"
          cy="272"
          r="3"
        />
        <circle
          className="process-art__tree-node process-art__tree-node--l2-b"
          cx="173"
          cy="272"
          r="3"
        />
        <circle
          className="process-art__tree-node process-art__tree-node--l2-c"
          cx="227"
          cy="272"
          r="3"
        />
        <circle
          className="process-art__tree-node process-art__tree-node--l2-d"
          cx="275"
          cy="272"
          r="3"
        />
      </g>
    </svg>
  );
}

function BouwenArt() {
  return (
    <svg
      aria-hidden
      className="process-art__svg absolute inset-0"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="process-art__frame"
        fill="none"
        height="180"
        pathLength="1"
        rx="12"
        stroke="#000c10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        width="240"
        x="80"
        y="110"
      />

      <line
        className="process-art__header-line"
        pathLength="1"
        stroke="#000c10"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        x1="80"
        x2="320"
        y1="138"
        y2="138"
      />

      <line
        className="process-art__sidebar-divider"
        pathLength="1"
        stroke="#000c10"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        x1="132"
        x2="132"
        y1="138"
        y2="290"
      />

      <g fill="#000c10">
        <circle
          className="process-art__header-btn process-art__header-btn--1"
          cx="268"
          cy="124"
          r="2.5"
        />
        <circle
          className="process-art__header-btn process-art__header-btn--2"
          cx="284"
          cy="124"
          r="2.5"
        />
        <circle
          className="process-art__header-btn process-art__header-btn--3"
          cx="300"
          cy="124"
          r="2.5"
        />
      </g>

      <g stroke="#000c10" strokeLinecap="round" strokeOpacity="0.7" strokeWidth="1">
        <line
          className="process-art__sidebar-item process-art__sidebar-item--1"
          pathLength="1"
          x1="92"
          x2="122"
          y1="158"
          y2="158"
        />
        <line
          className="process-art__sidebar-item process-art__sidebar-item--2"
          pathLength="1"
          x1="92"
          x2="122"
          y1="180"
          y2="180"
        />
        <line
          className="process-art__sidebar-item process-art__sidebar-item--3"
          pathLength="1"
          x1="92"
          x2="122"
          y1="202"
          y2="202"
        />
      </g>

      <g stroke="#000c10" strokeLinecap="round" strokeOpacity="0.75" strokeWidth="1.1">
        <line
          className="process-art__row process-art__row--1"
          pathLength="1"
          x1="148"
          x2="296"
          y1="164"
          y2="164"
        />
        <line
          className="process-art__row process-art__row--2"
          pathLength="1"
          x1="148"
          x2="278"
          y1="180"
          y2="180"
        />
      </g>

      <rect
        className="process-art__drop-zone"
        fill="none"
        height="58"
        rx="4"
        stroke="#000c10"
        strokeDasharray="4 4"
        strokeOpacity="0.45"
        strokeWidth="1"
        width="160"
        x="148"
        y="192"
      />

      <g
        className="process-art__result-rows"
        stroke="#000c10"
        strokeLinecap="round"
        strokeOpacity="0.7"
        strokeWidth="0.95"
      >
        <line
          className="process-art__result-row process-art__result-row--1"
          x1="148"
          x2="296"
          y1="202"
          y2="202"
        />
        <line
          className="process-art__result-row process-art__result-row--2"
          x1="148"
          x2="270"
          y1="212"
          y2="212"
        />
        <line
          className="process-art__result-row process-art__result-row--3"
          x1="148"
          x2="290"
          y1="222"
          y2="222"
        />
        <line
          className="process-art__result-row process-art__result-row--4"
          x1="148"
          x2="246"
          y1="232"
          y2="232"
        />
      </g>

      <rect
        className="process-art__cta"
        fill="#000c10"
        height="20"
        rx="5"
        width="62"
        x="148"
        y="258"
      />

      <g className="process-art__doc">
        <rect
          fill="white"
          height="36"
          rx="2"
          stroke="#000c10"
          strokeLinejoin="round"
          strokeWidth="1.1"
          width="28"
          x="214"
          y="203"
        />
        <path
          d="M 234 204 L 234 210 L 240 210"
          fill="none"
          stroke="#000c10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.9"
        />
        <g
          stroke="#000c10"
          strokeLinecap="round"
          strokeOpacity="0.55"
          strokeWidth="0.9"
        >
          <line x1="219" x2="236" y1="218" y2="218" />
          <line x1="219" x2="232" y1="224" y2="224" />
          <line x1="219" x2="236" y1="230" y2="230" />
          <line x1="219" x2="228" y1="236" y2="236" />
        </g>
      </g>
    </svg>
  );
}

function LancerenArt() {
  return (
    <svg
      aria-hidden
      className="process-art__svg absolute inset-0"
      fill="none"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="#000c10" strokeLinecap="round" strokeWidth="1">
        <line
          className="process-art__zap process-art__zap--1"
          pathLength="1"
          x1="60"
          x2="140"
          y1="330"
          y2="320"
        />
        <line
          className="process-art__zap process-art__zap--2"
          pathLength="1"
          x1="140"
          x2="205"
          y1="320"
          y2="290"
        />
        <line
          className="process-art__zap process-art__zap--3"
          pathLength="1"
          x1="205"
          x2="250"
          y1="290"
          y2="230"
        />
        <line
          className="process-art__zap process-art__zap--4"
          pathLength="1"
          x1="250"
          x2="290"
          y1="230"
          y2="160"
        />
        <line
          className="process-art__zap process-art__zap--5"
          pathLength="1"
          x1="290"
          x2="325"
          y1="160"
          y2="80"
        />
      </g>

      <g fill="#000c10">
        <circle
          className="process-art__node process-art__node--1"
          cx="60"
          cy="330"
          r="3.6"
        />
        <circle
          className="process-art__node process-art__node--2"
          cx="140"
          cy="320"
          r="3.6"
        />
        <circle
          className="process-art__node process-art__node--3"
          cx="205"
          cy="290"
          r="3.6"
        />
        <circle
          className="process-art__node process-art__node--4"
          cx="250"
          cy="230"
          r="3.6"
        />
        <circle
          className="process-art__node process-art__node--5"
          cx="290"
          cy="160"
          r="3.6"
        />
        <circle
          className="process-art__node process-art__node--6"
          cx="325"
          cy="80"
          r="3.6"
        />
      </g>
    </svg>
  );
}

function PlaceholderArt({ step }: { step: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-mono text-sm font-light tracking-widest text-[#000c10]/30">
        0{step + 1}
      </span>
    </div>
  );
}
