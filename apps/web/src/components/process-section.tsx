import ProcessStepsGrid, { type ProcessStep } from "@/components/process-steps-grid";
import ScrollFadeText from "@/components/scroll-fade-text";
import SectionFrame from "@/components/section-frame";
import StickyTitleScroll from "@/components/sticky-title-scroll";

import "./process-section.css";

const OUTRO_HEADINGS = [
  "Geen generieke tool die je zelf moet inrichten. Geen maatwerk dat niet schaalt.",
  "Wij bouwen verticale producten van de grond af, samen met de expert die het domein kent.",
] as const;

const STEPS_HEADING = {
  title: "Van domeinkennis naar verticaal product.",
  titleMuted: "In vier fasen.",
  description:
    "Samen met de domeinexpert doorlopen we een gestructureerd traject, van eerste verkenning tot live product bij echte gebruikers.",
} as const;

const STEPS: readonly ProcessStep[] = [
  {
    index: "01",
    tags: ["Stap 1", "Werkproces", "Marktvalidatie"],
    title: "Verkennen.",
    description:
      "Samen onderzoeken we of het domein zich leent voor een verticaal product. We brengen het werkproces in kaart, toetsen of de kennis formaliseerbaar is, en bepalen of er een markt achter zit.",
  },
  {
    index: "02",
    tags: ["Stap 2", "Systeemlogica", "Regels & criteria"],
    title: "Modelleren.",
    description:
      "De domeinkennis wordt vertaald naar systeemlogica. Geen promptgestuurde AI, maar gestructureerde regels, criteria en uitzonderingen die ingebed worden in de software.",
  },
  {
    index: "03",
    tags: ["Stap 3", "Engineering", "Eigen merk"],
    title: "Bouwen.",
    description:
      "Software engineers en AI engineers bouwen het product. Eigen merk, eigen interface, afgestemd op het dagelijkse werk van de eindgebruiker.",
  },
  {
    index: "04",
    tags: ["Stap 4", "Live productie", "Doorontwikkeling"],
    title: "Lanceren.",
    description:
      "Het product gaat live bij echte gebruikers. De domeinpartner beheert de klantrelatie en de markt. Flowlined levert technische doorontwikkeling en operationele support.",
  },
];

export default function ProcessSection() {
  return (
    <SectionFrame
      id="proces"
      data-progress-nav-anchor
      data-nav-theme="light"
      className="process-section"
      frameClassName="section-frame--light section-frame--has-sticky"
    >
      <div className="process-section__viewport flex min-h-[100dvh] items-center py-24 md:py-32 lg:py-40">
      <div className="section-inner">
        <div className="process-section__layout">
          <div className="process-section__left">
            <ScrollFadeText className="type-section-title text-[#000c10]">
              {STEPS_HEADING.title}{" "}
              <span className="text-[#000c10]/45">{STEPS_HEADING.titleMuted}</span>
            </ScrollFadeText>
            <ScrollFadeText
              as="p"
              className="type-section-lead text-black/80"
              delay={0.12}
            >
              {STEPS_HEADING.description}
            </ScrollFadeText>
          </div>

          <ProcessStepsGrid steps={STEPS} />
        </div>
      </div>
      </div>

      <StickyTitleScroll headings={OUTRO_HEADINGS} heightVh={300} />
    </SectionFrame>
  );
}
