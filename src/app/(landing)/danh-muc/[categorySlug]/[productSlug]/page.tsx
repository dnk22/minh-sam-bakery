import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalogProduct, getRelatedCatalogProducts } from "@/landing/features/catalog/repository";
import { adaptApiProductDetail } from "@/landing/features/product/api-adapter";
import { FixedPriceProductPage } from "@/landing/features/product/components/fixed-price-product-page";
import { QuotationProductPage } from "@/landing/features/product/components/quotation-product-page";
import type { ProductDetail, QuotationProductDetail } from "@/landing/features/product/types";
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
  return isQuotationProductDetail(product)
    ? <QuotationProductPage product={product} />
    : <FixedPriceProductPage product={product} />;
}

async function loadProductDetail(categorySlug: string, productSlug: string, includeRelated: boolean): Promise<ProductDetail | undefined> {
  try {
    const dto = await getCatalogProduct(categorySlug, productSlug);
    if (dto.categorySlug !== categorySlug || dto.slug !== productSlug) {
      throw new Error("Backend returned a product that does not match the requested route");
    }
    const related = includeRelated ? await getRelatedCatalogProducts(dto).catch(() => []) : [];
    return adaptApiProductDetail(dto, related);
  } catch (error) {
    if (!(error instanceof ApiClientError) || (error.status !== 404 && error.code !== 404)) throw error;
    return findEditorialQuotation(categorySlug, productSlug);
  }
}

async function findEditorialQuotation(categorySlug: string, productSlug: string): Promise<QuotationProductDetail | undefined> {
  const { findProductDetail, isQuotationProduct } = await import("@/landing/features/product/data");
  const product = findProductDetail(productSlug);
  return product?.catalog.categorySlug === categorySlug && isQuotationProduct(product) ? product : undefined;
}

function isQuotationProductDetail(product: ProductDetail): product is QuotationProductDetail {
  return product.pricing.mode === "quote";
}
