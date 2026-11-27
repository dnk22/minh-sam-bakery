import type { CatalogProduct } from "../../types";
import { ProductListGrid } from "../product/product-list-grid";

export function CrossCategoryDiscovery({ products }: { products: CatalogProduct[] }) {
  if (!products.length) return null;

  return (
    <section className="w-full bg-surface-container-low">
      <div className="mx-auto w-full max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <div className="mb-space-lg">
          <h2 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">
            Khám phá thêm hương vị
          </h2>
        </div>
        <ProductListGrid products={products} pending={false} />
      </div>
    </section>
  );
}
