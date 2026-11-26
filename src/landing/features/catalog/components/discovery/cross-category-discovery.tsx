import type { CatalogProduct } from "../../types";
import { DiscoveryFeaturedCard } from "./discovery-featured-card";
import { DiscoveryProductRow } from "./discovery-product-row";

export function CrossCategoryDiscovery({ products }: { products: CatalogProduct[] }) {
  const primaryProduct = products.find((product) => product.isFeatured) ?? products[0];
  if (!primaryProduct) return null;

  const supportingProducts = products
    .filter((product) => product.id !== primaryProduct.id)
    .slice(0, 3);

  return (
    <section className="w-full bg-surface-container-low">
      <div className="mx-auto w-full max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <div className="mb-space-lg">
          <h2 className="font-headline-lg text-headline-md text-primary lg:text-headline-lg">
            Khám phá thêm hương vị
          </h2>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12">
          <DiscoveryFeaturedCard
            product={primaryProduct}
            hasSupportingProducts={supportingProducts.length > 0}
          />
          {supportingProducts.length ? (
            <div className="flex flex-col justify-between gap-space-md lg:col-span-6">
              {supportingProducts.map((product) => (
                <DiscoveryProductRow key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
