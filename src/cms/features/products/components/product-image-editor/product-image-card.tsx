import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import type { ProductImageInput } from "../../types";
import styles from "./product-image-editor.module.css";

export function ProductImageCard({ image, index, count, disabled, altError, onCover, onAlt, onMove, onRemove }: {
  image: ProductImageInput; index: number; count: number; disabled: boolean; altError?: string;
  onCover: () => void; onAlt: (value: string) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void;
}) {
  const coverId = `product-image-cover-${index}`;
  const altId = `product-image-alt-${index}`;
  return <article className={styles.card}>
    <Image src={cmsAssetUrl(image.url)} alt={image.alt || "Ảnh sản phẩm"} width={240} height={180} unoptimized />
    <div><input id={coverId} type="radio" name="product-cover" checked={image.isCover} disabled={disabled} onChange={onCover} /> <label htmlFor={coverId}>Ảnh bìa</label></div>
    <CmsFormField htmlFor={altId} label={`Mô tả ảnh ${index + 1}`} error={altError}><CmsInput id={altId} name={`images.${index}.alt`} value={image.alt ?? ""} disabled={disabled} onChange={event => onAlt(event.target.value)} /></CmsFormField>
    <div className={styles.actions}>
      <CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === 0} aria-label={`Đưa ảnh ${index + 1} lên`} onClick={() => onMove(-1)}><ArrowUp aria-hidden="true" /></CmsButton>
      <CmsButton type="button" size="sm" variant="ghost" disabled={disabled || index === count - 1} aria-label={`Đưa ảnh ${index + 1} xuống`} onClick={() => onMove(1)}><ArrowDown aria-hidden="true" /></CmsButton>
      <CmsButton type="button" size="sm" variant="ghost" disabled={disabled} aria-label={`Gỡ ảnh ${index + 1} khỏi sản phẩm`} onClick={onRemove}><Trash2 aria-hidden="true" /></CmsButton>
    </div>
  </article>;
}
