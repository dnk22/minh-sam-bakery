"use client";

import { useRef } from "react";
import { useCmsFormFieldControl } from "@/cms/components/ui/form-field/form-field";
import { useImageUpload } from "./hooks/use-image-upload";
import { ImageUploadActions } from "./image-upload-actions";
import { ImageUploadPreview } from "./image-upload-preview";
import styles from "./image-upload.module.css";

export function ImageUpload({ value, onChange, onPendingChange, folder, disabled = false, altText = "Ảnh đại diện", pendingMessage = "Ảnh chưa được tải lên. Hãy tải ảnh trước khi lưu.", allowRemove = true }: {
  value: string | null;
  onChange: (url: string | null) => void;
  onPendingChange?: (pending: boolean) => void;
  folder: string;
  disabled?: boolean;
  altText?: string;
  pendingMessage?: string;
  allowRemove?: boolean;
}) {
  const field = useCmsFormFieldControl({});
  const inputRef = useRef<HTMLInputElement>(null);
  const editor = useImageUpload({ folder, disabled, onChange, onPendingChange });
  return <div aria-describedby={field.describedBy} aria-invalid={field.invalid || undefined} className={styles.root} data-invalid={field.invalid || undefined} data-upload-pending={editor.pending ? true : undefined} tabIndex={editor.pending ? -1 : undefined}>
    <ImageUploadPreview value={editor.pending?.preview ?? value} altText={altText} />
    <input ref={inputRef} aria-describedby={field.describedBy} aria-invalid={field.invalid || undefined} className={styles.hiddenInput} type="file" accept="image/*" disabled={disabled || editor.uploading} onChange={event => { editor.select(event.target.files?.[0]); event.currentTarget.value = ""; }} />
    <ImageUploadActions disabled={disabled} uploading={editor.uploading} pending={Boolean(editor.pending)} canRemove={Boolean(value) && allowRemove} error={Boolean(editor.error)} onChoose={() => inputRef.current?.click()} onUpload={editor.upload} onCancel={editor.cancel} onRemove={editor.remove} />
    {editor.pending ? <p className={styles.note}>{pendingMessage}</p> : null}
    {editor.error ? <p className={styles.error} role="alert">{editor.error}</p> : null}
  </div>;
}
