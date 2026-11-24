"use client";

import { ImageIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useProductImages } from "../../hooks/use-product-images";
import type { ProductFormValues } from "../../types";
import { ProductImageCard } from "./product-image-card";
import { ProductImageUpload } from "./product-image-upload";
import styles from "./product-image-editor.module.css";

export function ProductImageEditor({ form, disabled = false, onPendingChange }: { form: UseFormReturn<ProductFormValues>; disabled?: boolean; onPendingChange?: (pending: boolean) => void }) {
  const editor = useProductImages(form, onPendingChange);
  const locked = disabled || editor.uploading;
  return <div className={styles.root} data-upload-pending={editor.pending.length ? true : undefined} tabIndex={editor.pending.length ? -1 : undefined}>
    <ProductImageUpload files={editor.pending} uploading={editor.uploading} disabled={disabled} onSelect={editor.select} onUpload={editor.upload} onCancel={editor.cancel} />
    {editor.error ? <p className={styles.error} role="alert">{editor.error}</p> : null}
    {editor.images.length ? <div className={styles.gallery}>{editor.images.map((image, index) =>
      <ProductImageCard key={`${image.url}:${index}`} image={image} index={index} count={editor.images.length} disabled={locked} altError={form.formState.errors.images?.[index]?.alt?.message} onCover={() => editor.cover(index)} onAlt={alt => editor.update(index, { alt })} onMove={direction => editor.move(index, direction)} onRemove={() => editor.remove(index)} />
    )}</div> : <div className={styles.empty}><ImageIcon aria-hidden="true" /> Chưa có ảnh sản phẩm.</div>}
    <p className={styles.note}>Tối đa 20 ảnh. Tổng dung lượng mỗi lần tải tối đa 10 MB. Gỡ ảnh chỉ loại ảnh khỏi sản phẩm khi lưu, không xóa file trên hệ thống.</p>
  </div>;
}
