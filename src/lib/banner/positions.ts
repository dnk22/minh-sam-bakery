export const BANNER_POSITIONS = [
  { value: "home_hero", label: "Hero trang chủ", page: "/", description: "Banner chính ở đầu trang chủ." },
  { value: "home_gifting", label: "Quà tặng trang chủ", page: "/", description: "Banner cho khu vực quà tặng trên trang chủ." },
  { value: "products_hero", label: "Hero sản phẩm (không còn hiển thị)", page: "/danh-muc", description: "Vị trí cũ của trang sản phẩm; hiện không được Landing render." },
  { value: "about_hero", label: "Hero giới thiệu", page: "/ve-minh-sam", description: "Banner chính ở đầu trang giới thiệu Minh Sâm." },
] as const;

export type BannerPosition = typeof BANNER_POSITIONS[number]["value"];
export type BannerPositionDefinition = typeof BANNER_POSITIONS[number];

const positions = new Map<string, BannerPositionDefinition>(BANNER_POSITIONS.map((item) => [item.value, item]));

export function isBannerPosition(value: unknown): value is BannerPosition {
  return typeof value === "string" && positions.has(value);
}

export function getBannerPosition(value: BannerPosition | string) {
  return positions.get(value);
}

export function getBannerPositionLabel(value: BannerPosition | string) {
  return getBannerPosition(value)?.label ?? value;
}

export const BANNER_POSITION_OPTIONS: ReadonlyArray<{ value: BannerPosition; label: string }> =
  BANNER_POSITIONS.map(({ value, label }) => ({ value, label }));
