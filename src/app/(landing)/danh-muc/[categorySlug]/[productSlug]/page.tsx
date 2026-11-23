import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalogProduct, getRelatedCatalogProducts } from "@/landing/features/catalog/repository";
import { adaptApiProductDetail } from "@/landing/features/product/api-adapter";
import { FixedPriceProductPage } from "@/landing/features/product/components/fixed-price-product-page";
import type { FixedPriceProductDetail } from "@/landing/features/product/types";
import { routes } from "@/landing/lib/routes";
import { ApiClientError } from "@/lib/api/client";

type ProductRouteProps = { params: Promise<{ categorySlug: string; productSlug: string }> };

export const instant = false;

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = await loadProductDetail(categorySlug, productSlug, false);
  if (!product) return {};
  const title = `${product.catalog.name} | Minh Sâm Bakery`;
  const description = product.catalog.description;
  const canonical = routes.product(categorySlug, productSlug);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: product.heroImage.src, alt: product.heroImage.alt }],
    },
  };
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { categorySlug, productSlug } = await params;
  const product = await loadProductDetail(categorySlug, productSlug, true);
  if (!product) notFound();
  return <FixedPriceProductPage product={product} />;
}

async function loadProductDetail(
  categorySlug: string,
  productSlug: string,
  includeRelated: boolean,
): Promise<FixedPriceProductDetail | undefined> {
  try {
    const dto = await getCatalogProduct(categorySlug, productSlug);
    if (dto.categorySlug !== categorySlug || dto.slug !== productSlug) {
      throw new Error("Backend returned a product that does not match the requested route");
    }
    const related = includeRelated ? await getRelatedCatalogProducts(dto).catch(() => []) : [];
    return adaptApiProductDetail(dto, related);
  } catch (error) {
    if (error instanceof ApiClientError && (error.status === 404 || error.code === 404)) return undefined;
    throw error;
  }
}
