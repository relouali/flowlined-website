"use client";

import { useEffect, useRef } from "react";

import ScrollFadeText from "@/components/scroll-fade-text";
import SectionFrame from "@/components/section-frame";
import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initComplianceGrid } from "@/lib/init-compliance-grid";

import "./compliance-section.css";

type Certificate = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const CERTIFICATES: ReadonlyArray<Certificate> = [
  {
    id: "iso-27001",
    title: "ISO 27001",
    description:
      "Gecertificeerd volgens de internationaal erkende standaard voor informatiebeveiliging en het beheer van gevoelige gegevens.",
    icon: "/certificates/iso-27001.svg",
  },
  {
    id: "avg",
    title: "AVG",
    description:
      "Volledig conform de AVG, de Nederlandse wetgeving voor de zorgvuldige verwerking van persoonsgegevens.",
    icon: "/certificates/avg-certificate.svg",
  },
  {
    id: "gdpr",
    title: "GDPR",
    description:
      "Wij opereren onder de Europese standaard voor gegevensbescherming en privacy.",
    icon: "/certificates/GDPR-certificate.svg",
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act",
    description:
      "Onze AI voldoet aan de EU AI Act, het Europese kader voor verantwoorde en transparante inzet van AI.",
    icon: "/certificates/eu-act-certificate.svg",
  },
];

export default function ComplianceSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !gridRef.current) return;

    const cleanup = initComplianceGrid(gridRef.current);
    return cleanup;
  }, [locomotiveScroll]);

  return (
    <SectionFrame
      id="compliance"
      data-progress-nav-anchor
      className="compliance-section"
      frameClassName="compliance-section__frame flex min-h-[100dvh] items-center py-24 md:py-32 lg:py-40"
    >
      <div className="section-inner flex flex-col">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <ScrollFadeText as="h2" className="type-section-title text-white">
            Compliance zit in het{" "}
            <span className="text-[#cddfed]">fundament</span>
          </ScrollFadeText>
          <ScrollFadeText
            as="p"
            className="type-section-lead max-w-2xl text-white"
            delay={0.12}
          >
            ISO 27001, AVG, GDPR en de EU AI Act. Gebouwd voor de
            vertrouwelijkheidseisen van professionals die dagelijks met gevoelige
            dossiers werken.
          </ScrollFadeText>
        </div>

        <div ref={gridRef} className="compliance-grid">
          {CERTIFICATES.map((cert) => (
            <ComplianceCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function ComplianceCard({ cert }: { cert: Certificate }) {
  return (
    <article
      data-compliance-grid-item
      className="compliance-card"
    >
      <span
        aria-hidden
        className="compliance-card__line compliance-card__line--top"
        data-compliance-grid-line="h"
      />
      <span
        aria-hidden
        className="compliance-card__line compliance-card__line--left"
        data-compliance-grid-line="v"
      />
      <span
        aria-hidden
        className="compliance-card__line compliance-card__line--right"
        data-compliance-grid-line="h"
      />
      <span
        aria-hidden
        className="compliance-card__line compliance-card__line--bottom"
        data-compliance-grid-line="v"
      />
      <div className="compliance-card__body">
        <div
          className="compliance-card__copy flex flex-col gap-2.5"
          data-compliance-grid-content="copy"
        >
          <h3 className="type-body-strong text-white">{cert.title}</h3>
          <p className="type-body text-white">{cert.description}</p>
        </div>
        <div
          className="compliance-card__icon-wrap"
          data-compliance-grid-content="icon"
        >
          <img
            src={cert.icon}
            alt={`${cert.title} certificering`}
            width={60}
            height={60}
            loading="lazy"
            className="compliance-card__icon"
          />
        </div>
      </div>
    </article>
  );
}
