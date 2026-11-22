import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { StorefrontPage } from "@/landing/features/catalog/storefront-page";
import { getFeaturedCatalogProducts, getStorefrontCategories } from "@/landing/features/catalog/repository";
import { isStorefrontCategoryQueryCanonical, parseStorefrontCategoryQuery, storefrontCategoryQueryToSearchParams, type RawSearchParams, type StorefrontCategoryQuery } from "@/landing/features/catalog/query";
import { getPublicLandingBanners } from "@/landing/features/banners/public-banners.server";
import { routes } from "@/landing/lib/routes";

export const metadata: Metadata = {
  title: "Sản phẩm | Minh Sâm Bakery",
  description: "Khám phá các dòng bánh và quà tặng thủ công của Minh Sâm Bakery.",
};

export const instant = false;

type ProductsRouteProps = { searchParams: Promise<RawSearchParams> };

export default async function ProductsStorefrontRoute({ searchParams }: ProductsRouteProps) {
  const rawSearchParams = await searchParams;
  const query = parseStorefrontCategoryQuery(rawSearchParams);
  if (!isStorefrontCategoryQueryCanonical(rawSearchParams, query)) redirectToProducts(query);
  const [categoryResult, banners, featuredProducts] = await Promise.all([
    loadStorefrontCategoryPage(query),
    getPublicLandingBanners("products_hero").catch(() => []),
    getFeaturedCatalogProducts().catch(() => []),
  ]);
  const categoryPage = categoryResult.page;
  if (categoryPage && categoryResult.recovered) {
    const recoveryPage = categoryPage.pagination.totalPages > 0 && query.page > categoryPage.pagination.totalPages
      ? categoryPage.pagination.totalPages
      : 1;
    redirectToProducts({ ...query, page: recoveryPage });
  }
  if (categoryPage && query.page !== canonicalPage(query.page, categoryPage.pagination.totalPages)) {
    redirectToProducts({ ...query, page: canonicalPage(query.page, categoryPage.pagination.totalPages) });
  }
  return <StorefrontPage categoryPage={categoryPage} featuredProducts={featuredProducts} heroBanners={banners} query={query} />;
}

async function loadStorefrontCategoryPage(query: StorefrontCategoryQuery) {
  try {
    return { page: await getStorefrontCategories({ search: query.q || undefined, page: query.page }), recovered: false };
  } catch {
    if (query.page === 1) return { page: null, recovered: false };
    const page = await getStorefrontCategories({ search: query.q || undefined, page: 1 }).catch(() => null);
    return { page, recovered: page !== null };
  }
}

function redirectToProducts(query: StorefrontCategoryQuery): never {
  const params = storefrontCategoryQueryToSearchParams(query);
  const anchor = query.q || query.page > 1 ? "#danh-muc" : "";
  redirect(`${routes.products}${params.size ? `?${params}` : ""}${anchor}`);
}

function canonicalPage(requested: number, totalPages: number) {
  return totalPages > 0 ? Math.min(requested, totalPages) : 1;
}
