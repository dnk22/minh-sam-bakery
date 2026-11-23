"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { boundedPagination } from "../query";
import type { CatalogPage } from "../types";

export function CatalogPagination({ pagination, onPage }: { pagination: CatalogPage["pagination"]; onPage: (page: number) => void }) {
  if (pagination.totalPages <= 1) return pagination.total > 0 ? <div className="mt-space-xl text-center font-body-sm text-body-sm text-on-surface-variant">Trang 1 / 1</div> : null;
  const items = boundedPagination(pagination.page, pagination.totalPages);
  return <nav aria-label="Phân trang sản phẩm" className="mt-space-xl flex flex-col items-center gap-space-md pt-space-lg"><span className="font-body-sm text-body-sm text-on-surface-variant">Trang {pagination.page} / {pagination.totalPages}</span><div className="flex flex-wrap items-center justify-center gap-space-sm"><PageButton disabled={pagination.page === 1} label="Trang trước" onClick={() => onPage(pagination.page - 1)}><ChevronLeft className="size-[18px]" /></PageButton>{items.map((item) => typeof item === "number" ? <button aria-current={item === pagination.page ? "page" : undefined} className={`flex size-10 items-center justify-center rounded font-medium ${item === pagination.page ? "bg-primary text-secondary-fixed" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`} key={item} onClick={() => onPage(item)} type="button">{item}</button> : <span aria-hidden="true" className="px-1 text-outline" key={item}>…</span>)}<PageButton disabled={pagination.page === pagination.totalPages} label="Trang sau" onClick={() => onPage(pagination.page + 1)}><ChevronRight className="size-[18px]" /></PageButton></div></nav>;
}

function PageButton({ children, disabled, label, onClick }: { children: ReactNode; disabled: boolean; label: string; onClick: () => void }) {
  return <button aria-label={label} className={`flex size-10 items-center justify-center rounded ${disabled ? "cursor-not-allowed bg-surface-container-high text-outline" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"}`} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}
