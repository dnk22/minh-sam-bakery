export function CatalogLoading() {
  return <main aria-busy="true" aria-label="Đang tải danh mục sản phẩm" className="min-h-screen bg-surface pt-[var(--landing-header-height)]">
    <div className="h-56 animate-pulse bg-surface-container-low" />
    <section className="mx-auto flex max-w-[1360px] flex-col gap-gutter-desktop px-margin py-space-xl md:px-margin-tablet lg:flex-row xl:px-margin-desktop">
      <div className="h-80 w-full animate-pulse rounded-xl bg-surface-container-lowest lg:w-72 lg:shrink-0" />
      <div className="w-full flex-1"><div className="mb-space-lg h-20 animate-pulse rounded-xl bg-surface-container-lowest" /><div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div className="h-96 animate-pulse rounded-xl bg-surface-container-lowest" key={index} />)}</div></div>
    </section>
  </main>;
}
