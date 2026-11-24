import type { ThemeColorsV1 } from "../../../theme/contracts/theme.types.ts";

export type ThemeColorKey = keyof ThemeColorsV1;
export type ThemeColorGroup = { title: string; entries: readonly { key: ThemeColorKey; label: string; hint: string }[] };

/** CMS edits only the core palette; all derived semantic colors come from Theme Engine. */
export const THEME_COLOR_GROUPS: readonly ThemeColorGroup[] = [
  { title: "Brand Colors", entries: [
    { key: "primary", label: "Primary", hint: "Màu chính của thương hiệu; dùng cho Header, Hero và CTA." },
    { key: "primaryContainer", label: "Primary Container", hint: "Phiên bản Primary dùng làm background cho các section/card tối." },
    { key: "onPrimary", label: "On Primary", hint: "Màu text/icon hiển thị trên nền Primary." },
    { key: "secondary", label: "Secondary", hint: "Màu thương hiệu thứ cấp cho label và điểm nhấn." },
    { key: "secondaryLight", label: "Secondary Light", hint: "Phiên bản Secondary sáng cho các chi tiết phụ." },
    { key: "onSecondary", label: "On Secondary", hint: "Màu text/icon trên nền Secondary." },
    { key: "accent", label: "Accent", hint: "Màu nổi bật cho CTA, nút và chi tiết trang trí." },
  ] },
  { title: "Background & Surface", entries: [
    { key: "background", label: "Background", hint: "Background tổng thể của Landing." },
    { key: "surface", label: "Surface", hint: "Background chính của các vùng nội dung." },
    { key: "surfaceMuted", label: "Surface Muted", hint: "Surface nhẹ cho card, filter và nhóm nội dung phụ." },
    { key: "surfaceElevated", label: "Surface Elevated", hint: "Surface phân tầng để tạo độ nổi so với nền." },
  ] },
  { title: "Text & Border", entries: [
    { key: "textPrimary", label: "Text Primary", hint: "Màu text chính cho nội dung và heading trên nền sáng." },
    { key: "textSecondary", label: "Text Secondary", hint: "Màu text phụ cho mô tả, caption và metadata." },
    { key: "border", label: "Border", hint: "Màu border, divider và outline." },
  ] },
] as const;

export const THEME_FONT_OPTIONS = [
  { value: "noto-serif", label: "Noto Serif" },
  { value: "be-vietnam-pro", label: "Be Vietnam Pro" },
] as const;

export const THEME_STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Chưa kích hoạt" },
] as const;
