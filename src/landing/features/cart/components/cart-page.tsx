"use client";

import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SafeImage } from "@/landing/components/ui/safe-image";
import { formatVnd } from "@/landing/features/catalog/pricing";
import { saveCartCheckoutIntent } from "@/landing/features/checkout/store/checkout-intent";
import { routes } from "@/landing/lib/routes";

import { cartSubtotal, getSelectedCartLines, isAllCartSelected } from "../logic";
import { useCartHydrated } from "./cart-hydration";
import { useCartStore } from "../store/cart-store";
import type { CartLine } from "../types";

export function CartPage() {
  const router = useRouter();
  const [navigationError, setNavigationError] = useState("");
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const toggleItem = useCartStore((state) => state.toggleItem);
  const selectAll = useCartStore((state) => state.selectAll);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const switchVariant = useCartStore((state) => state.switchVariant);
  const selected = getSelectedCartLines(items);
  const subtotal = cartSubtotal(items);
  const allSelected = isAllCartSelected(items);

  const proceedToCheckout = () => {
    if (!selected.length) return;
    if (!saveCartCheckoutIntent(selected)) {
      setNavigationError("Không thể lưu thông tin thanh toán. Vui lòng kiểm tra cài đặt trình duyệt.");
      return;
    }
    setNavigationError("");
    router.push(routes.checkout);
  };

  return (
    <main className="min-h-[65vh] bg-surface pt-[var(--landing-header-height)]">
      <section className="mx-auto max-w-[1360px] px-gutter py-space-xl lg:px-gutter-desktop">
        <nav aria-label="Đường dẫn trang" className="mb-space-lg flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <Link href={routes.home}>Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-primary">Giỏ hàng</span>
        </nav>
        <h1 className="mb-space-xl font-headline-lg text-headline-md text-primary lg:text-headline-lg">Giỏ hàng của bạn</h1>
        {!hydrated ? (
          <div aria-live="polite" className="rounded-xl bg-surface-container-low p-space-xl text-center font-body-md">Đang tải giỏ hàng...</div>
        ) : items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-space-md rounded-xl bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm">
            <ShoppingBag aria-hidden="true" className="size-12 text-secondary" />
            <h2 className="font-headline-md text-headline-md text-primary">Giỏ hàng đang trống</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Khám phá các dòng bánh và chọn hương vị bạn yêu thích.</p>
            <Link className="rounded-lg bg-primary px-space-lg py-3 font-label-ui text-on-primary" href={routes.search}>Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="grid items-start gap-gutter-desktop lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
            <div className="min-w-0 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-center justify-between border-b border-outline-variant px-space-md py-space-md">
                <label className="flex cursor-pointer items-center gap-3 font-label-ui font-semibold text-primary">
                  <input
                    aria-label="Chọn tất cả sản phẩm trong giỏ"
                    checked={allSelected}
                    className="size-5 accent-primary"
                    onChange={(event) => selectAll(event.target.checked)}
                    type="checkbox"
                  />
                  Chọn tất cả ({items.length})
                </label>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{selected.length} dòng đã chọn</span>
              </div>
              <ul className="divide-y divide-outline-variant">
                {items.map((item) => (
                  <CartRow
                    item={item}
                    key={item.key}
                    onRemove={() => removeItem(item.key)}
                    onToggle={() => toggleItem(item.key)}
                    onQuantity={(quantity) => updateQuantity(item.key, quantity)}
                    onVariant={(variantId) => switchVariant(item.key, variantId)}
                  />
                ))}
              </ul>
            </div>

            <aside aria-label="Tóm tắt giỏ hàng" className="sticky top-24 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <h2 className="mb-space-lg font-headline-md text-headline-sm text-primary">Cộng giỏ hàng</h2>
              <div className="flex items-center justify-between font-body-md text-body-md">
                <span>Tạm tính ({selected.length} dòng)</span>
                <strong className="text-primary">{formatVnd(subtotal)}</strong>
              </div>
              <div className="mt-space-md flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>Phí giao hàng</span>
                <span>Tính ở bước thanh toán</span>
              </div>
              <div className="my-space-lg border-t border-outline-variant" />
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-headline-sm text-headline-sm font-semibold text-primary">Tạm tính</span>
                <strong className="font-price-serif text-[24px] text-primary">{formatVnd(subtotal)}</strong>
              </div>
              <p className="mt-space-sm font-body-sm text-[12px] text-on-surface-variant">
                Giá hiện tại trong giỏ là giá tham khảo, sẽ được kiểm tra lại khi tạo đơn.
              </p>
              <button
                className="mt-space-lg flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-space-lg font-label-ui font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selected.length === 0}
                onClick={proceedToCheckout}
                type="button"
              >
                Thanh toán ({selected.length})
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
              {navigationError ? <p className="mt-space-sm font-body-sm text-error" role="alert">{navigationError}</p> : null}
              <Link className="mt-space-md flex items-center justify-center gap-2 font-body-sm text-body-sm text-secondary hover:underline" href={routes.search}>
                <ArrowLeft aria-hidden="true" className="size-4" />
                Tiếp tục mua sắm
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function CartRow({ item, onRemove, onToggle, onQuantity, onVariant }: {
  item: CartLine;
  onRemove: () => void;
  onToggle: () => void;
  onQuantity: (quantity: number) => void;
  onVariant: (variantId: string | null) => void;
}) {
  return (
    <li className="flex flex-col gap-space-md p-space-md sm:flex-row sm:items-start">
      <div className="flex min-w-0 items-start gap-space-sm sm:flex-1">
        <input
          aria-label={`Chọn ${item.productName} ${item.variantLabel}`}
          checked={item.selected}
          className="mt-4 size-5 shrink-0 accent-primary"
          onChange={onToggle}
          type="checkbox"
        />
        <Link className="block size-24 shrink-0 overflow-hidden rounded bg-surface-container sm:size-28" href={routes.product(item.categorySlug, item.productSlug)}>
          <SafeImage alt={item.productImageAlt} className="size-full object-cover" src={item.productImage} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link className="font-headline-sm text-[16px] leading-snug text-primary hover:text-secondary" href={routes.product(item.categorySlug, item.productSlug)}>
            {item.productName}
          </Link>
          {item.availableVariants.length > 1 ? (
            <label className="mt-2 flex flex-col gap-1 font-body-sm text-[12px] text-on-surface-variant">
              Quy cách
              <select
                aria-label={`Đổi quy cách cho ${item.productName}`}
                className="max-w-full rounded-md border border-outline-variant bg-surface px-2 py-2 font-body-sm text-body-sm text-primary"
                onChange={(event) => onVariant(event.target.value === "__base__" ? null : event.target.value)}
                value={item.variantId ?? "__base__"}
              >
                {item.availableVariants.map((variant) => (
                  <option key={variant.id ?? "__base__"} value={variant.id ?? "__base__"}>{variant.label}</option>
                ))}
              </select>
            </label>
          ) : <span className="mt-1 block font-body-sm text-body-sm text-on-surface-variant">{item.variantLabel}</span>}
          <button aria-label={`Xóa ${item.productName} khỏi giỏ`} className="mt-3 flex items-center gap-1 font-body-sm text-[12px] text-on-surface-variant underline hover:text-error" onClick={onRemove} type="button">
            <Trash2 aria-hidden="true" className="size-3.5" /> Xóa sản phẩm
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-space-md pl-8 sm:flex-col sm:items-end sm:pl-0">
        <div className="text-right">
          <strong className="font-price-serif text-[18px] text-primary">{formatVnd(item.effectivePrice * item.quantity)}</strong>
          {item.originalPrice > item.effectivePrice ? (
            <del className="ml-2 font-body-sm text-[12px] text-outline">{formatVnd(item.originalPrice * item.quantity)}</del>
          ) : null}
        </div>
        <div className="flex items-center rounded-lg border border-outline-variant bg-surface">
          <button aria-label={`Giảm số lượng ${item.productName}`} className="flex size-10 items-center justify-center disabled:opacity-40" disabled={item.quantity <= 1} onClick={() => onQuantity(item.quantity - 1)} type="button"><Minus className="size-4" /></button>
          <span className="min-w-8 text-center font-label-ui font-semibold">{item.quantity}</span>
          <button aria-label={`Tăng số lượng ${item.productName}`} className="flex size-10 items-center justify-center disabled:opacity-40" disabled={item.quantity >= 20} onClick={() => onQuantity(item.quantity + 1)} type="button"><Plus className="size-4" /></button>
        </div>
      </div>
    </li>
  );
}
