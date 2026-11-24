import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { parseThemeConfig } from "@/theme/contracts/theme-config.schema";
import { validateThemeContrast } from "@/theme/colors/contrast-validator";
import { THEME_COLOR_GROUPS, THEME_FONT_OPTIONS } from "../../constants";
import { formatThemeDate } from "../../lib/theme-format";
import type { CmsTheme } from "../../types";
import { ThemePalette } from "../theme-palette/theme-palette";
import styles from "../theme-ui.module.css";

export function ThemeDetail({ theme }: { theme: CmsTheme }) {
  const parsed = parseThemeConfig(theme.config);
  const warnings = parsed.success ? validateThemeContrast(parsed.data).filter((item) => !item.passed) : [];
  const fontLabel = (id: string) => THEME_FONT_OPTIONS.find((item) => item.value === id)?.label ?? id;

  return (
    <div className={styles.detail}>
      <div className={styles.name}>
        <ThemePalette theme={theme} />
        <CmsBadge variant={theme.isActive ? "success" : "secondary"}>
          {theme.isActive ? "Đang hoạt động" : "Chưa kích hoạt"}
        </CmsBadge>
        {!parsed.success ? <CmsBadge variant="warning">Config legacy / lỗi</CmsBadge> : null}
      </div>
      <dl className={styles.details}>
        <div><dt>Tên</dt><dd>{theme.name}</dd></div>
        <div><dt>Mã</dt><dd>{theme.code}</dd></div>
        <div><dt>Mô tả</dt><dd>{theme.description || "—"}</dd></div>
        <div><dt>Ngày tạo</dt><dd>{formatThemeDate(theme.createdAt)}</dd></div>
        <div><dt>Cập nhật</dt><dd>{formatThemeDate(theme.updatedAt)}</dd></div>
      </dl>
      {!parsed.success ? (
        <p className={styles.alert} role="alert">Cấu hình không tương thích ThemeConfigV1. Không thể sửa/nhân bản tự động để tránh mất dữ liệu. Tạo theme V1 mới nếu cần.</p>
      ) : <>
        {THEME_COLOR_GROUPS.map((group) => (
          <section className={styles.section} key={group.title}>
            <h3>{group.title}</h3>
            <div className={styles.colors}>
              {group.entries.map((entry) => (
                <div className={styles.name} key={entry.key}>
                  <span className={styles.swatch} style={{ backgroundColor: parsed.data.colors[entry.key] }} aria-hidden="true" />
                  <span className={styles.nameText}><strong>{entry.label}</strong><small>{parsed.data.colors[entry.key]}</small></span>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className={styles.section}>
          <h3>Font chữ</h3>
          <dl className={styles.details}>
            <div><dt>Heading</dt><dd>{fontLabel(parsed.data.typography.heading)}</dd></div>
            <div><dt>Body</dt><dd>{fontLabel(parsed.data.typography.body)}</dd></div>
          </dl>
        </section>
        {warnings.length ? <div className={styles.warning} role="status">
          <strong>{warnings.length} cảnh báo tương phản</strong>
          <ul>{warnings.slice(0, 6).map((item) =>
            <li key={item.id}>{item.context} ({item.ratio.toFixed(2)}:1)</li>)}</ul>
        </div> : null}
      </>}
      {theme.isActive ? <p className={styles.note}>Theme đang chạy trên Landing. Hãy nhân bản trước khi chỉnh sửa.</p> : null}
    </div>
  );
}
