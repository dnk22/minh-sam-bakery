"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  FolderPlus,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TreePine,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DataTable } from "@/cms/components/data-table/data-table";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsButton } from "@/cms/components/ui/button";
import {
  CmsDropdown,
  CmsDropdownContent,
  CmsDropdownItem,
  CmsDropdownSeparator,
  CmsDropdownTrigger,
} from "@/cms/components/ui/dropdown-menu";
import { useCmsIsMobile } from "@/cms/hooks/use-mobile";

import { filterCategoryForest } from "../lib/category-tree";
import { useCategories, useCategoryTree } from "../hooks/use-categories";
import type { Category, CategoryStatus, CategoryTreeNode } from "../types";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryModal, type CategoryModalState } from "./category-modal";
import styles from "./categories.module.css";

const PAGE_SIZE = 20;

export function CategoriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useCmsIsMobile();
  const view = searchParams.get("view") === "tree" ? "tree" : "flat";
  const pageValue = Number(searchParams.get("page") ?? 1);
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const rawStatus = searchParams.get("status");
  const status: CategoryStatus | undefined =
    rawStatus === "VISIBLE" || rawStatus === "HIDDEN" ? rawStatus : undefined;
  const search = searchParams.get("search")?.trim() ?? "";
  const [modal, setModal] = useState<CategoryModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const listQuery = useCategories({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status,
  });
  const treeQuery = useCategoryTree(true);

  const updateUrl = useCallback(
    (values: Record<string, string | null>, resetPage = false) => {
      const query = new URLSearchParams(searchParams.toString());
      Object.entries(values).forEach(([key, value]) =>
        value ? query.set(key, value) : query.delete(key),
      );
      if (resetPage) query.delete("page");
      const next = query.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );
  const commitSearch = useCallback(
    (value: string) => updateUrl({ search: value || null }, true),
    [updateUrl],
  );

  const parentNames = treeQuery.data?.tree?.byId;
  const openDetail = useCallback(
    (category: Category) => setModal({ mode: "detail", id: category.id }),
    [],
  );
  const columnActions = useMemo(
    () => ({
      onDetail: openDetail,
      onChild: (category: Category) =>
        setModal({ mode: "create", parentId: category.id }),
      onDelete: setDeleteTarget,
    }),
    [openDetail],
  );
  const columns = useMemo(
    () => categoryColumns<Category>(parentNames, columnActions),
    [columnActions, parentNames],
  );
  const treeColumns = useMemo(
    () => categoryColumns<CategoryTreeNode>(parentNames, columnActions),
    [columnActions, parentNames],
  );

  const treeRows = useMemo(
    () =>
      treeQuery.data?.tree
        ? filterCategoryForest(treeQuery.data.tree.forest, search, status)
        : [],
    [search, status, treeQuery.data],
  );
  const list = listQuery.data;
  const pagination = list
    ? {
        meta: list.pagination,
        onPageChange: (next: number) =>
          updateUrl({ page: next === 1 ? null : String(next) }),
      }
    : undefined;
  const listItems = list?.items ?? [];
  const filtered = Boolean(search || status);
  const errorMessage =
    listQuery.error instanceof Error ? listQuery.error.message : undefined;

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
        <CmsButton type="button" onClick={() => setModal({ mode: "create" })}>
          <Plus aria-hidden="true" size={17} /> Thêm danh mục
        </CmsButton>
      </header>
      <section className={styles.toolbar} aria-label="Bộ lọc danh mục">
        <div className={styles.toolbarFilters}>
          <CategorySearch key={search} value={search} onCommit={commitSearch} />
          <label className={styles.filter}>
            <span>Trạng thái</span>
            <select
              value={status ?? ""}
              onChange={(event) =>
                updateUrl({ status: event.target.value || null }, true)
              }
            >
              <option value="">Tất cả</option>
              <option value="VISIBLE">Hiển thị</option>
              <option value="HIDDEN">Ẩn</option>
            </select>
          </label>
          {filtered ? (
            <CmsButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => updateUrl({ search: null, status: null }, true)}
            >
              <X aria-hidden="true" size={15} /> Xóa bộ lọc
            </CmsButton>
          ) : null}
        </div>
        <div className={styles.toolbarView}>
          <div className={styles.viewSwitch} aria-label="Kiểu hiển thị">
            <CmsButton
              type="button"
              size="sm"
              variant={view === "flat" ? "secondary" : "ghost"}
              onClick={() => updateUrl({ view: null }, true)}
            >
              <List aria-hidden="true" size={16} /> Dạng phẳng
            </CmsButton>
            <CmsButton
              type="button"
              size="sm"
              variant={view === "tree" ? "secondary" : "ghost"}
              onClick={() => updateUrl({ view: "tree" }, true)}
            >
              <TreePine aria-hidden="true" size={16} /> Dạng cây
            </CmsButton>
          </div>
        </div>
      </section>

      {view === "tree" && !isMobile ? (
        treeQuery.isLoading ? (
          <div className={styles.state}>
            Đang tải toàn bộ cấu trúc danh mục…
          </div>
        ) : treeQuery.error || !treeQuery.data?.tree ? (
          <div className={styles.treeError} role="alert">
            <p>
              {treeQuery.data?.reason ??
                "Không thể xác minh dữ liệu cây đầy đủ."}
            </p>
            <CmsButton
              type="button"
              variant="outline"
              onClick={() => updateUrl({ view: null }, true)}
            >
              Chuyển sang dạng phẳng
            </CmsButton>
          </div>
        ) : (
          <DataTable<CategoryTreeNode>
            className={styles.categoryTable}
            data={treeRows}
            columns={treeColumns}
            getRowId={(row) => row.id}
            getSubRows={(row) => row.children}
            onRowClick={openDetail}
            getRowLabel={(row) => `Xem danh mục ${row.name}`}
            isFiltered={filtered}
            filteredEmptyState="Không có danh mục phù hợp trong cây."
          />
        )
      ) : (
        <ResponsiveCollection<Category>
          data={listItems}
          columns={columns}
          getItemKey={(item) => item.id}
          getRowId={(item) => item.id}
          renderItem={(item) => (
            <CategoryListItem
              category={item}
              parentName={
                item.parentId
                  ? parentNames?.get(item.parentId)?.name
                  : undefined
              }
            />
          )}
          renderAccessory={(item) => <StatusBadge status={item.status} />}
          onItemClick={openDetail}
          getItemLabel={(item) => `Xem danh mục ${item.name}`}
          pagination={pagination}
          loading={listQuery.isLoading}
          error={errorMessage}
          onRetry={() => listQuery.refetch()}
          isFiltered={filtered}
          className={styles.categoryTable}
          emptyState="Chưa có danh mục nào."
          filteredEmptyState="Không có danh mục phù hợp."
        />
      )}
      <CategoryModal
        state={modal}
        onStateChange={setModal}
        onDelete={(category) => setDeleteTarget(category)}
      />
      <CategoryDeleteDialog
        category={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => {
          setDeleteTarget(null);
          setModal(null);
          if (listItems.length === 1 && page > 1)
            updateUrl({ page: String(page - 1) });
        }}
      />
    </CmsMain>
  );
}

