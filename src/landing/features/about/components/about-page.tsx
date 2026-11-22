import { AboutClosingSection } from "./about-closing-section";
import { AboutHeroSection } from "./about-hero-section";
import { BrandJourneySection } from "./brand-journey-section";
import { BrandWorldSection } from "./brand-world-section";
import { CraftProcessSection } from "./craft-process-section";
import { PeopleAndCraftSection } from "./people-and-craft-section";
import type { LandingBanner } from "@/landing/features/banners/types";

export function AboutPage({ heroBanners = [] }: { heroBanners?: LandingBanner[] }) {
  return <main className="min-h-screen w-full bg-background pt-[var(--landing-header-height)]"><AboutHeroSection banners={heroBanners} /><BrandJourneySection /><PeopleAndCraftSection /><CraftProcessSection /><BrandWorldSection /><AboutClosingSection /></main>;
}
