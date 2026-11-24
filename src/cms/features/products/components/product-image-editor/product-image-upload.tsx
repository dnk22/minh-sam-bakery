"use client";

import { LoaderCircle, Upload, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { CmsButton } from "@/cms/components/ui/button";
import styles from "./product-image-editor.module.css";

export function ProductImageUpload({ files, uploading, disabled, onSelect, onUpload, onCancel }: {
  files: File[]; uploading: boolean; disabled: boolean;
  onSelect: (files: File[]) => void; onUpload: () => void; onCancel: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  return <>
    <input ref={input} id={id} className={styles.hidden} type="file" accept="image/*" multiple disabled={disabled || uploading} onChange={event => { const next = Array.from(event.target.files ?? []); if (next.length) onSelect(next); event.currentTarget.value = ""; }} />
    <div className={styles.upload}>
      <CmsButton type="button" variant="outline" disabled={disabled || uploading} aria-controls={id} onClick={() => input.current?.click()}><Upload size={15} aria-hidden="true" /> Chọn nhiều ảnh</CmsButton>
      {files.length ? <>
        <CmsButton type="button" disabled={disabled || uploading} onClick={onUpload}>{uploading ? <LoaderCircle className={styles.spin} size={15} aria-hidden="true" /> : null}{uploading ? "Đang tải…" : `Tải ${files.length} ảnh`}</CmsButton>
        <CmsButton type="button" variant="ghost" disabled={uploading || disabled} onClick={onCancel}><X size={15} aria-hidden="true" /> Hủy ảnh chờ</CmsButton>
      </> : null}
    </div>
    {files.length ? <div className={styles.previews}>{files.map((file, index) => <PendingImagePreview key={`${file.name}:${file.lastModified}:${index}`} file={file} />)}</div> : null}
  </>;
}

function PendingImagePreview({ file }: { file: File }) {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const element = image.current;
    if (!element) return;
    const url = URL.createObjectURL(file);
    element.src = url;
    return () => { element.removeAttribute("src"); URL.revokeObjectURL(url); };
  }, [file]);
  return <div>
    {/* eslint-disable-next-line @next/next/no-img-element -- local object URL attached and released by the effect */}
    <img ref={image} alt={file.name} /><span>{file.name}</span>
  </div>;
}
