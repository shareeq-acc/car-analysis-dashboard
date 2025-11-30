import { HeroSection } from "@/components/landing/hero-section"
import { BrandSlider } from "@/components/landing/brand-slider"
import { FeaturesSection } from "@/components/landing/features-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BrandSlider />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
