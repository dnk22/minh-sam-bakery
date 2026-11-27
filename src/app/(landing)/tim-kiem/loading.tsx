import { ProductGridSkeleton } from "@/landing/features/catalog/components/product/product-card-skeleton";

export default function SearchLoading() {
  return (
    <main aria-busy="true" aria-label="Đang tải kết quả tìm kiếm" className="min-h-screen bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <div className="mb-space-lg h-16 max-w-lg animate-pulse rounded-xl bg-surface-container" />
        <div className="mb-space-xl h-14 max-w-3xl animate-pulse rounded-xl bg-surface-container-lowest" />
        <div className="flex flex-col gap-gutter-desktop lg:flex-row">
          <div className="h-96 w-full animate-pulse rounded-xl bg-surface-container-lowest lg:w-72 lg:shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="mb-space-lg h-16 animate-pulse rounded-xl bg-surface-container-lowest" />
            <ProductGridSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
