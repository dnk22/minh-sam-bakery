"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";

import { getProductStatusPresentation } from "../../constants";
import type { ProductFilters } from "../../hooks/use-product-filters";
import { formatVnd, sortProductImages } from "../../lib/product-format";
import type { Product, ProductList } from "../../types";
import { createProductColumns } from "../product-columns/product-columns";
import styles from "./products-collection.module.css";

export function ProductsCollection({ filters, listQuery, onDetail, onDelete }: { filters: ProductFilters; listQuery: UseQueryResult<ProductList, Error>; onDetail: (product: Product) => void; onDelete: (product: Product) => void }) {
  const columns = useMemo(() => createProductColumns(onDetail, onDelete), [onDelete, onDetail]);
  const list = listQuery.data;
  return <ResponsiveCollection<Product> className={styles.table} columns={columns} data={list?.items ?? []} emptyState="Chưa có sản phẩm nào." error={listQuery.error instanceof Error ? listQuery.error.message : undefined} filteredEmptyState="Không có sản phẩm phù hợp." getItemKey={(item) => item.id} getItemLabel={(item) => `Xem sản phẩm ${item.name}`} getRowId={(item) => item.id} isFiltered={filters.isFiltered} loading={listQuery.isLoading || (listQuery.isFetching && listQuery.isPlaceholderData)} onItemClick={onDetail} onRetry={() => listQuery.refetch()} pagination={list && !listQuery.isPlaceholderData ? { meta: list.pagination, onPageChange: filters.setPage } : undefined} renderAccessory={(item) => { const status = getProductStatusPresentation(item.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; }} renderItem={(item) => <ProductListItem product={item} />} />;
}

function ProductListItem({ product }: { product: Product }) {
  const image = sortProductImages(product.images)[0];
  return <div className={styles.item}>{image ? <Image src={cmsAssetUrl(image.url)} alt={image.alt || ""} width={48} height={48} unoptimized /> : <span className={styles.placeholder}><ImageIcon aria-hidden="true" /></span>}<div><strong>{product.name}</strong><span>{product.sku} · {product.categoryName}</span><b>{formatVnd(product.salePrice ?? product.price)}</b></div></div>;
}
