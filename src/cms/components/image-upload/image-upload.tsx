"use client";

import { ImageIcon, LoaderCircle, RotateCcw, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CmsButton } from "@/cms/components/ui/button";
import { uploadCmsImage } from "@/cms/lib/api/uploads.client";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";

import styles from "./image-upload.module.css";

export function ImageUpload({ value, onChange, onPendingChange, folder, disabled = false }: {
  value: string | null;
  onChange: (url: string | null) => void;
  onPendingChange?: (pending: boolean) => void;
  folder: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (localPreview) URL.revokeObjectURL(localPreview); }, [localPreview]);

  const selectFile = (file?: File) => {
    if (!file) return;
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(URL.createObjectURL(file));
    setPendingFile(file);
    onPendingChange?.(true);
    setError(null);
  };

  const upload = async () => {
    if (!pendingFile || uploading) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadCmsImage(pendingFile, folder);
      onChange(url);
      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
      setPendingFile(null);
      onPendingChange?.(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể tải ảnh lên.");
    } finally { setUploading(false); }
  };

  const preview = localPreview ?? value;
  return (
    <div className={styles.root}>
      <div className={styles.preview}>
        {preview ? <Image alt="Ảnh đại diện danh mục" src={cmsAssetUrl(preview)} width={640} height={320} unoptimized onError={(event) => { event.currentTarget.hidden = true; }} /> : <ImageIcon aria-hidden="true" />}
      </div>
      <input ref={inputRef} className={styles.hiddenInput} type="file" accept="image/*" disabled={disabled || uploading} onChange={(event) => { selectFile(event.target.files?.[0]); event.currentTarget.value = ""; }} />
      <div className={styles.actions}>
        <CmsButton type="button" variant="outline" size="sm" disabled={disabled || uploading} onClick={() => inputRef.current?.click()}>
          <Upload aria-hidden="true" size={15} /> Chọn ảnh
        </CmsButton>
        {pendingFile ? <CmsButton type="button" size="sm" disabled={uploading} onClick={upload}>
          {uploading ? <LoaderCircle aria-hidden="true" className={styles.spin} size={15} /> : <RotateCcw aria-hidden="true" size={15} />}
          {uploading ? "Đang tải…" : error ? "Thử lại" : "Tải ảnh"}
        </CmsButton> : null}
        {preview ? <CmsButton type="button" variant="ghost" size="sm" disabled={disabled || uploading} onClick={() => {
          if (localPreview) URL.revokeObjectURL(localPreview);
          setLocalPreview(null); setPendingFile(null); setError(null); onPendingChange?.(false); onChange(null);
        }}><Trash2 aria-hidden="true" size={15} /> Gỡ ảnh</CmsButton> : null}
      </div>
      {pendingFile ? <p className={styles.note}>Ảnh chưa được tải lên. Hãy tải ảnh trước khi lưu danh mục.</p> : null}
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </div>
  );
}
