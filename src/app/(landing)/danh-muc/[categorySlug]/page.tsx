import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { isCatalogQueryCanonical, catalogQueryToSearchParams, parseCatalogQuery, type RawSearchParams } from "@/landing/features/catalog/query";
import { getCatalogCategories, getCatalogCategory, getCatalogPage, getCrossCategoryProducts } from "@/landing/features/catalog/repository";
import { reportCatalogError } from "@/landing/features/catalog/diagnostics";
import { catalogRedirectPage, loadCatalogPageOnce } from "@/landing/features/catalog/page-policy";
import { CategoryStorefrontPage } from "@/landing/features/catalog/storefront-page";
import { routes } from "@/landing/lib/routes";

type CategoryRouteProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export const instant = false;

export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCatalogCategory(categorySlug).catch((error) => {
    reportCatalogError("categories", "/api/v1/public/categories", error);
    throw error;
  });
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
  const categories = await getCatalogCategories().catch((error) => {
    reportCatalogError("categories", "/api/v1/public/categories", error);
    throw error;
  });
  const category = await getCatalogCategory(categorySlug, categories);
  if (!category) notFound();

  const query = parseCatalogQuery(rawSearchParams);
  if (!isCatalogQueryCanonical(rawSearchParams, query)) redirectToCategory(categorySlug, query);

  const [catalogResult, crossCategoryProducts] = await Promise.all([
    loadCatalogPage(categorySlug, query),
    getCrossCategoryProducts(categorySlug).catch((error) => {
      reportCatalogError(
        "related-other",
        `/api/v1/public/products/${encodeURIComponent(categorySlug)}/related-other`,
        error,
      );
      return [];
    }),
  ]);
  const catalogPage = catalogResult.page;
  const redirectPage = catalogPage
    ? catalogRedirectPage(query.page, catalogPage.pagination)
    : null;
  if (redirectPage !== null)
    redirectToCategory(categorySlug, { ...query, page: redirectPage });

  return <CategoryStorefrontPage category={category} crossCategoryProducts={crossCategoryProducts} page={catalogPage} query={query} />;
}

async function loadCatalogPage(categorySlug: string, query: ReturnType<typeof parseCatalogQuery>) {
  const endpoint = `/api/v1/public/categories/${encodeURIComponent(categorySlug)}/products`;
  const page = await loadCatalogPageOnce(
    () => getCatalogPage(categorySlug, query),
    (error) => reportCatalogError("category-products", endpoint, error),
  );
  return { page };
}

function redirectToCategory(categorySlug: string, query: ReturnType<typeof parseCatalogQuery>): never {
  const params = catalogQueryToSearchParams(query);
  redirect(`${routes.category(categorySlug)}${params.size ? `?${params}` : ""}`);
}
