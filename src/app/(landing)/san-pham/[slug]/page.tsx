import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FixedPriceProductPage } from "@/landing/features/product/components/fixed-price-product-page";
import { QuotationProductPage } from "@/landing/features/product/components/quotation-product-page";
import { findProductDetail, isQuotationProduct } from "@/landing/features/product/data";
import { adaptApiProductDetail } from "@/landing/features/product/api-adapter";
import { catalogDataSource, getRelatedCatalogProducts, resolveProductBySlug } from "@/landing/features/catalog/repository";

type ProductRouteProps = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveProductBySlug(slug);
  const editorialProduct = findProductDetail(slug);
  const product = resolved.dto
    ? adaptApiProductDetail(resolved.dto, [])
    : editorialProduct && (catalogDataSource() === "mock" || isQuotationProduct(editorialProduct)) ? editorialProduct : undefined;
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
  const editorialProduct = findProductDetail(slug);
  const product = resolved.dto
    ? adaptApiProductDetail(resolved.dto, await getRelatedCatalogProducts(resolved.dto))
    : editorialProduct && (catalogDataSource() === "mock" || isQuotationProduct(editorialProduct)) ? editorialProduct : undefined;
  if (!product) notFound();

  if (isQuotationProduct(product)) {
    return <QuotationProductPage product={product} />;
  }

  return <FixedPriceProductPage product={product} />;
}
