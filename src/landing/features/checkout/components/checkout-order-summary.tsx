import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { formatVnd } from "@/landing/features/catalog/pricing";
import type { CheckoutIntent } from "@/landing/features/cart/types";
import { routes } from "@/landing/lib/routes";

export function CheckoutOrderSummary({ intent, isDelivery, formChecked }: {
  intent: CheckoutIntent;
  isDelivery: boolean;
  formChecked: boolean;
}) {
  const subtotal = intent.items.reduce(
    (sum, item) => sum + item.effectivePrice * item.quantity,
    0,
  );

  return (
    <aside
      className="sticky top-24 rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm"
      aria-label="Tóm tắt đơn thanh toán"
    >
      <h2 className="mb-space-md font-headline-md text-headline-sm text-primary">Đơn hàng của bạn</h2>
      <ul className="max-h-[45vh] space-y-space-md overflow-y-auto border-b border-outline-variant pb-space-md">
        {intent.items.map((item) => (
          <li className="flex items-start gap-space-sm" key={item.key}>
            <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-surface-container">
              <SafeImage alt={item.productImageAlt} className="size-full object-cover" src={item.productImage} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-label-ui text-label-ui text-primary">{item.productName}</span>
              <span className="mt-0.5 block font-body-sm text-[12px] text-on-surface-variant">
                {item.variantLabel} × {item.quantity}
              </span>
              <span className="mt-1 block font-price-serif text-[14px] text-primary">
                {formatVnd(item.effectivePrice * item.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-space-md space-y-space-sm">
        <div className="flex justify-between gap-3 font-body-md text-body-md">
          <span>Tạm tính</span>
          <strong>{formatVnd(subtotal)}</strong>
        </div>
        <div className="flex justify-between gap-3 font-body-sm text-body-sm text-on-surface-variant">
          <span>Phí giao hàng</span>
          <span>{isDelivery ? "Chưa xác định" : "Không áp dụng"}</span>
        </div>
      </div>
      <div className="my-space-lg border-t border-outline-variant" />
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-headline-sm text-headline-sm font-semibold text-primary">Tạm tính</span>
        <strong className="font-price-serif text-[24px] text-primary">{formatVnd(subtotal)}</strong>
      </div>
      <button
        className="mt-space-lg flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-space-lg font-label-ui text-label-ui font-semibold text-on-primary"
        type="submit"
      >
        Kiểm tra thông tin
      </button>
      {formChecked ? (
        <div
          className="mt-space-md rounded-lg bg-surface-container-low p-space-md font-body-sm text-body-sm text-primary"
          role="status"
        >
          Thông tin hợp lệ. Chức năng gửi đơn hàng đang chờ cập nhật API;
          chưa có đơn hàng hay thanh toán nào được tạo.
        </div>
      ) : null}
      <Link
        className="mt-space-md flex items-center justify-center gap-2 font-body-sm text-secondary hover:underline"
        href={intent.source === "cart" ? routes.cart : routes.search}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Quay lại mua sắm
      </Link>
    </aside>
  );
}
