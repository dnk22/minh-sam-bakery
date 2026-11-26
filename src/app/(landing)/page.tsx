import { connection } from "next/server";
import { Suspense } from "react";
import { HeroSkeleton, HomeCategoriesSkeleton, GiftingSkeleton } from "@/landing/components/skeletons/landing-skeletons";
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

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-var(--landing-header-height))] w-full bg-surface pt-[var(--landing-header-height)]">
      <div className="flex flex-col w-full">
        <Suspense fallback={<HeroSkeleton />}><RuntimeHero /></Suspense>
        <Suspense fallback={<HomeCategoriesSkeleton />}><RuntimeCategories /></Suspense>
        <Suspense fallback={<GiftingSkeleton />}><RuntimeGifting /></Suspense>
        <CraftsmanshipSection />
        <TrainingTransferSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}

async function RuntimeHero() {
  await connection();
  return <HeroSection banners={await getPublicLandingBanners("home_hero").catch(() => [])} />;
}

async function RuntimeCategories() {
  await connection();
  const result = await getCatalogCategories().then(categories => ({ categories, failed: false })).catch(() => ({ categories: [], failed: true }));
  return <ProductCategoriesSection categories={selectHomeCategories(result.categories)} loadFailed={result.failed} />;
}

async function RuntimeGifting() {
  await connection();
  return <GiftingSection banners={await getPublicLandingBanners("home_gifting").catch(() => [])} />;
}
