import type { SearchPrice, SearchSort } from "./query";

export const PRICE_OPTIONS: ReadonlyArray<{ value: SearchPrice; label: string }> = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-200", label: "Dưới 200.000đ" },
  { value: "200-500", label: "200.000đ – 500.000đ" },
  { value: "over-500", label: "Trên 500.000đ" },
];

export const SORT_OPTIONS: ReadonlyArray<{ value: SearchSort; label: string }> = [
  { value: "recent", label: "Mới đăng" },
  { value: "price-asc", label: "Giá niêm yết tăng dần" },
  { value: "price-desc", label: "Giá niêm yết giảm dần" },
];
