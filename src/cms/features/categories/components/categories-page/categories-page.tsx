"use client";

import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";

import { useCategories, useCategoryTree } from "../../hooks/use-categories";
import { useCategoryFilters } from "../../hooks/use-category-filters";
import type { Category, CategoryModalState } from "../../types";
import { CategoriesCollection } from "../categories-collection/categories-collection";
import { CategoriesToolbar } from "../categories-toolbar/categories-toolbar";
import { CategoryDeleteDialog } from "../category-delete-dialog/category-delete-dialog";
import { CategoryModal } from "../category-modal/category-modal";
import styles from "./categories-page.module.css";

const PAGE_SIZE = 20;

export function CategoriesPage() {
  const filters = useCategoryFilters();
  const [modal, setModal] = useState<CategoryModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const listQuery = useCategories({
    page: filters.page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status,
  });
  const listItems = listQuery.data?.items ?? [];
  const needsParentLookup =
    listQuery.data?.items.some((category) => Boolean(category.parentId)) ?? false;

  // The complete tree is the only current source for accurate parent names.
  // Skip it for flat pages containing only root categories; the modal loads its
  // own tree subscription when opened.
  const treeQuery = useCategoryTree(
    filters.view === "tree" || needsParentLookup,
  );

  const openDetail = useCallback(
    (category: Category) => setModal({ mode: "detail", id: category.id }),
    [],
  );
  const addChild = useCallback(
    (category: Category) =>
      setModal({ mode: "create", parentId: category.id }),
    [],
  );

  return (
    <CmsMain className={styles.main}>
      <header className={styles.heading}>
        <div>
          <h1>Danh mục</h1>
          <p>
            Quản lý cấu trúc, trạng thái hiển thị và thông tin SEO của danh mục
            bánh.
          </p>
        </div>
        <CmsButton className="cms-page-header-action" type="button" onClick={() => setModal({ mode: "create" })}>
          <Plus aria-hidden="true" size={17} /> Thêm danh mục
        </CmsButton>
      </header>
      <CategoriesToolbar filters={filters} />
      <CategoriesCollection
        filters={filters}
        listQuery={listQuery}
        treeQuery={treeQuery}
        onDetail={openDetail}
        onAddChild={addChild}
        onDelete={setDeleteTarget}
      />
      <CategoryModal
        state={modal}
        onStateChange={setModal}
        onDelete={setDeleteTarget}
      />
      <CategoryDeleteDialog
        category={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          setDeleteTarget(null);
          setModal(null);
          if (listItems.length === 1 && filters.page > 1) {
            filters.setPage(filters.page - 1);
          }
        }}
      />
    </CmsMain>
  );
}
