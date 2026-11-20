import type { ProductImage, ProductVariant } from "../types";

const DECIMAL = /^-?(?:0|[1-9]\d*)(?:\.(\d+))?$/;

export function formatVnd(value: string | null | undefined) {
  if (typeof value !== "string" || !DECIMAL.test(value)) return "Không xác định";
  const negative = value.startsWith("-");
  const unsigned = negative ? value.slice(1) : value;
  const [integer, fraction = ""] = unsigned.split(".");
  try {
    const grouped = new Intl.NumberFormat("vi-VN").format(BigInt(integer || "0"));
    const meaningfulFraction = fraction.replace(/0+$/, "");
    return `${negative ? "-" : ""}${grouped}${meaningfulFraction ? `,${meaningfulFraction}` : ""} ₫`;
  } catch {
    return "Không xác định";
  }
}

export function sortProductImages(images: readonly ProductImage[]) {
  return [...images].toSorted((left, right) => Number(right.isCover) - Number(left.isCover) || left.sortOrder - right.sortOrder || left.id.localeCompare(right.id));
}

export function sortProductVariants(variants: readonly ProductVariant[]) {
  return [...variants].toSorted((left, right) => left.sortOrder - right.sortOrder || left.sku.localeCompare(right.sku));
}
