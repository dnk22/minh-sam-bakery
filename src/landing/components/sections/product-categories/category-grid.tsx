import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";
import type { CatalogCategory } from "@/landing/features/catalog/types";

import { CategoryCard } from "./category-card";
import { categoryLayout } from "./category-bento-layout";

export function CategoryGrid({ categories }: { categories: CatalogCategory[] }) {
  return (
    <StaggerReveal
      className="grid flex-1 grid-cols-2 auto-rows-[minmax(190px,1fr)] gap-3 sm:auto-rows-[minmax(220px,1fr)] md:auto-rows-[minmax(260px,1fr)] md:gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(300px,1fr)]"
      delay={0.06}
      itemClassNames={categories.map((_, index) => categoryLayout(index, categories.length))}
      scale={1}
      stagger={0.06}
      y={14}
    >
      {categories.map((category, index) => (
        <CategoryCard category={category} index={index} key={category.id ?? category.slug} />
      ))}
    </StaggerReveal>
  );
}
