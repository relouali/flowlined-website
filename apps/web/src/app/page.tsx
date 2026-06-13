import CaseStudySection from "@/components/case-study-section";
import ComplianceSection from "@/components/compliance-section";
import Hero from "@/components/hero";
import ManifestSection from "@/components/manifest-section";
import ProblemSection from "@/components/problem-section";
import ProcessSection from "@/components/process-section";
import SectorsSection from "@/components/sectors-section";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <div className="bg-[#0a1418]">
      <main>
        <Hero />
        <ProblemSection />
        <ProcessSection />
        <SectorsSection />
        <CaseStudySection />
        <ComplianceSection />
        <ManifestSection />
      </main>
      <SiteFooter />
    </div>
  );
}
