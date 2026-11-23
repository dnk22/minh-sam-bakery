"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { useProductFilters } from "../../hooks/use-product-filters";
import { useProducts } from "../../hooks/use-products";
import type { Product, ProductModalState } from "../../types";
import { ProductDeleteDialog } from "../product-delete-dialog/product-delete-dialog";
import { ProductModal } from "../product-modal/product-modal";
import { ProductsCollection } from "../products-collection/products-collection";
import { ProductsToolbar } from "../products-toolbar/products-toolbar";
import styles from "./products-page.module.css";

const PAGE_SIZE = 20;

export function ProductsPage() {
  const filters = useProductFilters();
  const [modal, setModal] = useState<ProductModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const listQuery = useProducts({
    page: filters.page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status,
    categoryId: filters.categoryId,
    isFeatured: filters.isFeatured,
    isBestSeller: filters.isBestSeller,
  });
  const openDetail = useCallback((product: Product) => setModal({ mode: "detail", id: product.id }), []);
  const deleted = () => {
    setDeleteTarget(null);
    setModal(null);
    if ((listQuery.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1);
  };

  return (
    <CmsMain className={styles.main}>
      <header className={styles.heading}>
        <div><h1>Sản phẩm</h1><p>Quản lý sản phẩm, giá, hình ảnh và biến thể.</p></div>
        <CmsButton className="cms-page-header-action" type="button" onClick={() => setModal({ mode: "create" })}><Plus aria-hidden="true" size={17} /> Thêm sản phẩm</CmsButton>
      </header>
      <ProductsToolbar filters={filters} />
      <ProductsCollection filters={filters} listQuery={listQuery} onDetail={openDetail} onDelete={setDeleteTarget} />
      <ProductModal state={modal} onStateChange={setModal} onDelete={setDeleteTarget} />
      <ProductDeleteDialog product={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={deleted} />
    </CmsMain>
  );
}
