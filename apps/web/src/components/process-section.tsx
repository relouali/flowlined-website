import PixelatedScrollTransition from "@/components/pixelated-scroll-transition";
import ProcessStepArt from "@/components/process-step-art";
import ShutterScrollTransition from "@/components/shutter-scroll-transition";
import StepsTimeline from "@/components/steps-timeline";
import StickyTitleScroll from "@/components/sticky-title-scroll";

const INTRO_HEADING = ["Zo bouwen wij het anders."] as const;

const OUTRO_HEADINGS = [
  "Geen generieke tool die je zelf moet inrichten. Geen maatwerk dat niet schaalt.",
  "Wij bouwen verticale producten van de grond af, samen met de expert die het domein kent.",
] as const;

const STEPS = [
  {
    title: "Verkennen",
    description:
      "Samen onderzoeken we of het domein zich leent voor een verticaal product. We brengen het werkproces in kaart, toetsen of de kennis formaliseerbaar is, en bepalen of er een markt achter zit.",
    bullets: [
      "Werkprocessen en beslislogica in kaart brengen",
      "Marktpotentieel en concurrentielandschap valideren",
      "Formaliseerbare regels en criteria identificeren",
    ],
  },
  {
    title: "Modelleren",
    description:
      "De domeinkennis wordt vertaald naar systeemlogica. Geen promptgestuurde AI, maar gestructureerde regels, criteria en uitzonderingen die ingebed worden in de software.",
    bullets: [
      "Domeinregels structureren en valideren met de expert",
      "Beoordelingscriteria en uitzonderingen formaliseren",
      "Informatiestromen en dossierstructuur definiëren",
    ],
  },
  {
    title: "Bouwen",
    description:
      "Software engineers en AI engineers bouwen het product. Eigen merk, eigen interface, afgestemd op het dagelijkse werk van de eindgebruiker.",
    bullets: [
      "Product design en technische architectuur",
      "AI-modellen trainen op domeinspecifieke data",
      "Iteratief ontwikkelen met de domeinpartner",
    ],
  },
  {
    title: "Lanceren",
    description:
      "Het product gaat live bij echte gebruikers. De domeinpartner beheert de klantrelatie en de markt. Flowlined levert technische doorontwikkeling en operationele support.",
    bullets: [
      "Onboarding van eerste gebruikers",
      "Feedback loops en productiteraties",
      "Branding, marketing en customer success",
    ],
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
        <div className="px-16 py-24 lg:py-32">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col">
            <StepsTimeline>
              <ol className="flex flex-col">
                {STEPS.map((step, index) => (
                  <ProcessStep key={step.title} index={index} step={step} />
                ))}
              </ol>
            </StepsTimeline>
          </div>
        </div>
        <ShutterScrollTransition mode="cover" color="#CDDFED" />
      </div>

      <div className="bg-[#CDDFED]">
        <StickyTitleScroll headings={OUTRO_HEADINGS} heightVh={300} />
      </div>
    </section>
  );
}

type ProcessStepProps = {
  index: number;
  step: (typeof STEPS)[number];
};

function ProcessStep({ index, step }: ProcessStepProps) {
  return (
    <li
      className="grid min-h-[100dvh] grid-cols-[2rem_1fr] items-start gap-6 pt-[20vh] lg:grid-cols-[2rem_1fr_1fr] lg:gap-12"
    >
      <div className="flex h-[2.156rem] items-center justify-center lg:h-[2.875rem]">
        <div
          data-step-dot
          data-reached="false"
          className="relative z-10 size-2.5 rounded-full bg-[#ccced0] shadow-[0_0_0_6px_white] transition-colors duration-300 data-[reached=true]:bg-[#000c10]"
        />
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-3xl font-light leading-[1.15] text-[#000c10] lg:text-[2.5rem]">
          {step.title}
        </h3>
        <p className="text-lg font-light leading-relaxed text-[#000c10]/75 lg:text-xl">
          {step.description}
        </p>

        <ul className="flex flex-col gap-3 pt-1">
          {step.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 text-base font-light leading-relaxed text-[#000c10]/70 lg:text-lg"
            >
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-[#3b6a82]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden lg:-mt-16 lg:block">
        <ProcessStepArt step={index} />
      </div>
    </li>
  );
}
