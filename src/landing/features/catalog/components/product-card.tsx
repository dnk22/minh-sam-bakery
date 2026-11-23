"use client";

import Link from "next/link";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { ProductActions } from "./product-actions";
import { ProductPrice } from "./product-price";
import type { CatalogProduct } from "../types";

export function ProductCard({ product, imageAspect = "landscape" }: {
  product: CatalogProduct;
  imageAspect?: "square" | "landscape";
}) {
  const detailHref = routes.product(product.categorySlug, product.slug);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
      <Link
        aria-label={`Xem chi tiết ${product.name}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
        href={detailHref}
      />
      <div className={`relative w-full overflow-hidden bg-surface-container ${imageAspect === "square" ? "aspect-square" : "aspect-[4/3]"}`}>
        <SafeImage
          alt={product.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image}
        />
        {product.badge ? (
          <span className={`absolute top-3 left-3 rounded px-2 py-0.5 font-label-eyebrow text-label-eyebrow uppercase shadow-sm ${product.badgeClassName}`}>
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between p-space-md">
        <div>
          <h3 className="mb-1 font-headline-sm text-headline-sm text-primary transition-colors group-hover:text-primary-container">{product.name}</h3>
          <p className="mb-space-sm line-clamp-2 font-body-md text-body-md text-on-surface-variant">{product.description}</p>
        </div>
        <div className="mt-space-xs flex flex-col gap-space-sm pt-space-sm">
          <ProductPrice pricing={product.pricing} />
          <ProductActions product={product} />
        </div>
      </div>
    </article>
  );
}
