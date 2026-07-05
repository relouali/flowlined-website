import { Fragment } from "react";

import CircularSteps from "@/components/circular-steps";
import SectionFrame from "@/components/section-frame";
import StickyTitleScroll from "@/components/sticky-title-scroll";

const OUTRO_HEADINGS = [
  <Fragment key="outro-1">
    Geen generieke tool die je zelf moet inrichten.{" "}
    <span className="sticky-title-el__muted">Geen maatwerk dat niet schaalt.</span>
  </Fragment>,
  <Fragment key="outro-2">
    Wij bouwen verticale producten van de grond af,{" "}
    <span className="sticky-title-el__muted">
      samen met de expert die het domein kent.
    </span>
  </Fragment>,
] as const;

const STEPS_HEADING = {
  title: "Van domeinkennis naar verticaal product.",
  titleMuted: "In vier fasen.",
  description:
    "Samen met de domeinexpert doorlopen we een gestructureerd traject, van eerste verkenning tot live product bij echte gebruikers.",
} as const;

const STEPS = [
  {
    phase: "Stap 1",
    title: "Verkennen",
    description:
      "Samen onderzoeken we of het domein zich leent voor een verticaal product. We brengen het werkproces in kaart, toetsen of de kennis formaliseerbaar is, en bepalen of er een markt achter zit.",
  },
  {
    phase: "Stap 2",
    title: "Modelleren",
    description:
      "De domeinkennis wordt vertaald naar systeemlogica. Geen promptgestuurde AI, maar gestructureerde regels, criteria en uitzonderingen die ingebed worden in de software.",
  },
  {
    phase: "Stap 3",
    title: "Bouwen",
    description:
      "Software engineers en AI engineers bouwen het product. Eigen merk, eigen interface, afgestemd op het dagelijkse werk van de eindgebruiker.",
  },
  {
    phase: "Stap 4",
    title: "Lanceren",
    description:
      "Het product gaat live bij echte gebruikers. De domeinpartner beheert de klantrelatie en de markt. Flowlined levert technische doorontwikkeling en operationele support.",
  },
] as const;

/** Previous process section — circular steps + sticky outro. */
export default function CircularProcessSection() {
  return (
    <SectionFrame
      id="proces"
      data-progress-nav-anchor
      className="process-section"
      frameClassName="circular-process__frame"
    >
      <CircularSteps
        steps={STEPS}
        title={STEPS_HEADING.title}
        titleMuted={STEPS_HEADING.titleMuted}
        description={STEPS_HEADING.description}
      />

      <StickyTitleScroll headings={OUTRO_HEADINGS} heightVh={300} />
    </SectionFrame>
  );
}
