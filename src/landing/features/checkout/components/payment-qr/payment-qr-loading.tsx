export function PaymentQrLoading() {
  return <section aria-busy="true" aria-label="Đang tải thông tin thanh toán" className="mt-space-md space-y-4 rounded-xl bg-surface-container-low p-4">
    <div aria-hidden="true" className="mx-auto aspect-square w-48 max-w-full rounded-lg bg-surface-container-high motion-safe:animate-pulse" />
    <div aria-hidden="true" className="mx-auto h-4 w-2/3 rounded bg-surface-container-high motion-safe:animate-pulse" />
    <div aria-hidden="true" className="mx-auto h-4 w-1/2 rounded bg-surface-container-high motion-safe:animate-pulse" />
    <p className="sr-only" role="status">Đang tải thông tin thanh toán</p>
  </section>;
}
