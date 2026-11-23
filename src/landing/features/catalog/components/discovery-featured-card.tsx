import Link from "next/link";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { ProductActions } from "./product-actions";
import { ProductPrice } from "./product-price";
import type { CatalogProduct } from "../types";

export function DiscoveryFeaturedCard({ product, hasSupportingProducts }: {
  product: CatalogProduct;
  hasSupportingProducts: boolean;
}) {
  return (
    <article className={`group relative flex flex-col justify-between overflow-hidden rounded bg-surface-container-lowest shadow-md ${hasSupportingProducts ? "lg:col-span-6" : "lg:col-span-12"}`}>
      <Link
        aria-label={`Xem chi tiết ${product.name}`}
        className="absolute inset-0 z-10"
        href={routes.product(product.categorySlug, product.slug)}
      />
      <div className="relative h-[340px] overflow-hidden bg-primary lg:h-[380px]">
        <SafeImage
          alt={product.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={product.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        {(product.isBestSeller || product.isFeatured) ? (
          <div className="absolute top-4 left-4">
            <span className="rounded bg-secondary px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-secondary shadow">
              {product.isBestSeller ? "SẢN PHẨM BÁN CHẠY" : "SẢN PHẨM NỔI BẬT"}
            </span>
          </div>
        ) : null}
        <div className="absolute right-4 bottom-4 left-4 text-surface-bright">
          <span className="font-label-eyebrow text-[10px] uppercase tracking-widest text-secondary-fixed">
            {product.sku ? `MÃ SP: ${product.sku}` : "MINH SÂM BAKERY"}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-space-md p-space-lg">
        <div>
          <h3 className="mt-1 font-headline-lg text-headline-sm text-primary lg:text-headline-md">{product.name}</h3>
          {product.description ? (
            <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{product.description}</p>
          ) : null}
        </div>
        <div className="flex flex-col justify-between gap-space-sm pt-space-md sm:flex-row sm:items-center">
          <div>
            <span className="block font-label-eyebrow text-[11px] uppercase text-outline">GIÁ HIỆN TẠI</span>
            <ProductPrice pricing={product.pricing} />
          </div>
          <div className="relative z-20 w-full sm:max-w-[240px]">
            <ProductActions product={product} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
