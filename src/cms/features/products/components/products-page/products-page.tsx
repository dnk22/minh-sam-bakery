"use client";
import { useCallback, useState } from "react";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { useProductFilters } from "../../hooks/use-product-filters";
import { useProducts } from "../../hooks/use-products";
import type { Product, ProductModalState } from "../../types";
import { ProductModal } from "../product-modal/product-modal";
import { ProductsCollection } from "../products-collection/products-collection";
import { ProductsToolbar } from "../products-toolbar/products-toolbar";
import styles from "./products-page.module.css";

const PAGE_SIZE = 20;
export function ProductsPage() {
  const filters = useProductFilters();
  const [modal, setModal] = useState<ProductModalState>(null);
  const listQuery = useProducts({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined, status: filters.status, categoryId: filters.categoryId, isFeatured: filters.isFeatured, isBestSeller: filters.isBestSeller });
  const openDetail = useCallback((product: Product) => setModal({ mode: "detail", id: product.id }), []);
  return <CmsMain className={styles.main}><header className={styles.heading}><div><h1>Sản phẩm</h1><p>Tra cứu danh mục sản phẩm, giá, trạng thái và biến thể.</p></div></header><ProductsToolbar filters={filters} /><ProductsCollection filters={filters} listQuery={listQuery} onDetail={openDetail} /><ProductModal state={modal} onStateChange={setModal} /></CmsMain>;
}
