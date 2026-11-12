import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryListingPage } from "@/landing/features/catalog/category-listing-page";
import { catalogCategories, findCatalogCategory } from "@/landing/features/catalog/data";
import { parseCatalogQuery, type RawSearchParams } from "@/landing/features/catalog/query";

type CategoryRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export const instant = false;

export function generateStaticParams() {
  return catalogCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const category = findCatalogCategory(slug);
  if (!category) return {};
  return { title: `${category.name} | Minh Sâm Bakery`, description: category.description };
}

export default async function CategoryRoute({ params, searchParams }: CategoryRouteProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const category = findCatalogCategory(slug);
  if (!category) notFound();
  return <CategoryListingPage category={category} query={parseCatalogQuery(rawSearchParams)} />;
}
