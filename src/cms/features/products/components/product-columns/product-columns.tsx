import type { ColumnDef } from "@tanstack/react-table";
import { ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";

import { CmsRowActions } from "@/cms/components/row-actions/row-actions";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";

import { getProductStatusPresentation } from "../../constants";
import { formatVnd, sortProductImages } from "../../lib/product-format";
import type { Product } from "../../types";
import styles from "./product-columns.module.css";

export function createProductColumns(onDetail: (product: Product) => void, onDelete: (product: Product) => void): ColumnDef<Product, unknown>[] {
  return [
    { id: "product", header: "Sản phẩm", size: 250, cell: ({ row }) => { const product = row.original; const image = sortProductImages(product.images)[0]; return <div className={styles.product}>{image ? <Image src={cmsAssetUrl(image.url)} alt={image.alt || ""} width={44} height={44} unoptimized /> : <span className={styles.placeholder}><ImageIcon aria-hidden="true" /></span>}<div><strong title={product.name}>{product.name}</strong><span title={product.slug}>{product.slug}</span></div></div>; } },
    { accessorKey: "sku", header: "SKU", size: 120, cell: ({ row }) => <code className={styles.truncated} title={row.original.sku}>{row.original.sku}</code> },
    { accessorKey: "categoryName", header: "Danh mục", size: 150, cell: ({ row }) => <span className={styles.truncated} title={row.original.categoryName}>{row.original.categoryName}</span> },
    { id: "price", header: "Giá", size: 145, cell: ({ row }) => <div className={styles.price}>{row.original.salePrice ? <><strong>{formatVnd(row.original.salePrice)}</strong><del>{formatVnd(row.original.price)}</del></> : <strong>{formatVnd(row.original.price)}</strong>}</div> },
    { accessorKey: "status", header: "Trạng thái", size: 115, cell: ({ row }) => { const status = getProductStatusPresentation(row.original.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; } },
    { id: "flags", header: "Nhãn", size: 120, cell: ({ row }) => <div className={styles.flags}>{row.original.isFeatured ? <CmsBadge variant="secondary">Nổi bật</CmsBadge> : null}{row.original.isBestSeller ? <CmsBadge variant="warning">Bán chạy</CmsBadge> : null}{!row.original.isFeatured && !row.original.isBestSeller ? <span>—</span> : null}</div> },
    { id: "actions", header: "Thao tác", size: 82, cell: ({ row }) => <CmsRowActions actions={[{ key: "delete", label: "Xóa sản phẩm", icon: <Trash2 aria-hidden="true" size={15} />, destructive: true, onSelect: () => onDelete(row.original) }]} moreLabel={`Mở thao tác cho ${row.original.name}`} onView={() => onDetail(row.original)} viewLabel={`Xem chi tiết ${row.original.name}`} /> },
  ];
}
