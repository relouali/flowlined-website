import type { Metadata } from "next";
import Image from "next/image";

import HighlightText from "@/components/highlight-text";
import ManifestSection from "@/components/manifest-section";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Over ons — Flowlined",
  description:
    "Flowlined is een venture builder met technische diepgang. We bouwen producten mét partners, niet in opdracht.",
};

const METHOD_ITEMS = [
  {
    label: "Eigenaar, geen leverancier",
    body: "We bouwen geen software in opdracht. We bouwen producten waar we zelf in geloven, met partners die we zelf kiezen. Dat verandert hoe we beslissingen nemen.",
  },
  {
    label: "Domein eerst, techniek volgt",
    body: "We beginnen niet met een architectuur. We beginnen aan tafel met iemand die het vak kent. De techniek vormt zich naar het domein, niet andersom.",
  },
  {
    label: "Gebouwd om te blijven",
    body: "Geen pilot die na drie maanden stopt. Elk product is bedoeld om jaren mee te gaan, te groeien, en waarde op te bouwen voor iedereen die eraan meewerkt.",
  },
] as const;

function SectionImage({
  src,
  alt,
  ratio,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  ratio: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className="relative w-full shrink-0 overflow-hidden"
      style={{ aspectRatio: ratio.replace(/\s+/g, "") }}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        loading={priority ? undefined : "lazy"}
        priority={priority}
        sizes={sizes}
        src={src}
      />
    </div>
  );
}

export default function OverOnsPage() {
  return (
    <div className="bg-white text-black">
      {/* Match progress-nav horizontal padding: 1.5rem (mobile), 4rem (desktop). */}
      <main className="w-full">
        {/* Intro — hero + team photo */}
        <div className="section-stack px-6 pt-32 md:px-16 lg:pt-44">
          {/* ------------------------------------------------------- Hero */}
          <header className="w-full">
            <h1 className="type-section-title max-w-[768px] text-black">
              Een venture builder{" "}
              <span className="text-black/45">met technische diepgang</span>
            </h1>
          </header>

          {/* Same width as progress-nav__inner (logo → CTA) */}
          <SectionImage
            alt="Het team van Flowlined"
            priority
            ratio="2048/1365"
            sizes="(min-width: 768px) calc(100vw - 8rem), calc(100vw - 3rem)"
            src="/images/about-team-beach.jpg"
          />
        </div>

        {/* ----------------------- 2nd section — tinted full-width band */}
        <section className="my-[var(--section-gap)] bg-[#f8fafd] px-6 py-[var(--section-gap)] md:px-16">
          <div className="mx-auto flex w-full max-w-[768px] flex-col gap-24">
            <section className="flex flex-col gap-6">
              <h2 className="type-section-title font-light text-black">
                Bouwen met, <span className="text-black/45">niet bouwen voor</span>
              </h2>
              <div className="flex flex-col gap-5">
                <p className="type-body-light">
                  Flowlined zit tussen twee werelden in. We hebben de technische
                  capaciteit van een softwarebedrijf en het ondernemerschap van
                  een venture studio. We bouwen geen maatwerk voor klanten. We
                  bouwen producten met partners.
                </p>
                <p className="type-body-light">
                  Elk product is een eigen venture: eigen merk, eigen markt, eigen
                  klantrelatie. Gebouwd op dezelfde technische infrastructuur, met
                  dezelfde methode, maar met een partner die het domein van
                  binnenuit kent.
                </p>
                <p className="type-body-light">
                  Dat model bestaat omdat wij geloven dat de beste software
                  ontstaat wanneer diepe vakkennis en technische capaciteit vanaf
                  dag één samenkomen. Niet als opdrachtgever en leverancier, maar
                  als mede-eigenaren van hetzelfde product.
                </p>
              </div>
            </section>

            {/* Left edge aligns with text; extends to the nav right edge */}
            <div className="w-[calc(100%+max(0px,(100vw-3rem-768px)/2))] md:w-[calc(100%+max(0px,(100vw-8rem-768px)/2))]">
              <SectionImage
                alt="Oprichter van Flowlined aan tafel"
                ratio="4096/2732"
                sizes="(min-width: 768px) calc(100vw - 8rem), calc(100vw - 3rem)"
                src="/images/about-founder-portrait.jpg"
              />
            </div>
          </div>
        </section>

        {/* Rest — methode + team photo */}
        <div className="section-stack px-6 pb-[var(--section-gap)] md:px-16">
          {/* ------------------------------------------- De flowlined methode */}
          <section className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <h2 className="type-section-title font-light text-black">
              De flowlined <span className="text-black/45">methode</span>
            </h2>

            <div className="flex flex-col gap-10 lg:gap-12">
              {METHOD_ITEMS.map((item) => (
                <div key={item.label} className="flex flex-col gap-3">
                  <p className="type-caption font-light uppercase tracking-[0.04em] text-black">
                    {item.label}
                  </p>
                  <HighlightText
                    as="p"
                    className="type-body-light"
                    scrollStart="top 95%"
                    scrollEnd="top 65%"
                  >
                    {item.body}
                  </HighlightText>
                </div>
              ))}
            </div>
          </section>

          {/* Full-width team-at-table photo */}
          <SectionImage
            alt="Het team van Flowlined in gesprek"
            ratio="4096/2732"
            sizes="(min-width: 768px) calc(100vw - 8rem), calc(100vw - 3rem)"
            src="/images/about-team-table.jpg"
          />
        </div>
      </main>

      {/* ------------------------------------------------- Contact CTA + footer */}
      <div className="bg-[#0a1418]" data-nav-theme="dark">
        <ManifestSection
          title={
            <>
              Klaar om samen
              <br />
              te bouwen?
            </>
          }
          lead="Heb jij de domeinkennis en zoek je een technische partner die meebouwt en mede-eigenaar wordt? Laten we kennismaken."
        />
      </div>

      <div data-nav-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
