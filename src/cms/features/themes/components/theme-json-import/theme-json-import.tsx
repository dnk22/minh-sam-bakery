"use client";

import { FileJson, Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { parseThemeImportJson, type ImportedThemeJson } from "../../lib/theme-import";
import styles from "../theme-ui.module.css";

const MAX_FILE_BYTES = 64 * 1024;

export function ThemeJsonImport({ onImport, disabled = false }: {
  onImport: (value: ImportedThemeJson) => boolean | Promise<boolean>;
  disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    // Allow selecting the same file again after a failed import.
    event.currentTarget.value = "";
    if (!file) return;
    setError(null);
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Chỉ hỗ trợ file .json.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("File JSON quá lớn (tối đa 64 KB).");
      return;
    }

    setReading(true);
    try {
      const result = parseThemeImportJson(await file.text());
      if (!result.success) {
        setError(result.message);
        return;
      }
      if (!await onImport(result.data)) return;
    } catch {
      setError("Không thể đọc file JSON. Vui lòng thử lại.");
    } finally {
      setReading(false);
    }
  };

  return (
    <section className={styles.importSection} aria-label="Import theme từ JSON">
      <div className={styles.importText}>
        <strong><FileJson size={17} aria-hidden="true" /> Import theme từ JSON</strong>
        <p>Nhập nhanh 14 màu và 2 font từ ThemeConfigV1, hoặc cả tên/mã từ payload tạo theme. Import chỉ điền form, không tự lưu.</p>
      </div>
      <input
        ref={fileRef}
        aria-label="Chọn file JSON để import theme"
        className={styles.importFile}
        type="file"
        accept=".json,application/json"
        disabled={disabled || reading}
        onChange={handleFile}
      />
      <CmsButton type="button" variant="outline" disabled={disabled || reading}
        onClick={() => fileRef.current?.click()}>
        <Upload size={16} aria-hidden="true" /> {reading ? "Đang đọc file…" : "Chọn file JSON"}
      </CmsButton>
      {error ? <p className={styles.alert} role="alert">{error}</p> : null}
    </section>
  );
}
