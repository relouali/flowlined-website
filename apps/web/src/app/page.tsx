import CaseStudySection from "@/components/case-study-section";
import ComplianceSection from "@/components/compliance-section";
import Hero from "@/components/hero";
import HomeBackground from "@/components/home-background";
import ManifestSection from "@/components/manifest-section";
import CircularProcessSection from "@/components/circular-process-section";
import ProblemSection from "@/components/problem-section";
import SectorsSection from "@/components/sectors-section";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <div className="home-shell">
      <HomeBackground />
      <div className="home-shell__content">
        <main>
          <Hero />
          <div className="home-frost-panel">
            <ProblemSection />
            <CircularProcessSection />
            <SectorsSection />
            <CaseStudySection />
            <ComplianceSection />
            <ManifestSection />
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
