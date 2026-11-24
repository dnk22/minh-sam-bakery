"use client";

import { LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CmsButton } from "@/cms/components/ui/button";
import styles from "./product-image-editor.module.css";

export function ProductImageUpload({ files, uploading, disabled, onSelect, onUpload, onCancel }: {
  files: File[]; uploading: boolean; disabled: boolean;
  onSelect: (files: File[]) => void; onUpload: () => void; onCancel: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [previews, setPreviews] = useState<Array<{ url: string; name: string }>>([]);
  useEffect(() => {
    const next = files.map(file => ({ url: URL.createObjectURL(file), name: file.name }));
    setPreviews(next);
    return () => next.forEach(item => URL.revokeObjectURL(item.url));
  }, [files]);
  return <>
    <input ref={input} id={id} className={styles.hidden} type="file" accept="image/*" multiple disabled={disabled || uploading} onChange={event => { const next = Array.from(event.target.files ?? []); if (next.length) onSelect(next); event.currentTarget.value = ""; }} />
    <div className={styles.upload}>
      <CmsButton type="button" variant="outline" disabled={disabled || uploading} aria-controls={id} onClick={() => input.current?.click()}><Upload size={15} aria-hidden="true" /> Chọn nhiều ảnh</CmsButton>
      {files.length ? <>
        <CmsButton type="button" disabled={disabled || uploading} onClick={onUpload}>{uploading ? <LoaderCircle className={styles.spin} size={15} aria-hidden="true" /> : null}{uploading ? "Đang tải…" : `Tải ${files.length} ảnh`}</CmsButton>
        <CmsButton type="button" variant="ghost" disabled={uploading || disabled} onClick={onCancel}><X size={15} aria-hidden="true" /> Hủy ảnh chờ</CmsButton>
      </> : null}
    </div>
    {previews.length ? <div className={styles.previews}>{previews.map((item, index) => <div key={item.url}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.url} alt={item.name} /><span>{files[index]?.name ?? item.name}</span>
    </div>)}</div> : null}
  </>;
}
