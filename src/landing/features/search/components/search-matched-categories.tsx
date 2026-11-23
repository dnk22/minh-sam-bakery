import Link from "next/link";

import type { CatalogCategory } from "@/landing/features/catalog/types";
import { routes } from "@/landing/lib/routes";

export function SearchMatchedCategories({ categories }: { categories: CatalogCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-label="Danh mục phù hợp" className="mb-space-xl rounded-xl bg-surface-container-low p-space-md">
      <h2 className="mb-space-sm font-headline-sm text-headline-sm text-primary">Danh mục phù hợp</h2>
      <div className="flex flex-wrap gap-space-sm">
        {categories.map((category) => (
          <Link
            className="rounded-full border border-outline-variant bg-surface-container-lowest px-space-md py-2 font-label-ui text-label-ui text-primary transition-colors hover:bg-surface-container-high"
            href={routes.category(category.slug)}
            key={category.slug}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
