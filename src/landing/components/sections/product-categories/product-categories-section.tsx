import type { CatalogCategory } from "@/landing/features/catalog/types";

import { CategoryGrid } from "./category-grid";
import { CategorySectionFeedback } from "./category-section-feedback";
import { CategorySectionFooter } from "./category-section-footer";
import { CategorySectionHeading } from "./category-section-heading";
import { selectHomeCategories } from "./category-showcase-policy";

export function ProductCategoriesSection({ categories, loadFailed = false }: { categories: CatalogCategory[]; loadFailed?: boolean }) {
  const items = selectHomeCategories(categories);

  return (
    <section className="flex w-full flex-col bg-surface px-4 py-8 text-on-surface sm:px-6 md:px-12 md:py-16 lg:min-h-[calc(100vh-var(--landing-header-height))] lg:px-20" id="danh-muc">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <CategorySectionHeading />
        {loadFailed || items.length === 0 ? <CategorySectionFeedback loadFailed={loadFailed} /> : <CategoryGrid categories={items} />}
      </div>
      <CategorySectionFooter />
    </section>
  );
}
