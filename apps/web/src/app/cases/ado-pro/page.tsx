import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";

import CaseStepSlider from "@/components/case-detail/case-step-slider";
import ManifestSection from "@/components/manifest-section";
import SiteFooter from "@/components/site-footer";

import "@/components/case-detail/case-detail.css";

export const metadata: Metadata = {
  title: "ADO Pro — Case | Flowlined",
  description:
    "Het werksysteem voor arbeidsdeskundigen. Van dossierbereiding tot rapportgeneratie, volledig conform RIV-richtlijnen.",
};

const KPIS = [
  { value: "70%", label: "Tijdsbesparing op administratieve taken" },
  { value: "99,99%", label: "Nauwkeurigheid in documentenanalyse" },
  { value: "3x", label: "Snellere complete rapportages" },
  { value: "100%", label: "AVG-compliant gegevensverwerking" },
] as const;

type CompareValue = boolean | string;

const COMPARE_COLUMNS = [
  { title: "Handmatig", subtitle: "Zonder ADO Pro" },
  { title: "Met ADO Pro", subtitle: "Slim voorwerk" },
] as const;

const COMPARE_ROWS: {
  feature: string;
  values: [CompareValue, CompareValue];
}[] = [
  { feature: "Dossier automatisch inlezen", values: [false, true] },
  {
    feature: "Documenten structureren & categoriseren",
    values: [false, true],
  },
  { feature: "Compleetheidscheck documenten", values: [false, true] },
  { feature: "RIV-richtlijnen ingebouwd", values: [false, true] },
  { feature: "Domeinregels automatisch toegepast", values: [false, true] },
  { feature: "Conceptrapport genereren", values: [false, true] },
  { feature: "Herleidbare conclusies", values: ["Handmatig", "Automatisch"] },
  { feature: "Totaal voorwerk", values: ["2.5 - 3.5 uur", "30 - 45 min"] },

];

