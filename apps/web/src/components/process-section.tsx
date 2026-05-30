import HorizontalSteps from "@/components/horizontal-steps";
import PixelatedScrollTransition from "@/components/pixelated-scroll-transition";
import ShutterScrollTransition from "@/components/shutter-scroll-transition";
import StickyTitleScroll from "@/components/sticky-title-scroll";

const INTRO_HEADING = ["Zo bouwen wij het anders."] as const;

const OUTRO_HEADINGS = [
  "Geen generieke tool die je zelf moet inrichten. Geen maatwerk dat niet schaalt.",
  "Wij bouwen verticale producten van de grond af, samen met de expert die het domein kent.",
] as const;

const STEPS = [
  {
    phase: "Onderzoek",
    title: "Verkennen",
    description:
      "Samen onderzoeken we of het domein zich leent voor een verticaal product. We brengen het werkproces in kaart, toetsen of de kennis formaliseerbaar is, en bepalen of er een markt achter zit.",
  },
  {
    phase: "Ontwerp",
    title: "Modelleren",
    description:
      "De domeinkennis wordt vertaald naar systeemlogica. Geen promptgestuurde AI, maar gestructureerde regels, criteria en uitzonderingen die ingebed worden in de software.",
  },
  {
    phase: "Ontwikkeling",
    title: "Bouwen",
    description:
      "Software engineers en AI engineers bouwen het product. Eigen merk, eigen interface, afgestemd op het dagelijkse werk van de eindgebruiker.",
  },
  {
    phase: "Lancering",
    title: "Lanceren",
    description:
      "Het product gaat live bij echte gebruikers. De domeinpartner beheert de klantrelatie en de markt. Flowlined levert technische doorontwikkeling en operationele support.",
  },
] as const;

export default function ProcessSection() {
  return (
    <section
      id="proces"
      data-progress-nav-anchor
      data-nav-theme="light"
      className="bg-white"
    >
      <div className="relative">
        <StickyTitleScroll headings={INTRO_HEADING} heightVh={200} gradientBackground />
        <PixelatedScrollTransition
          mode="cover"
          color="#ffffff"
          columns={16}
          columnsTablet={10}
          columnsMobile={6}
          rows={6}
        />
      </div>

      <div className="relative">
        <HorizontalSteps steps={STEPS} />
        <ShutterScrollTransition mode="cover" color="#CDDFED" />
      </div>

      <div className="bg-[#CDDFED]">
        <StickyTitleScroll headings={OUTRO_HEADINGS} heightVh={300} />
      </div>
    </section>
  );
}
