import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { StorefrontPage } from "@/landing/features/catalog/storefront-page";
import { getCatalogCategories, getCatalogPage, getFeaturedCatalogProducts } from "@/landing/features/catalog/repository";
import { catalogQueryToSearchParams, isCatalogQueryCanonical, parseCatalogQuery, type RawSearchParams } from "@/landing/features/catalog/query";
import { getPublicLandingBanners } from "@/landing/features/banners/public-banners.server";
import { routes } from "@/landing/lib/routes";

export const metadata: Metadata = {
  title: "Sản phẩm | Minh Sâm Bakery",
  description: "Khám phá các dòng bánh và quà tặng thủ công của Minh Sâm Bakery.",
};

export const instant = false;

type ProductsRouteProps = { searchParams: Promise<RawSearchParams> };

export default async function ProductsStorefrontRoute({ searchParams }: ProductsRouteProps) {
  const [rawSearchParams, categories, banners, featuredProducts] = await Promise.all([
    searchParams,
    getCatalogCategories(),
    getPublicLandingBanners("products_hero").catch(() => []),
    getFeaturedCatalogProducts().catch(() => []),
  ]);
  const query = parseCatalogQuery(rawSearchParams, { allowedCategories: categories.map((category) => category.slug) });
  if (!isCatalogQueryCanonical(rawSearchParams, query)) redirectToProducts(query);
  const categoryId = query.category ? categories.find((category) => category.slug === query.category)?.id : undefined;
  const catalogPage = await getCatalogPage(query, categoryId).catch(() => null);
  if (catalogPage && query.page !== canonicalPage(query.page, catalogPage.pagination.totalPages)) {
    redirectToProducts({ ...query, page: canonicalPage(query.page, catalogPage.pagination.totalPages) });
  }
  return <StorefrontPage catalogCategories={categories} catalogPage={catalogPage} featuredProducts={featuredProducts} heroBanners={banners} query={query} />;
}

function redirectToProducts(query: ReturnType<typeof parseCatalogQuery>): never {
  const params = catalogQueryToSearchParams(query);
  redirect(`${routes.products}${params.size ? `?${params}` : ""}`);
}

function canonicalPage(requested: number, totalPages: number) {
  return totalPages > 0 ? Math.min(requested, totalPages) : 1;
}