function CompareCheck() {
  return (
    <svg
      aria-hidden
      className="case-compare__icon case-compare__icon--yes"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CompareCross() {
  return (
    <svg
      aria-hidden
      className="case-compare__icon case-compare__icon--no"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CompareCell({ value }: { value: CompareValue }) {
  if (value === true) return <CompareCheck />;
  if (value === false) return <CompareCross />;
  return <span className="case-compare__value-text">{value}</span>;
}

export default function AdoProCasePage() {
  return (
    <div className="case-detail">
      <main>
        {/* ---------------------------------------------------------- Hero */}
        <section className="case-hero">
          <div className="case-hero__content">
            <div className="case-hero__logo">
              <Image
                alt="ADO Pro"
                className="object-contain"
                fill
                priority
                src="/cases/ado-pro/ado-pro-logo.svg"
              />
            </div>
            <h1 className="case-hero__title type-hero font-semibold capitalize tracking-tight text-[#000c10]">
              Intelligente assistent voor arbeidsdeskundig onderzoek
            </h1>
            <p className="case-hero__lead type-section-lead text-[#000c10]/60">
              Het werksysteem voor arbeidsdeskundigen. Van dossierbereiding tot
              rapportgeneratie, volledig conform RIV-richtlijnen.
            </p>
          </div>

          <div className="case-hero__visual">
            <Image
              alt="ADO Pro werkomgeving"
              className="case-hero__visual-img"
              width={3356}
              height={1890}
              priority
              src="/images/adopro-heroshot.png"
            />
          </div>
        </section>

        {/* ---------------------------------------------------- Testimonial + KPIs */}
        <section className="mx-auto w-full max-w-[1440px] px-8 sm:px-16">
          <div className="mx-auto flex max-w-[1312px] flex-col gap-20 lg:gap-24">
            {/* Testimonial */}
            <figure className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
              <blockquote className="type-section-title font-light text-black lg:flex-[1_0_0]">
                &ldquo;Als arbeidsdeskundige wil ik geen tijd verliezen aan onnodig overtikwerk. Met ADO Pro werk ik sneller, efficiënter en met volledige focus op de inhoud van het dossier.&rdquo;
              </blockquote>
              <figcaption className="flex shrink-0 items-start gap-3 lg:max-w-xs">
                <span className="relative size-[72px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    alt="Ton Veldman"
                    className="object-cover"
                    fill
                    sizes="72px"
                    src="/images/hans-langius.jpeg"
                  />
                </span>
                <span className="flex flex-col">
                  <span className="type-ui font-medium text-black">
                    Hans Langius
                  </span>
                  <span className="type-ui text-black/60">
                  Gecertificeerd en geregistreerd arbeidsdeskundige
                  </span>
                </span>
              </figcaption>
            </figure>

            {/* KPI bento */}
            <div className="case-kpis">
              {KPIS.map((kpi) => (
                <div key={kpi.value} className="case-kpi">
                  <p className="case-kpi__label type-body text-black">
                    {kpi.label}
                  </p>
                  <p className="case-kpi__value type-stat">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Intro + collage */}
        <section className="mx-auto w-full max-w-[1440px] px-8 sm:px-16">
          <div className="case-section case-section--align-left mx-auto max-w-[1312px]">
            <div className="case-section__header">
                <h2 className="type-section-title text-black">
                  Rommelige workflows.{" "}
                  <span className="text-black/45">Voor elk rapport.</span>
                </h2>
                <p className="type-section-lead text-black/60">
                  Een arbeidsdeskundige beoordeelt arbeidsmogelijkheden van
                  mensen met een beperking. In de praktijk betekent dat: medische
                  dossiers doorwerken, belastbaarheid afwegen, en alles vertalen
                  naar een rapport dat voldoet aan de RIV-richtlijnen van het
                  UWV. Maar het werkproces eromheen is allesbehalve overzichtelijk.
                  Documenten, notities en formulieren liggen verspreid over
                  mappen, mails en spreadsheets. Het voorwerk kost meer tijd dan
                  de beoordeling zelf. Dezelfde handelingen, dezelfde controles,
                  elk dossier opnieuw. Het oordeel kan geen machine nemen. Het
                  voorwerk wel.
                </p>
              </div>

              <div className="case-collage">
                <Image
                  alt="Verspreide documenten, notities en dossiers die het voorbereidende rapportwerk illustreren"
                  className="case-collage__img"
                  width={1200}
                  height={1167}
                  sizes="(min-width: 1024px) 1312px, 100vw"
                  src="/images/messy-workflows-visual.svg"
                />
              </div>
            </div>
        </section>

        {/* ------------------------------------------------ Process / video step */}
        <section
          id="demo"
          className="mx-auto w-full max-w-[1440px] px-8 sm:px-16"
        >
          <div className="case-section mx-auto max-w-[1312px]">
            <div className="case-section__header">
              <h2 className="type-section-title text-black">
                Orde in het voorwerk.{" "}
                <span className="text-black/45">Regie bij de expert.</span>
              </h2>
              <p className="type-section-lead text-black/60">
                Waar dossierwerk nu verspreid ligt over mappen, mails en
                spreadsheets, brengt ADO Pro alles samen in één gestructureerd
                proces. Het systeem neemt het voorbereidende werk over. De
                arbeidsdeskundige houdt de regie over het inhoudelijke oordeel.
              </p>
            </div>

            <CaseStepSlider />
          </div>
        </section>

        {/* ------------------------------------------------ Comparison table */}
        <section className="mx-auto w-full max-w-[1440px] px-8 sm:px-16">
          <div className="case-section mx-auto max-w-[1312px]">
            <div className="case-section__header case-section__header--center">
              <h2 className="type-section-title text-black">
              Wat er is veranderd.
              {" "}
                <span className="text-black/45">In één overzicht.</span>
              </h2>
              <p className="type-section-lead text-black/60">
                Het voorbereidende werk dat voorheen uren kostte, neemt ADO Pro
                grotendeels over. Dezelfde stappen, maar geautomatiseerd, zodat
                de arbeidsdeskundige tijd overhoudt voor het oordeel dat er
                echt toe doet.
              </p>
            </div>

            <div className="case-compare">
              <span aria-hidden className="case-compare__dots case-compare__dots--left" />
              <span aria-hidden className="case-compare__dots case-compare__dots--right" />

              <div
                className="case-compare__grid"
                style={
                  {
                    "--compare-rows": COMPARE_ROWS.length + 1,
                  } as CSSProperties
                }
              >
                <div className="case-compare__features">
                  <div className="case-compare__cell case-compare__cell--feature case-compare__cell--head" />
                  {COMPARE_ROWS.map((row) => (
                    <div
                      key={row.feature}
                      className="case-compare__cell case-compare__cell--feature"
                    >
                      {row.feature}
                    </div>
                  ))}
                </div>

                <div className="case-compare__card">
                  {COMPARE_COLUMNS.map((column) => (
                    <div
                      key={column.title}
                      className="case-compare__cell case-compare__cell--value case-compare__cell--head"
                    >
                      <span className="case-compare__col-title">
                        {column.title}
                      </span>
                      <span className="case-compare__col-subtitle">
                        {column.subtitle}
                      </span>
                    </div>
                  ))}

                  {COMPARE_ROWS.map((row) =>
                    row.values.map((value, columnIndex) => (
                      <div
                        key={`${row.feature}-${COMPARE_COLUMNS[columnIndex].title}`}
                        className="case-compare__cell case-compare__cell--value"
                      >
                        <CompareCell value={value} />
                      </div>
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#0a1418]" data-nav-theme="dark">
          <ManifestSection
            title={
              <>
                Herken je dit patroon
                <br />
                in jouw vakgebied?
              </>
            }
            lead=" Als experts in jouw vakgebied uren besteden aan werk dat systematischer kan, bouwen wij daar samen een product voor."
          />
        </div>
      </main>

      <div data-nav-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
