/** Match the landscape ProductCard's image, typography and purchase actions. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm motion-safe:animate-pulse">
      <div className="aspect-[4/3] w-full bg-surface-container" />
      <div className="flex flex-1 flex-col justify-between p-space-md">
        <div>
          <div className="mb-1 h-[var(--text-headline-sm--line-height,28px)] w-3/4 rounded bg-surface-container" />
          <div className="mb-space-sm space-y-1">
            <div className="h-4 w-full rounded bg-surface-container" />
            <div className="h-4 w-4/5 rounded bg-surface-container" />
          </div>
        </div>
        <div className="mt-space-xs flex flex-col gap-space-sm pt-space-sm">
          <div className="h-[30px] w-1/2 rounded bg-surface-container" />
          <div className="flex items-stretch gap-space-xs">
            <div className="h-11 flex-1 rounded-lg bg-surface-container" />
            <div className="size-11 rounded-lg bg-surface-container" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Đang tải sản phẩm" className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: Math.max(1, count) }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}
