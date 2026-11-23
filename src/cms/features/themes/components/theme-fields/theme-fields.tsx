"use client";

import { useMemo } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsFormSelect } from "@/cms/components/ui/select/select";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import { parseThemeConfig } from "@/theme/contracts/theme-config.schema";
import { validateThemeContrast } from "@/theme/colors/contrast-validator";

import { THEME_COLOR_GROUPS, THEME_FONT_OPTIONS } from "../../constants";
import type { ThemeFormValues } from "../../types";
import { ThemeColorField } from "../theme-color-field/theme-color-field";
import styles from "../theme-ui.module.css";

export function ThemeFields({ form, onCodeManual }: {
  form: UseFormReturn<ThemeFormValues>;
  onCodeManual: () => void;
}) {
  const { register, formState: { errors } } = form;
  const config = useWatch({ control: form.control, name: "config" });
  const warnings = useMemo(() => {
    const parsed = parseThemeConfig(config);
    return parsed.success ? validateThemeContrast(parsed.data).filter((item) => !item.passed) : [];
  }, [config]);

  return (
    <>
      <section className={styles.section} aria-label="Thông tin theme">
        <h3>Thông tin cơ bản</h3>
        <div className={styles.metaGrid}>
          <CmsFormField htmlFor="theme-name" label="Tên giao diện" error={errors.name?.message} required>
            <CmsInput id="theme-name" placeholder="Ví dụ: Minh Sâm Classic" {...register("name")} />
          </CmsFormField>
          <CmsFormField htmlFor="theme-code" label="Mã theme" error={errors.code?.message} required
            description="Chỉ chữ thường, số và dấu gạch ngang; phải duy nhất.">
            <CmsInput id="theme-code" placeholder="minh-sam-classic" {...register("code", { onChange: onCodeManual })} />
          </CmsFormField>
        </div>
        <CmsFormField htmlFor="theme-description" label="Mô tả" error={errors.description?.message}>
          <CmsTextarea id="theme-description" rows={2} placeholder="Mô tả ngắn về phong cách giao diện" {...register("description")} />
        </CmsFormField>
      </section>
      {THEME_COLOR_GROUPS.map((group) => (
        <section className={styles.section} key={group.title} aria-label={group.title}>
          <h3>{group.title}</h3>
          <div className={styles.colors}>
            {group.entries.map((entry) => (
              <ThemeColorField key={entry.key} colorKey={entry.key} label={entry.label} hint={entry.hint} form={form} />
            ))}
          </div>
        </section>
      ))}
      <section className={styles.section} aria-label="Font chữ">
        <h3>Font chữ</h3>
        <div className={styles.metaGrid}>
          <CmsFormField htmlFor="theme-font-heading" label="Heading Font" error={errors.config?.typography?.heading?.message} required>
            <CmsFormSelect id="theme-font-heading" options={THEME_FONT_OPTIONS} control={form.control} name="config.typography.heading" />
          </CmsFormField>
          <CmsFormField htmlFor="theme-font-body" label="Body Font" error={errors.config?.typography?.body?.message} required>
            <CmsFormSelect id="theme-font-body" options={THEME_FONT_OPTIONS} control={form.control} name="config.typography.body" />
          </CmsFormField>
        </div>
        <p className={styles.note}>Giữ nguyên layout, cỡ chữ, độ đậm, khoảng cách và animation. Không hỗ trợ font ngoài registry.</p>
      </section>
      {warnings.length ? (
        <section className={styles.warning} role="status" aria-label="Cảnh báo tương phản màu">
          <strong>{warnings.length} cặp màu có độ tương phản thấp</strong>
          <p>Có thể lưu theme nháp, nhưng nên sửa trước khi kích hoạt ở Phase 4.</p>
          <ul>
            {warnings.slice(0, 6).map((item) => (
              <li key={item.id}>{item.context} ({item.ratio.toFixed(2)}:1; tối thiểu {item.requiredRatio}:1)</li>
            ))}
          </ul>
          {warnings.length > 6 ? <p>Và {warnings.length - 6} cảnh báo khác.</p> : null}
        </section>
      ) : null}
    </>
  );
}
