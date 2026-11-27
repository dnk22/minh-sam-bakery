"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { formatVnd } from "@/cms/lib/format-vnd";
import type { TopProduct } from "../../lib/dashboard-schema";
import styles from "./top-products-table.module.css";

const columns: ColumnDef<TopProduct, unknown>[] = [
  { id: "rank", header: "STT", size: 56, cell: ({ row }) => row.index + 1 },
  { accessorKey: "productName", header: "Sản phẩm" },
  { accessorKey: "productSku", header: "SKU" },
  { accessorKey: "quantity", header: "SL bán", cell: ({ row }) => row.original.quantity.toLocaleString("vi-VN") },
  { accessorKey: "revenue", header: "Doanh thu", cell: ({ row }) => formatVnd(row.original.revenue) },
];
export function TopProductsTable({ products }: { products: TopProduct[] }) {
  return <ResponsiveCollection data={products} columns={columns} getItemKey={(item, index) => item.productId + ":" + index} getRowId={(item, index) => item.productId + ":" + index}
    emptyState="Chưa có sản phẩm bán chạy trong khoảng thời gian này."
    renderItem={(item, index) => <div className={styles.item}><strong>{index + 1}. {item.productName}</strong><small>{item.productSku}</small><div><span>Số lượng: {item.quantity.toLocaleString("vi-VN")}</span><strong>{formatVnd(item.revenue)}</strong></div></div>} />;
}
