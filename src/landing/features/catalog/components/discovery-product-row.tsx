import Link from "next/link";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { ProductActions } from "./product-actions";
import { ProductPrice } from "./product-price";
import type { CatalogProduct } from "../types";

export function DiscoveryProductRow({ product }: { product: CatalogProduct }) {
  const eyebrow = product.isBestSeller ? "BÁN CHẠY" : product.isFeatured ? "NỔI BẬT" : "SẢN PHẨM MINH SÂM";
  return (
    <article className="group relative flex flex-col items-center gap-space-md rounded bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md sm:flex-row">
      <Link
        aria-label={`Xem chi tiết ${product.name}`}
        className="absolute inset-0 z-10"
        href={routes.product(product.categorySlug, product.slug)}
      />
      <div className="h-36 w-full shrink-0 overflow-hidden rounded bg-surface-container sm:w-36">
        <SafeImage
          alt={product.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image}
        />
      </div>
      <div className="flex w-full flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-label-eyebrow text-label-eyebrow font-semibold uppercase text-secondary">{eyebrow}</span>
            <ProductPrice pricing={product.pricing} compact />
          </div>
          <h3 className="mt-0.5 font-headline-sm text-subheading text-primary group-hover:text-secondary">{product.name}</h3>
          {product.description ? (
            <p className="mt-1 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{product.description}</p>
          ) : null}
        </div>
        <div className="mt-space-xs flex items-center justify-between pt-space-sm">
          <span className="font-body-sm text-body-sm text-outline">
            {product.sku ? `Mã SP: ${product.sku}` : "Minh Sâm Bakery"}
          </span>
          <div className="relative z-20 w-full max-w-[235px]">
            <ProductActions product={product} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
