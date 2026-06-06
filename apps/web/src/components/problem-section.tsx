import HighlightText from "@/components/highlight-text";
import GsapSlider from "@/components/gsap-slider";
import LottieIcon from "@/components/lottie-icon";

import "./problem-section.css";

const ITEMS = [
  {
    title: "Verspreide kennis",
    description:
      "Cruciale expertise zit in mensen, spreadsheets en mailketens. Kwetsbaar en moeilijk toegankelijk op het moment dat het ertoe doet.",
    lottieSrc: "/icons/spreaded-knowledge.json",
    iconSize: 48,
  },
  {
    title: "Herhalend voorwerk",
    description:
      "Experts besteden tot 40% van hun tijd aan werk dat ze al eerder hebben gedaan. Dezelfde output, steeds opnieuw handmatig opgebouwd.",
    lottieSrc: "/icons/repeating-work.json",
    iconSize: 48,
  },
  {
    title: "Wisselende kwaliteit",
    description:
      "Zonder gestructureerde systemen levert hetzelfde proces verschillende resultaten op, afhankelijk van wie het uitvoert, wanneer, en onder welke druk.",
    lottieSrc: "/icons/inconsistent-quality.json",
    iconSize: 48,
  },
  {
    title: "Schaalbaarheid",
    description:
      "Groei betekent meer experts inhuren. Maar onboarding is traag, talent is schaars, en marges krimpen met elke nieuwe aanname.",
    lottieSrc: "/icons/scale.json",
    iconSize: 48,
  },
] as const;

export default function ProblemSection() {
  return (
    <section
      id="probleem"
      data-progress-nav-anchor
      className="problem-section flex min-h-[100dvh] items-center bg-[#0a1418] px-8 py-24 sm:px-16 lg:py-32"
    >
      <div className="mx-auto flex w-full max-w-[1320px] flex-col">
        <div className="flex max-w-3xl flex-col gap-8">
          <HighlightText className="type-section-title text-white">
          Expertwerk draait op ervaring, niet op systemen.{" "}
            <span className="text-[#cddfed]">Dat werkt, tot het niet meer schaalt.</span>
          </HighlightText>

          <p className="type-section-lead max-w-2xl text-white/80">
            Beoordelaars, auditors en inspecteurs leveren werk van hoog niveau. Maar de
            systemen waarop dat werk draait zijn dat niet. Dit zijn de gevolgen:
          </p>
        </div>

        <GsapSlider
          className="problem-items"
          collectionClassName="problem-items__collection"
          trackClassName="problem-items__track"
          ariaLabel="Probleemstellingen"
        >
          {ITEMS.map((item, index) => (
            <ProblemItem key={index} item={item} />
          ))}
        </GsapSlider>
      </div>
    </section>
  );
}

function ProblemItem({ item }: { item: (typeof ITEMS)[number] }) {
  return (
    <div data-gsap-slider-item className="problem-item flex flex-col gap-6">
      <LottieIcon size={item.iconSize} src={item.lottieSrc} />
      <div className="flex flex-col gap-3 text-white">
        <h3 className="type-card-title text-white">{item.title}</h3>
        <p className="type-body text-white/70">{item.description}</p>
      </div>
    </div>
  );
}
