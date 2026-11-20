import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { getProductStatusPresentation } from "../../constants";
import { formatVnd, sortProductImages, sortProductVariants } from "../../lib/product-format";
import type { Product } from "../../types";
import styles from "./product-detail.module.css";

export function ProductDetail({ product }: { product: Product }) {
  const status = getProductStatusPresentation(product.status);
  const images = sortProductImages(product.images);
  const variants = sortProductVariants(product.variants);
  return <div className={styles.detail}>
    <div className={styles.badges}><CmsBadge variant={status.variant}>{status.label}</CmsBadge>{product.isFeatured ? <CmsBadge variant="secondary">Nổi bật</CmsBadge> : null}{product.isBestSeller ? <CmsBadge variant="warning">Bán chạy</CmsBadge> : null}</div>
    <section className={styles.section} aria-labelledby="product-information"><h3 id="product-information">Thông tin sản phẩm</h3><dl className={styles.fields}><Entry label="Tên" value={product.name} /><Entry label="SKU" value={product.sku} mono /><Entry label="Slug" value={product.slug} mono /><Entry label="Danh mục" value={`${product.categoryName} (${product.categorySlug})`} /><Entry label="Giá niêm yết" value={formatVnd(product.price)} /><Entry label="Giá khuyến mại" value={product.salePrice ? formatVnd(product.salePrice) : "Không có"} /><Entry label="Ngày tạo" value={formatDate(product.createdAt)} /><Entry label="Cập nhật" value={formatDate(product.updatedAt)} /></dl></section>
    <TextSection title="Mô tả ngắn" value={product.shortDescription} /><TextSection title="Mô tả đầy đủ" value={product.description} />
    <section className={styles.section} aria-labelledby="product-seo"><h3 id="product-seo">SEO</h3><dl className={styles.fields}><Entry label="Tiêu đề SEO" value={product.seoTitle || "Chưa thiết lập"} /><Entry label="Mô tả SEO" value={product.seoDescription || "Chưa thiết lập"} /></dl></section>
    <section className={styles.section} aria-labelledby="product-images"><h3 id="product-images">Hình ảnh ({images.length})</h3>{images.length ? <div className={styles.gallery}>{images.map((image) => <figure key={image.id}><Image src={image.url} alt={image.alt || product.name} width={320} height={320} unoptimized /><figcaption>{image.isCover ? "Ảnh bìa · " : ""}Thứ tự {image.sortOrder}{image.alt ? ` · ${image.alt}` : ""}</figcaption></figure>)}</div> : <div className={styles.empty}><ImageIcon aria-hidden="true" /> Sản phẩm chưa có hình ảnh.</div>}</section>
    <section className={styles.section} aria-labelledby="product-variants"><h3 id="product-variants">Biến thể ({variants.length})</h3>{variants.length ? <div className={styles.variantScroller}><table className={styles.variants}><thead><tr><th>SKU</th><th>Kích thước</th><th>Kiểu</th><th>Giá</th><th>Trạng thái</th><th>Thứ tự</th></tr></thead><tbody>{variants.map((variant) => <tr key={variant.id}><td><code>{variant.sku}</code></td><td>{variant.size}</td><td>{variant.style}</td><td><span className={styles.variantPrice}>{variant.salePrice ? <><strong>{formatVnd(variant.salePrice)}</strong><del>{formatVnd(variant.price)}</del></> : formatVnd(variant.price)}</span></td><td><CmsBadge variant={variant.status === "ACTIVE" ? "success" : "secondary"}>{variant.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}</CmsBadge></td><td>{variant.sortOrder}</td></tr>)}</tbody></table></div> : <p className={styles.empty}>Sản phẩm chưa có biến thể.</p>}</section>
  </div>;
}

function Entry({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) { return <div><dt>{label}</dt><dd className={mono ? styles.mono : undefined}>{value}</dd></div>; }
function TextSection({ title, value }: { title: string; value?: string | null }) { return <section className={styles.section}><h3>{title}</h3><p className={styles.copy}>{value || "Chưa có nội dung."}</p></section>; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date); }
