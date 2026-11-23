"use client";

export default function SearchRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-surface px-gutter pt-[var(--landing-header-height)]">
      <div className="max-w-lg rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-md">
        <h1 className="font-headline-md text-headline-md text-primary">Chưa thể mở trang tìm kiếm</h1>
        <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
          Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau.
        </p>
        <button className="mt-space-md rounded-lg bg-primary px-space-lg py-space-sm font-label-ui text-on-primary" onClick={reset} type="button">
          Thử lại
        </button>
      </div>
    </main>
  );
}