function CategorySearch({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [input, setInput] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalized = input.trim();
      if (normalized !== value) onCommit(normalized);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [input, onCommit, value]);
  return (
    <label className={styles.search}>
      <Search aria-hidden="true" size={17} />
      <span className={styles.srOnly}>Tìm kiếm</span>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Tìm theo tên hoặc slug"
      />
    </label>
  );
}

function StatusBadge({ status }: { status: CategoryStatus }) {
  return (
    <span className={status === "VISIBLE" ? styles.visible : styles.hidden}>
      {status === "VISIBLE" ? "Hiển thị" : "Ẩn"}
    </span>
  );
}

function categoryColumns<T extends Category>(
  parentNames: Map<string, CategoryTreeNode> | undefined,
  actions: {
    onDetail: (category: Category) => void;
    onChild: (category: Category) => void;
    onDelete: (category: Category) => void;
  },
): ColumnDef<T, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Danh mục",
      size: 180,
      cell: ({ row }) => (
        <div className={styles.nameCell} title={row.original.name}>
          <strong>{row.original.name}</strong>
          {"contextOnly" in row.original && row.original.contextOnly ? (
            <small className={styles.context}>Ngữ cảnh</small>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      size: 165,
      cell: ({ row }) => (
        <span className={styles.truncatedCell} title={row.original.slug}>
          {row.original.slug}
        </span>
      ),
    },
    {
      id: "parent",
      header: "Danh mục cha",
      size: 158,
      cell: ({ row }) => {
        const parent = row.original.parentId
          ? (parentNames?.get(row.original.parentId)?.name ?? "Không xác định")
          : "Danh mục gốc";
        return (
          <span className={styles.truncatedCell} title={parent}>
            {parent}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      size: 86,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "sortOrder", header: "Thứ tự", size: 60 },
    {
      id: "actions",
      header: "Thao tác",
      size: 82,
      cell: ({ row }) => <RowActions category={row.original} {...actions} />,
    },
  ];
}

function CategoryListItem({
  category,
  parentName,
}: {
  category: Category;
  parentName?: string;
}) {
  return (
    <div className={styles.listItem}>
      <div className={styles.listIcon}>
        <FolderPlus aria-hidden="true" />
      </div>
      <div>
        <strong>{category.name}</strong>
        <span>
          {parentName ??
            (category.parentId ? "Không xác định" : "Danh mục gốc")}{" "}
          · Thứ tự {category.sortOrder}
        </span>
      </div>
    </div>
  );
}

function RowActions({
  category,
  onDetail,
  onChild,
  onDelete,
}: {
  category: Category;
  onDetail: (category: Category) => void;
  onChild: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  const action =
    (callback: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      callback();
    };
  return (
    <div className={styles.rowActions}>
      <button
        className={styles.viewAction}
        type="button"
        aria-label={`Xem chi tiết ${category.name}`}
        title="Xem chi tiết"
        onClick={action(() => onDetail(category))}
      >
        <Eye aria-hidden="true" />
      </button>
      <CmsDropdown>
        <CmsDropdownTrigger asChild>
          <button
            className={styles.moreAction}
            type="button"
            aria-label={`Mở thao tác cho ${category.name}`}
            title="Thao tác khác"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal aria-hidden="true" />
          </button>
        </CmsDropdownTrigger>
        <CmsDropdownContent align="end" className={styles.actionMenu}>
          <CmsDropdownItem onSelect={() => onChild(category)}>
            <Plus aria-hidden="true" size={15} /> Thêm danh mục con
          </CmsDropdownItem>
          <CmsDropdownSeparator />
          <CmsDropdownItem
            className={styles.deleteMenuItem}
            onSelect={() => onDelete(category)}
          >
            <Trash2 aria-hidden="true" size={15} /> Xóa danh mục
          </CmsDropdownItem>
        </CmsDropdownContent>
      </CmsDropdown>
    </div>
  );
}
