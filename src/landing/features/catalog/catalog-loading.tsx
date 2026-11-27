import { ProductGridSkeleton } from "./components/product/product-card-skeleton";

export function CatalogLoading() {
  return <main aria-busy="true" aria-label="Đang tải danh mục sản phẩm" className="min-h-screen bg-surface pt-[var(--landing-header-height)]">
    <div className="h-56 animate-pulse bg-surface-container-low" />
    <section className="mx-auto flex max-w-[1360px] flex-col gap-gutter-desktop px-margin py-space-xl md:px-margin-tablet lg:flex-row xl:px-margin-desktop">
      <div className="h-80 w-full animate-pulse rounded-xl bg-surface-container-lowest lg:w-72 lg:shrink-0" />
      <div className="w-full flex-1"><div className="mb-space-lg h-20 animate-pulse rounded-xl bg-surface-container-lowest" /><ProductGridSkeleton /></div>
    </section>
  </main>;
}
