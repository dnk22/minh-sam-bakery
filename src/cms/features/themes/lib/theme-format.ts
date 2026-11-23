import { parseThemeConfig } from "../../../../theme/contracts/theme-config.schema.ts";
import type { CmsTheme } from "../types.ts";

export function themeConfigStatus(theme: CmsTheme) {
  const parsed = parseThemeConfig(theme.config);
  return { valid: parsed.success, config: parsed.success ? parsed.data : null };
}

export function formatThemeDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function themeCodeFromName(value: string): string {
  return value.trim().toLocaleLowerCase("vi-VN").replace(/đ/g, "d").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
