import type { ThemeColorsV1 } from "../../../theme/contracts/theme.types.ts";

export type ThemeColorKey = keyof ThemeColorsV1;
export type ThemeColorGroup = { title: string; entries: readonly { key: ThemeColorKey; label: string; hint: string }[] };

/** CMS edits only the core palette; all derived semantic colors come from Theme Engine. */
export const THEME_COLOR_GROUPS: readonly ThemeColorGroup[] = [
  { title: "Thương hiệu", entries: [
    { key: "primary", label: "Primary", hint: "Màu chủ đạo, nền Header và Hero" },
    { key: "primaryContainer", label: "Primary Container", hint: "Nền tối phân cấp" },
    { key: "onPrimary", label: "On Primary", hint: "Chữ hiển thị trên Primary" },
    { key: "secondary", label: "Secondary", hint: "Nhãn, tiêu đề và điểm nhấn" },
    { key: "secondaryLight", label: "Secondary Light", hint: "Màu phụ sáng" },
    { key: "onSecondary", label: "On Secondary", hint: "Chữ trên Secondary" },
  ] },
  { title: "Nền và bề mặt", entries: [
    { key: "background", label: "Background", hint: "Nền website" },
    { key: "surface", label: "Surface", hint: "Bề mặt cơ bản" },
    { key: "surfaceMuted", label: "Surface Muted", hint: "Bề mặt dịu" },
    { key: "surfaceElevated", label: "Surface Elevated", hint: "Bề mặt nổi" },
  ] },
  { title: "Chữ và đường viền", entries: [
    { key: "textPrimary", label: "Text Primary", hint: "Nội dung chính" },
    { key: "textSecondary", label: "Text Secondary", hint: "Nội dung phụ" },
    { key: "border", label: "Border", hint: "Viền và phân cách" },
    { key: "accent", label: "Accent", hint: "Màu nhấn/CTA vàng" },
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
