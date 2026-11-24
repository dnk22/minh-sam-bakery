import "server-only";

import { revalidateTag } from "next/cache";

import type { Category } from "../types";

export function revalidatePublicCategoryCache(category?: Category) {
  revalidateTag("catalog-categories", { expire: 0 });
  if (category) {
    revalidateTag(`catalog-category-${category.id}`, "max");
    revalidateTag(`catalog-category-${category.slug}`, "max");
  }
}
