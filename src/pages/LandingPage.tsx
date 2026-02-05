import { LandingHeader } from '@/components/landing/LandingHeader'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProofSection } from '@/components/landing/SocialProofSection'
import { PainPointsSection } from '@/components/landing/PainPointsSection'
import { StepsSection } from '@/components/landing/StepsSection'
import { FeatureBlocksSection } from '@/components/landing/FeatureBlocksSection'
import { SecuritySection } from '@/components/landing/SecuritySection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { ComparisonSection } from '@/components/landing/ComparisonSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { RegistrationFormSection } from '@/components/landing/RegistrationFormSection'
import { DemoSection } from '@/components/landing/DemoSection'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <LandingHeader />
      <main>
        <HeroSection />
        <SocialProofSection />
        <PainPointsSection />
        <StepsSection />
        <FeatureBlocksSection />
        <SecuritySection />
        <TestimonialsSection />
        <ComparisonSection />
        <PricingSection />
        <FAQSection />
        <RegistrationFormSection />
        <DemoSection />
      </main>
      <LandingFooter />
    </div>
  )
}
