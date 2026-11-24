import { CraftsmanshipSection } from "@/landing/components/sections/craftsmanship-section";
import { FinalCtaSection } from "@/landing/components/sections/final-cta-section";
import { GiftingSection } from "@/landing/components/sections/gifting-section";
import { HeroSection } from "@/landing/components/sections/hero-section";
import { selectHomeCategories } from "@/landing/components/sections/category-showcase-policy";
import { ProductCategoriesSection } from "@/landing/components/sections/product-categories-section";
import { TrainingTransferSection } from "@/landing/components/sections/training-transfer-section";
import { getCatalogCategories } from "@/landing/features/catalog/repository";
import { getPublicLandingBanners } from "@/landing/features/banners/public-banners.server";

export const instant = false;

export default async function HomePage() {
  const [categoriesResult, heroBannersResult, giftingBannersResult] = await Promise.allSettled([
    getCatalogCategories(),
    getPublicLandingBanners("home_hero"),
    getPublicLandingBanners("home_gifting"),
  ]);
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const heroBanners = heroBannersResult.status === "fulfilled" ? heroBannersResult.value : [];
  const giftingBanners = giftingBannersResult.status === "fulfilled" ? giftingBannersResult.value : [];
  return (
    <main className="min-h-[calc(100vh-var(--landing-header-height))] w-full bg-surface pt-[var(--landing-header-height)]">
      <div className="flex flex-col w-full">
        <HeroSection banners={heroBanners} />
        <ProductCategoriesSection
          categories={selectHomeCategories(categories)}
          loadFailed={categoriesResult.status === "rejected"}
        />
        <GiftingSection banners={giftingBanners} />
        <CraftsmanshipSection />
        <TrainingTransferSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}
