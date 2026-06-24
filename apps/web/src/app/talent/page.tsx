import type { Metadata } from "next";
import Image from "next/image";
import {
  Brain,
  Building2,
  HandCoins,
  LaptopMinimal,
  TreePalm,
  Users,
  type LucideIcon,
} from "lucide-react";

import ManifestSection from "@/components/manifest-section";
import MasonryGrid, { type MasonryItem } from "@/components/masonry-grid";
import SiteFooter from "@/components/site-footer";
import TeamGrid, { type TeamMember } from "@/components/team-grid";

export const metadata: Metadata = {
  title: "Talent — Flowlined",
  description:
    "Technisch, gedreven en divers. De mensen achter de systemen die vakgebieden transformeren. Werken bij Flowlined.",
};

const TALENT_IMAGES: ReadonlyArray<MasonryItem> = [
  { src: "/images/talent/1778162497174.jpeg", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/1763626519928.jpeg", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/1763626521280.jpeg", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/1770794320607.jpeg", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/1778162497922.jpeg", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/1718884252684.jpeg", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/520385a7-3e1a-4650-b3f9-3513f9c0b84c.JPG", alt: "Flowlined teamlid aan het werk" },
  { src: "/images/talent/7fc2bc26-3313-4dc1-864c-fcdf45538bd3 2.JPG", alt: "Flowlined teamlid aan het werk" },
];

const VALUE_ITEMS = [
  {
    title: "Domeinverdieping",
    body: "Je werkt direct met vakprofessionals. Niet op afstand via een briefing, maar door hun werk te observeren, hun taal te leren en hun expertise te vertalen naar betere beslissingen binnen jouw discipline.",
  },
  {
    title: "Eigenaarschap over het geheel",
    body: "Geen strikte afbakening tussen afdelingen. Je ziet het volledige plaatje en draagt verantwoordelijkheid voor het product, niet alleen voor je eigen deliverable.",
  },
  {
    title: "Ventures, geen projecten",
    body: "Wat je bouwt verdwijnt niet na oplevering. Het groeit, het krijgt klanten, het genereert waarde. Je ziet het resultaat van je werk terug in de praktijk.",
  },
  {
    title: "Ondernemerschap als vereiste",
    body: "Wij zoeken mensen die onzekerheid productief maken. Die liever handelen met beperkte informatie dan wachten op een perfect plan.",
  },
] as const;

const BENEFIT_ITEMS: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: LaptopMinimal,
    title: "Flexibel en hybride werken",
    body: "Flexibele werkuren en de vrijheid om hybride te werken. Jij bepaalt waar en wanneer je het meest productief bent.",
  },
  {
    icon: HandCoins,
    title: "Competitief salaris",
    body: "Een pakket dat past bij de verantwoordelijkheid die je draagt en de impact die je maakt.",
  },
  {
    icon: TreePalm,
    title: "Onbeperkt vakantiedagen",
    body: "Wij sturen op resultaat, niet op aanwezigheid. Neem de tijd die je nodig hebt.",
  },
  {
    icon: Building2,
    title: "Kantoren in Amsterdam en Eindhoven",
    body: "Moderne werkplekken in Amsterdam en de High Tech Campus in Eindhoven.",
  },
  {
    icon: Brain,
    title: "Groei richting architectuur en AI",
    body: "Ruimte om je te ontwikkelen richting systeemontwerp, AI-engineering en technisch leiderschap.",
  },
  {
    icon: Users,
    title: "Klein team, korte lijnen",
    body: "Directe toegang tot founders, domeinpartners en eindgebruikers. Geen lagen tussen jou en de beslissingen die ertoe doen.",
  },
];

const TEAM_MEMBERS: ReadonlyArray<TeamMember> = [
  { name: "Nick Brandts", role: "Founder", image: "/images/team/Nick.jpg" },
  {
    name: "Marc Bouwman",
    role: "Head of Operations",
    image: "/images/team/Marc.jpg",
  },
  { name: "Jordy Slaats", role: "Head of Finance & Legal" },
  { name: "Jonas Pieters", role: "Business Developer" },
  {
    name: "Sander van den Brink",
    role: "Customer Success",
    image: "/images/team/sander-brink.jpg",
  },
  { name: "Tonia Marais", role: "Solution Finder" },
  { name: "Mohammed Shomis", role: "Tech Lead" },
  {
    name: "Sander Vlug",
    role: "Cloud & Security Engineer",
    image: "/images/team/Sander-vlug.jpg",
  },
  { name: "Wentzel", role: "AWS & Azure Cloud Engineer" },
  { name: "Mihnea Matea", role: "Full-stack developer" },
  {
    name: "Afaan Muhammad",
    role: "AI Engineer",
    image: "/images/team/afaan.jpg",
  },
  {
    name: "Rachid el Ouali",
    role: "Product Designer",
    image: "/images/team/Rachid.png",
  },
];

