import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryListingPage } from "@/landing/features/catalog/category-listing-page";
import { getCatalogCategory, getCatalogSnapshot } from "@/landing/features/catalog/repository";
import { parseCatalogQuery, type RawSearchParams } from "@/landing/features/catalog/query";

type CategoryRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export const instant = false;

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCatalogCategory(slug);
  if (!category) return {};
  return { title: `${category.name} | Minh Sâm Bakery`, description: category.description };
}

export default async function CategoryRoute({ params, searchParams }: CategoryRouteProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const [{ categories, products }, category] = await Promise.all([
    getCatalogSnapshot({ categorySlug: slug, search: typeof rawSearchParams.q === "string" ? rawSearchParams.q : undefined }),
    getCatalogCategory(slug),
  ]);
  if (!category) notFound();
  return <CategoryListingPage categories={categories} category={category} products={products} query={parseCatalogQuery(rawSearchParams)} />;
}
