import { parseThemeConfig } from "@/theme/contracts/theme-config.schema";
import type { CmsTheme } from "../../types";
import styles from "../theme-ui.module.css";

const SWATCH_KEYS = ["primary", "secondary", "accent", "background", "surface", "textPrimary"] as const;

export function ThemePalette({ theme }: { theme: CmsTheme }) {
  const parsed = parseThemeConfig(theme.config);
  if (!parsed.success) return <span className={styles.invalid} title="Config chưa tương thích V1">Config legacy / lỗi</span>;
  return (
    <span className={styles.palette} aria-label="Màu sắc của theme">
      {SWATCH_KEYS.map((key) => (
        <span
          aria-label={key + " " + parsed.data.colors[key]}
          className={styles.swatch}
          key={key}
          role="img"
          style={{ backgroundColor: parsed.data.colors[key] }}
          title={key + ": " + parsed.data.colors[key]}
        />
      ))}
    </span>
  );
}
