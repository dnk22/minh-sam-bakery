import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FixedPriceProductPage } from "@/landing/features/product/components/fixed-price-product-page";
import { QuotationProductPage } from "@/landing/features/product/components/quotation-product-page";
import { adaptApiProductDetail } from "@/landing/features/product/api-adapter";
import type { ProductDetail, QuotationProductDetail } from "@/landing/features/product/types";
import { getRelatedCatalogProducts, resolveProductBySlug } from "@/landing/features/catalog/repository";

type ProductRouteProps = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveProductBySlug(slug);
  const product = resolved.dto
    ? adaptApiProductDetail(resolved.dto, [])
    : await findEditorialQuotation(slug);
  if (!product) return {};
  return {
    title: `${product.catalog.name} | Minh Sâm Bakery`,
    description: product.catalog.description,
    openGraph: { images: [{ url: product.heroImage.src, alt: product.heroImage.alt }] },
  };
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { slug } = await params;
  const resolved = await resolveProductBySlug(slug);
  const product = resolved.dto
    ? adaptApiProductDetail(resolved.dto, await getRelatedCatalogProducts(resolved.dto))
    : await findEditorialQuotation(slug);
  if (!product) notFound();

  if (isQuotationProductDetail(product)) {
    return <QuotationProductPage product={product} />;
  }

  return <FixedPriceProductPage product={product} />;
}

async function findEditorialQuotation(slug: string): Promise<QuotationProductDetail | undefined> {
  const { findProductDetail, isQuotationProduct } = await import("@/landing/features/product/data");
  const product = findProductDetail(slug);
  return product && isQuotationProduct(product) ? product : undefined;
}

function isQuotationProductDetail(product: ProductDetail): product is QuotationProductDetail {
  return product.pricing.mode === "quote";
}
