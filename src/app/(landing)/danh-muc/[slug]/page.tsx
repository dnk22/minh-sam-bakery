import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CategoryListingPage } from "@/landing/features/catalog/category-listing-page";
import { getCatalogCategories, getCatalogCategory, getCatalogPage } from "@/landing/features/catalog/repository";
import { catalogQueryToSearchParams, isCatalogQueryCanonical, parseCatalogQuery, type RawSearchParams } from "@/landing/features/catalog/query";
import { routes } from "@/landing/lib/routes";

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
  const [categories, category] = await Promise.all([
    getCatalogCategories(),
    getCatalogCategory(slug),
  ]);
  if (!category?.id) notFound();
  const query = parseCatalogQuery(rawSearchParams, { allowedCategories: categories.map((item) => item.slug), routeCategory: slug });
  if (!isCatalogQueryCanonical(rawSearchParams, query, { includeCategory: false })) redirectToCategory(slug, query);
  const catalogPage = await getCatalogPage(query, category.id).catch(() => null);
  const canonicalPage = catalogPage && catalogPage.pagination.totalPages > 0
    ? Math.min(query.page, catalogPage.pagination.totalPages)
    : 1;
  if (catalogPage && query.page !== canonicalPage) redirectToCategory(slug, { ...query, page: canonicalPage });
  return <CategoryListingPage categories={categories} category={category} page={catalogPage} query={query} />;
}

function redirectToCategory(slug: string, query: ReturnType<typeof parseCatalogQuery>): never {
  const params = catalogQueryToSearchParams(query, { includeCategory: false });
  redirect(`${routes.category(slug)}${params.size ? `?${params}` : ""}`);
}
