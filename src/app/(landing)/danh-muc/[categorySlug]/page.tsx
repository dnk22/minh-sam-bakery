import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { isCatalogQueryCanonical, catalogQueryToSearchParams, parseCatalogQuery, type RawSearchParams } from "@/landing/features/catalog/query";
import { getCatalogCategories, getCatalogCategory, getCatalogPage, getCrossCategoryProducts } from "@/landing/features/catalog/repository";
import { CategoryStorefrontPage } from "@/landing/features/catalog/storefront-page";
import { routes } from "@/landing/lib/routes";

type CategoryRouteProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export const instant = false;

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCatalogCategory(categorySlug);
  if (!category) return {};
  const title = category.seoTitle || `${category.name} | Minh Sâm Bakery`;
  const description = category.seoDescription || category.description || `Khám phá ${category.name} tại Minh Sâm Bakery.`;
  return {
    title,
    description,
    alternates: { canonical: routes.category(category.slug) },
    openGraph: { title, description, url: routes.category(category.slug) },
  };
}

export default async function CategoryRoute({ params, searchParams }: CategoryRouteProps) {
  const [{ categorySlug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const categories = await getCatalogCategories();
  const category = await getCatalogCategory(categorySlug, categories);
  if (!category?.id) notFound();

  const query = parseCatalogQuery(rawSearchParams, {
    allowedCategories: categories.map((item) => item.slug),
    routeCategory: categorySlug,
  });
  if (!isCatalogQueryCanonical(rawSearchParams, query, { includeCategory: false })) redirectToCategory(categorySlug, query);

  const [catalogResult, crossCategoryProducts] = await Promise.all([
    loadCatalogPage(query, category.id),
    getCrossCategoryProducts({ excludedCategorySlug: categorySlug, categories, limit: 4 }).catch(() => []),
  ]);
  const catalogPage = catalogResult.page;
  if (catalogPage && catalogResult.recovered) {
    const recoveryPage = catalogPage.pagination.totalPages > 0 && query.page > catalogPage.pagination.totalPages ? catalogPage.pagination.totalPages : 1;
    redirectToCategory(categorySlug, { ...query, page: recoveryPage });
  }
  const canonicalPage = catalogPage && catalogPage.pagination.totalPages > 0 ? Math.min(query.page, catalogPage.pagination.totalPages) : 1;
  if (catalogPage && query.page !== canonicalPage) redirectToCategory(categorySlug, { ...query, page: canonicalPage });

  return <CategoryStorefrontPage category={category} crossCategoryProducts={crossCategoryProducts} page={catalogPage} query={query} />;
}

async function loadCatalogPage(query: ReturnType<typeof parseCatalogQuery>, categoryId: string) {
  try {
    return { page: await getCatalogPage(query, categoryId), recovered: false };
  } catch {
    if (query.page === 1) return { page: null, recovered: false };
    const page = await getCatalogPage({ ...query, page: 1 }, categoryId).catch(() => null);
    return { page, recovered: page !== null };
  }
}

function redirectToCategory(categorySlug: string, query: ReturnType<typeof parseCatalogQuery>): never {
  const params = catalogQueryToSearchParams(query, { includeCategory: false });
  redirect(`${routes.category(categorySlug)}${params.size ? `?${params}` : ""}`);
}
