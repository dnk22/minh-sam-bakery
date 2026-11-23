"use client";

export function CatalogEmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-primary">Chưa có sản phẩm phù hợp</h3>
      <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
        Không tìm thấy sản phẩm khớp với tiêu chí hiện tại. Bạn có thể thử từ khóa hoặc bộ lọc khác.
      </p>
      {hasFilters ? (
        <button className="mt-space-md rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-on-primary" onClick={onReset} type="button">
          Xóa bộ lọc
        </button>
      ) : null}
    </div>
  );
}

export function CatalogErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm" role="alert">
      <h3 className="font-headline-sm text-headline-sm text-primary">Chưa thể tải danh sách sản phẩm</h3>
      <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
        Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau ít phút.
      </p>
      <button className="mt-space-md rounded bg-primary px-space-md py-2.5 font-label-ui text-label-ui text-on-primary" onClick={onRetry} type="button">
        Thử lại
      </button>
    </div>
  );
}
