import { AboutClosingSection } from "./about-closing-section";
import { AboutHeroSection } from "./about-hero-section";
import { BrandJourneySection } from "./brand-journey-section";
import { BrandWorldSection } from "./brand-world-section";
import { CraftProcessSection } from "./craft-process-section";
import { PeopleAndCraftSection } from "./people-and-craft-section";

export function AboutPage() {
  return <main className="min-h-screen w-full bg-background pt-20"><AboutHeroSection /><BrandJourneySection /><PeopleAndCraftSection /><CraftProcessSection /><BrandWorldSection /><AboutClosingSection /></main>;
}
