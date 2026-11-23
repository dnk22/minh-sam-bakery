import { cartLineKey } from "./selection.ts";
import type { CartLine, CartVariantOption } from "./types.ts";

export function getSelectedCartLines(items: CartLine[]): CartLine[] {
  return items.filter((item) => item.selected);
}

export function cartSubtotal(items: CartLine[]): number {
  return getSelectedCartLines(items).reduce((sum, item) => sum + item.effectivePrice * item.quantity, 0);
}

export function isAllCartSelected(items: CartLine[]): boolean {
  return items.length > 0 && items.every((item) => item.selected);
}

export function switchCartVariant(items: CartLine[], key: string, optionId: string | null): CartLine[] {
  const current = items.find((item) => item.key === key);
  if (!current) return items;
  const option = current.availableVariants.find((candidate) => candidate.id === optionId);
  if (!option) return items;
  const nextKey = cartLineKey(current.productId, option.id);
  if (nextKey === key) return items;
  const existing = items.find((item) => item.key === nextKey);
  const updated: CartLine = {
    ...current,
    key: nextKey,
    variantId: option.id,
    variantLabel: option.label,
    originalPrice: option.originalPrice,
    effectivePrice: option.effectivePrice,
    selected: true,
  };
  if (existing) {
    return items.filter((item) => item.key !== key).map((item) =>
      item.key === nextKey
        ? { ...updated, quantity: Math.min(20, item.quantity + updated.quantity) }
        : item);
  }
  return items.map((item) => item.key === key ? updated : item);
}

export function toCartVariantOption(id: string | null, label: string, originalPrice: number, effectivePrice: number): CartVariantOption {
  return { id, label, originalPrice, effectivePrice };
}
