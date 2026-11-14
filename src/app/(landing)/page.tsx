import { BrandStorySection } from "@/landing/components/sections/brand-story-section";
import { CraftsmanshipSection } from "@/landing/components/sections/craftsmanship-section";
import { FinalCtaSection } from "@/landing/components/sections/final-cta-section";
import { GiftingSection } from "@/landing/components/sections/gifting-section";
import { HeroSection } from "@/landing/components/sections/hero-section";
import { ProductCategoriesSection } from "@/landing/components/sections/product-categories-section";
import { TraditionDevelopmentSection } from "@/landing/components/sections/tradition-development-section";
import { TrainingTransferSection } from "@/landing/components/sections/training-transfer-section";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-var(--landing-header-height))] w-full bg-surface pt-[var(--landing-header-height)]">
      <div className="flex flex-col w-full">
        <HeroSection />
        <ProductCategoriesSection />
        <GiftingSection />
        <BrandStorySection />
        <TraditionDevelopmentSection />
        <CraftsmanshipSection />
        <TrainingTransferSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}
