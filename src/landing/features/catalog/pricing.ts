/**
 * Prices in public product DTOs are decimal strings, not browser-supplied totals.
 * Product cards present the cheapest ACTIVE variant and only compare prices
 * belonging to the same product/variant.
 */
export type PriceBreakdown = {
  originalPrice: number;
  salePrice: number | null;
  effectivePrice: number;
  hasDiscount: boolean;
  discountPercent: number | null;
};

export function parseBackendPrice(value: string, field = "price"): number {
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) throw new Error(`Invalid ${field}: ${value}`);
  const [whole, fraction = ""] = value.split(".");
  const cents = BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  if (cents > BigInt(Number.MAX_SAFE_INTEGER) * BigInt(100)) throw new Error(`${field} is outside the supported range`);
  return Number(cents) / 100;
}

export function breakDownPrice(price: string, salePrice: string | null | undefined, field = "price"): PriceBreakdown {
  const originalPrice = parseBackendPrice(price, field);
  const sale = salePrice == null ? null : parseBackendPrice(salePrice, `${field} salePrice`);
  const effectivePrice = sale ?? originalPrice;
  const hasDiscount = sale !== null && originalPrice > 0 && sale < originalPrice;
  const discountPercent = hasDiscount ? Math.round((1 - effectivePrice / originalPrice) * 100) : null;
  return { originalPrice, salePrice: sale, effectivePrice, hasDiscount, discountPercent };
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
  }).format(amount);
}

export function effectivePrice(price: string, salePrice: string | null | undefined, field: string): number {
  return breakDownPrice(price, salePrice, field).effectivePrice;
}
