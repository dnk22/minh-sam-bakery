import { CraftsmanshipSection } from "@/landing/components/sections/craftsmanship-section";
import { FinalCtaSection } from "@/landing/components/sections/final-cta-section";
import { GiftingSection } from "@/landing/components/sections/gifting-section";
import { HeroSection } from "@/landing/components/sections/hero-section";
import { ProductCategoriesSection } from "@/landing/components/sections/product-categories-section";
import { TrainingTransferSection } from "@/landing/components/sections/training-transfer-section";
import { getCatalogCategories } from "@/landing/features/catalog/repository";

export const instant = false;

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCatalogCategories>> = [];
  let categoryLoadFailed = false;
  try {
    categories = await getCatalogCategories();
  } catch {
    categoryLoadFailed = true;
  }
  return (
    <main className="min-h-[calc(100vh-var(--landing-header-height))] w-full bg-surface pt-[var(--landing-header-height)]">
      <div className="flex flex-col w-full">
        <HeroSection />
        <ProductCategoriesSection categories={categories} loadFailed={categoryLoadFailed} />
        <GiftingSection />
        <CraftsmanshipSection />
        <TrainingTransferSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}
