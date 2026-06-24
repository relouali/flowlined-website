import HighlightText from "@/components/highlight-text";

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
  return (
    <section
      id="compliance"
      data-progress-nav-anchor
      className="compliance-section relative overflow-hidden bg-[#0a1418] px-8 py-24 sm:px-16 md:py-32 lg:py-40"
    >
      <div className="mx-auto flex w-full max-w-[1320px] flex-col">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <HighlightText as="h2" className="type-section-title text-white">
          Compliance zit in het{" "}
            <span className="text-[#cddfed]">fundament</span>
          </HighlightText>
          <p className="type-section-lead max-w-2xl text-white/80">
            ISO 27001, AVG, GDPR en de EU AI Act. Gebouwd voor de
            vertrouwelijkheidseisen van professionals die dagelijks met gevoelige
            dossiers werken.
          </p>
        </div>

        <div className="compliance-grid mt-20 lg:mt-32">
          {CERTIFICATES.map((cert) => (
            <article key={cert.id} className="compliance-card">
              <div className="flex flex-col gap-2.5">
                <h3 className="type-body-strong text-white">
                  {cert.title}
                </h3>
                <p className="type-body text-white/70">{cert.description}</p>
              </div>
              <img
                src={cert.icon}
                alt={`${cert.title} certificering`}
                width={60}
                height={60}
                loading="lazy"
                className="compliance-card__icon"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