export default function TalentPage() {
  return (
    <div className="bg-white text-black">
      <main className="w-full">
        {/* --------------------------------------------- Hero — dark band */}
        {/* Match progress-nav horizontal padding: 1.5rem (mobile), 4rem (desktop). */}
        <section
          className="bg-[#0a1418] px-6 text-white md:px-16"
          data-nav-theme="dark"
        >
          <div className="flex w-full flex-col gap-[var(--section-gap)] pb-[var(--section-gap)] pt-32 lg:pt-44">
            <h1 className="type-section-title max-w-[56rem] text-[#f8fafd]">
              Technisch. Gedreven. Divers.{" "}
              <span className="text-[#cddfed]">
                De mensen achter de systemen die vakgebieden transformeren.
              </span>
            </h1>

            <MasonryGrid items={TALENT_IMAGES} />
          </div>
        </section>

        {/* ------------------------------ Meer dan software — white band */}
        <section className="w-full px-6 py-[var(--section-gap)] md:px-16">
          <div className="flex w-full flex-col gap-12 lg:gap-16">
            <h2 className="type-section-title font-light text-black">
              Meer dan <span className="text-black/45">software</span>
            </h2>

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[648fr_600fr] lg:gap-16">
              {/* Portrait */}
              <div
                className="relative w-full shrink-0 overflow-hidden"
                style={{ aspectRatio: "648/800" }}
              >
                <Image
                  alt="Medewerker van Flowlined"
                  className="object-cover"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 640px, (min-width: 768px) calc(100vw - 8rem), calc(100vw - 3rem)"
                  src="/images/talent-portrait.jpg"
                  style={{ objectPosition: "20% center" }}
                />
              </div>

              {/* Copy + values */}
              <div className="flex flex-col gap-10 lg:gap-12">
                <div className="flex flex-col gap-5">
                  <p className="type-body-light">
                    Bij Flowlined is geen enkele rol puur uitvoerend. Of je nu
                    ontwikkelt, verkoopt of klanten begeleidt, je werkt direct
                    met domeinexperts en begrijpt het vakgebied waarvoor je
                    bouwt. Je denkt mee over welk product er moet bestaan, niet
                    alleen over jouw onderdeel ervan.
                  </p>
                  <p className="type-body-light">
                    Software is het middel. Het resultaat is een werkend
                    product, een groeiende venture, en een vakgebied dat
                    fundamenteel beter functioneert.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
                  {VALUE_ITEMS.map((item) => (
                    <div key={item.title} className="flex flex-col gap-4">
                      <p className="type-body-strong text-black">
                        {item.title}
                      </p>
                      <p className="type-body-light">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------- De ruimte en middelen — tinted full-width band */}
        <section className="w-full bg-[#f8fafd] px-6 py-[var(--section-gap)] md:px-16">
          <div className="grid w-full grid-cols-1 items-start gap-12 lg:grid-cols-[518px_minmax(0,1fr)] lg:gap-20">
            <div className="flex flex-col gap-6">
              <h2 className="type-section-title font-light text-black">
                De ruimte en middelen{" "}
                <span className="text-black/45">om je beste werk te doen</span>
              </h2>
              <p className="type-section-lead text-black/60">
                We bieden de voorwaarden waaronder goed werk vanzelfsprekend
                wordt: vrijheid in hoe je werkt, een omgeving die meegroeit met
                je ambities en de ruimte om echt eigenaarschap te nemen.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:gap-x-12">
              {BENEFIT_ITEMS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Icon
                      aria-hidden
                      className="size-6 shrink-0 text-black"
                      strokeWidth={1}
                    />
                    <p className="type-body-strong text-black">{title}</p>
                  </div>
                  <p className="type-body-light">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------ Team — dark band */}
        <section
          className="bg-[#0a1418] px-6 text-white md:px-16"
          data-nav-theme="dark"
        >
          <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-[var(--section-gap)] py-[var(--section-gap)]">
            <div className="mx-auto flex max-w-[56rem] flex-col items-center gap-6 text-center">
              <h2 className="type-section-title text-[#f8fafd]">
                Een compact team van{" "}
                <span className="text-[#cddfed]">
                  bouwers, denkers en ondernemers
                </span>{" "}
                dat dicht op het domein opereert.
              </h2>
              <p className="type-section-lead text-white/80">
                Geen managementlagen. Geen afdelingen. Iedereen opereert over de
                grenzen van zijn rol en draagt verantwoordelijkheid voor het
                geheel.
              </p>
            </div>

            <TeamGrid members={TEAM_MEMBERS} />
          </div>
        </section>
      </main>

      {/* ------------------------------------------------- Contact CTA + footer */}
      <div className="bg-[#0a1418]" data-nav-theme="dark">
        <ManifestSection
          title={
            <>
              Word onderdeel
              <br />
              van het team.
            </>
          }
          lead="Herken jij jezelf hierin en wil je bouwen aan producten die een vakgebied fundamenteel beter maken? We maken graag kennis."
        />
      </div>

      <div data-nav-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
