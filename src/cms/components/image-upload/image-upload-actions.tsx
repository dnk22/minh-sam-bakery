import { LoaderCircle, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { CmsButton } from "@/cms/components/ui/button";
import styles from "./image-upload.module.css";

export function ImageUploadActions({ disabled, uploading, pending, canRemove, error, onChoose, onUpload, onCancel, onRemove }: {
  disabled: boolean; uploading: boolean; pending: boolean; canRemove: boolean; error: boolean;
  onChoose: () => void; onUpload: () => void; onCancel: () => void; onRemove: () => void;
}) {
  const locked = disabled || uploading;
  return <div className={styles.actions}>
    <CmsButton type="button" variant="outline" size="sm" disabled={locked} onClick={onChoose}><Upload aria-hidden="true" size={15} /> Chọn ảnh</CmsButton>
    {pending ? <>
      <CmsButton type="button" size="sm" disabled={locked} onClick={onUpload}>
        {uploading ? <LoaderCircle aria-hidden="true" className={styles.spin} size={15} /> : <RotateCcw aria-hidden="true" size={15} />}
        {uploading ? "Đang tải…" : error ? "Thử lại" : "Tải ảnh"}
      </CmsButton>
      <CmsButton type="button" variant="ghost" size="sm" disabled={locked} onClick={onCancel}><X aria-hidden="true" size={15} /> Hủy ảnh chờ</CmsButton>
    </> : canRemove ? <CmsButton type="button" variant="ghost" size="sm" disabled={locked} onClick={onRemove}><Trash2 aria-hidden="true" size={15} /> Gỡ ảnh</CmsButton> : null}
  </div>;
}
