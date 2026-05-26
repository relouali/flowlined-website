import CaseStudySection from "@/components/case-study-section";
import Hero from "@/components/hero";
import ManifestSection from "@/components/manifest-section";
import ProblemSection from "@/components/problem-section";
import ProcessSection from "@/components/process-section";
import SectorsSection from "@/components/sectors-section";
import SiteFooter from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ProblemSection />
        <ProcessSection />
        <SectorsSection />
        <CaseStudySection />
        <ManifestSection />
      </main>
      <SiteFooter />
    </>
  );
}
