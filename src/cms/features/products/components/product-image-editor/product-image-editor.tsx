"use client";

import { ArrowDown, ArrowUp, ImageIcon, LoaderCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { uploadCmsImages } from "@/cms/lib/api/uploads.client";
import { validateImageUploadBatch } from "@/cms/lib/api/upload-validation";
import type { ProductFormValues } from "../../types";
import styles from "./product-image-editor.module.css";

export function ProductImageEditor({ form, disabled = false, onPendingChange }: { form: UseFormReturn<ProductFormValues>; disabled?: boolean; onPendingChange?: (pending: boolean) => void }) {
  const images = form.watch("images");
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const select = (files: File[]) => { const issue = validateImageUploadBatch(files); setError(issue); setPending(issue ? [] : files); onPendingChange?.(!issue && files.length > 0); };
  const upload = async () => {
    if (!pending.length || uploading) return;
    setUploading(true); setError(null);
    try {
      const urls = await uploadCmsImages(pending, "products");
      const next = [...images, ...urls.map((url, index) => ({ url, alt: "", sortOrder: images.length + index, isCover: images.length === 0 && index === 0 }))];
      form.setValue("images", next, { shouldDirty: true, shouldValidate: true }); setPending([]); onPendingChange?.(false);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Không thể tải ảnh lên."); }
    finally { setUploading(false); }
  };
  const update = (index: number, patch: Partial<ProductFormValues["images"][number]>) => form.setValue("images", images.map((image, itemIndex) => itemIndex === index ? { ...image, ...patch } : image), { shouldDirty: true, shouldValidate: true });
  const move = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= images.length) return; const next = [...images]; [next[index], next[target]] = [next[target], next[index]]; form.setValue("images", next.map((image, order) => ({ ...image, sortOrder: order })), { shouldDirty: true }); };
  const remove = (index: number) => { const next = images.filter((_, itemIndex) => itemIndex !== index); if (next.length && !next.some((image) => image.isCover)) next[0] = { ...next[0], isCover: true }; form.setValue("images", next.map((image, order) => ({ ...image, sortOrder: order })), { shouldDirty: true, shouldValidate: true }); };
  return <div className={styles.root}>
    {disabled ? <p className={styles.notice}>Chỉnh sửa collection ảnh đang khóa an toàn vì Backend chưa xác nhận PATCH mảng là replace hay merge. Các ảnh hiện có được bảo toàn.</p> : <><input ref={input} className={styles.hidden} type="file" accept="image/*" multiple onChange={(event) => select(Array.from(event.target.files ?? []))} /><div className={styles.upload}><CmsButton type="button" variant="outline" onClick={() => input.current?.click()} disabled={uploading}><Upload aria-hidden="true" size={15} /> Chọn nhiều ảnh</CmsButton>{pending.length ? <CmsButton type="button" onClick={upload} disabled={uploading}>{uploading ? <LoaderCircle className={styles.spin} aria-hidden="true" size={15} /> : null}{uploading ? "Đang tải…" : `Tải ${pending.length} ảnh`}</CmsButton> : null}</div></>}
    {error ? <p className={styles.error} role="alert">{error}</p> : null}
    {images.length ? <div className={styles.gallery}>{images.map((image, index) => <article key={`${image.url}:${index}`} className={styles.card}><Image src={image.url} alt={image.alt || "Ảnh sản phẩm"} width={240} height={180} unoptimized /><label><input type="radio" name="product-cover" checked={image.isCover} disabled={disabled} onChange={() => form.setValue("images", images.map((item, itemIndex) => ({ ...item, isCover: itemIndex === index })), { shouldDirty: true, shouldValidate: true })} /> Ảnh bìa</label><CmsInput aria-label={`Mô tả ảnh ${index + 1}`} placeholder="Alt ảnh" value={image.alt ?? ""} disabled={disabled} onChange={(event) => update(index, { alt: event.target.value })} /><div className={styles.actions}><CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === 0} aria-label="Đưa ảnh lên" onClick={() => move(index, -1)}><ArrowUp aria-hidden="true" /></CmsButton><CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === images.length - 1} aria-label="Đưa ảnh xuống" onClick={() => move(index, 1)}><ArrowDown aria-hidden="true" /></CmsButton><CmsButton type="button" size="sm" variant="ghost" disabled={disabled} aria-label="Gỡ ảnh khỏi sản phẩm" onClick={() => remove(index)}><Trash2 aria-hidden="true" /></CmsButton></div></article>)}</div> : <div className={styles.empty}><ImageIcon aria-hidden="true" /> Chưa có ảnh sản phẩm.</div>}
    {!disabled ? <p className={styles.note}>Tổng dung lượng mỗi lần tải tối đa 10 MB. Gỡ ảnh chỉ loại khỏi form; Backend chưa có API xóa file media.</p> : null}
  </div>;
}
