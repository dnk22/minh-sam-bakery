"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import type { ThemeColorKey } from "../../constants";
import type { ThemeFormValues } from "../../types";
import styles from "../theme-ui.module.css";

type Props = {
  form: UseFormReturn<ThemeFormValues>;
  colorKey: ThemeColorKey;
  label: string;
  hint: string;
};

export function ThemeColorField({ form, colorKey, label, hint }: Props) {
  const name = ("config.colors." + colorKey) as `config.colors.${ThemeColorKey}`;
  const value = useWatch({ control: form.control, name });
  const error = form.formState.errors.config?.colors?.[colorKey]?.message;
  const colorValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  const id = "theme-color-" + colorKey;

  return (
    <CmsFormField label={label} htmlFor={id} fieldName={name} error={error} description={hint} required>
      <div className={styles.colorControl}>
        <input
          aria-label={"Chọn màu " + label}
          className={styles.colorPicker}
          type="color"
          value={colorValue}
          onChange={(event) =>
            form.setValue(name, event.target.value.toUpperCase(), { shouldDirty: true, shouldValidate: true })
          }
        />
        <CmsInput
          id={id}
          containerClassName={styles.colorInput}
          placeholder="#RRGGBB"
          maxLength={7}
          spellCheck={false}
          autoCapitalize="characters"
          {...form.register(name)}
        />
      </div>
    </CmsFormField>
  );
}
