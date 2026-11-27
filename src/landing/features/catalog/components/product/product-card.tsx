"use client";

import Link from "next/link";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { routes } from "@/landing/lib/routes";

import { PRODUCT_CARD_BODY_CLASS, PRODUCT_CARD_ACTIONS_CLASS } from "./product-card-layout";
import { ProductActions } from "./product-actions";
import { ProductPrice } from "./product-price";
import type { CatalogProduct } from "../../types";

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
          <span className={`absolute top-2 left-2 max-w-[calc(100%_-_1rem)] rounded px-1.5 py-0.5 font-label-eyebrow text-[10px] sm:top-3 sm:left-3 sm:px-2 sm:text-label-eyebrow uppercase shadow-sm ${product.badgeClassName}`}>
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className={PRODUCT_CARD_BODY_CLASS}>
        <div>
          <h3 className="mb-1 line-clamp-2 break-words font-headline-sm text-[16px] leading-snug sm:text-headline-sm text-primary transition-colors group-hover:text-primary-container">{product.name}</h3>
          <p className="mb-2 line-clamp-2 break-words font-body-md text-[12px] leading-snug sm:mb-space-sm sm:text-body-md text-on-surface-variant">{product.description}</p>
        </div>
        <div className={PRODUCT_CARD_ACTIONS_CLASS}>
          <ProductPrice pricing={product.pricing} responsiveCompact />
          <ProductActions product={product} responsiveCompact />
        </div>
      </div>
    </article>
  );
}
