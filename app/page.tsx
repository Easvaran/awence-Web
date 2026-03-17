import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesOverview } from "@/components/home/services-overview";
import { BenefitsSection } from "@/components/home/benefits-section";
import { TestimonialsPreview } from "@/components/home/testimonials-preview";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <HeroSection />
        <ServicesOverview />
        <BenefitsSection />
        {/* <TestimonialsPreview /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
