import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FixedPriceProductPage } from "@/landing/features/product/components/fixed-price-product-page";
import { QuotationProductPage } from "@/landing/features/product/components/quotation-product-page";
import { findProductDetail, isQuotationProduct, productDetails } from "@/landing/features/product/data";

type ProductRouteProps = { params: Promise<{ slug: string }> };

export const instant = false;

export function generateStaticParams() {
  return productDetails.map(({ catalog }) => ({ slug: catalog.slug }));
}

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductDetail(slug);
  if (!product) return {};
  return {
    title: `${product.catalog.name} | Minh Sâm Bakery`,
    description: product.catalog.description,
    openGraph: { images: [{ url: product.heroImage.src, alt: product.heroImage.alt }] },
  };
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = findProductDetail(slug);
  if (!product) notFound();

  if (isQuotationProduct(product)) {
    return <QuotationProductPage product={product} />;
  }

  return <FixedPriceProductPage product={product} />;
}
