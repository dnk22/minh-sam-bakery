"use client";

import type { CatalogProduct } from "../../types";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton, ProductGridSkeleton } from "./product-card-skeleton";

export function ProductListGrid({ products, pending }: { products: CatalogProduct[]; pending: boolean }) {
  if (!products.length) return pending ? <ProductGridSkeleton /> : null;

  return (
    <div aria-busy={pending} aria-label="Danh sách sản phẩm" className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
      {products.map(product => (
        <div key={product.id} className="relative min-w-0">
          <div className={pending ? "invisible h-full" : "h-full"} inert={pending} aria-hidden={pending || undefined}>
            <ProductCard product={product} />
          </div>
          {pending ? <div className="absolute inset-0"><ProductCardSkeleton /></div> : null}
        </div>
      ))}
    </div>
  );
}
