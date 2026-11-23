"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import type { CatalogCategory } from "@/landing/features/catalog/types";

import type { SearchQuery } from "../query";
import { SearchFilterPanel, type SearchFilterActions } from "./search-filter-panel";

type SearchFilterDrawerProps = SearchFilterActions & {
  categories: CatalogCategory[];
  query: SearchQuery;
};

export function SearchFilterDrawer({ categories, query, onChange, onReset }: SearchFilterDrawerProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateAndClose = (patch: Partial<SearchQuery>) => {
    setFiltersOpen(false);
    onChange(patch);
  };

  const resetAndClose = () => {
    setFiltersOpen(false);
    onReset();
  };

  return (
    <div className="mb-space-md flex justify-end lg:hidden">
      <Dialog.Root open={filtersOpen} onOpenChange={setFiltersOpen}>
        <Dialog.Trigger asChild>
          <button
            className="inline-flex min-h-11 items-center justify-end gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-2 font-label-ui text-label-ui text-primary shadow-sm"
            type="button"
          >
            <SlidersHorizontal className="size-5" aria-hidden="true" />
            Bộ lọc
            {(query.category || query.price !== "all") ? (
              <span className="rounded-full bg-secondary-container px-2 text-body-sm text-primary">Đang lọc</span>
            ) : null}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-[71] flex w-[min(90vw,370px)] flex-col bg-surface-container-lowest shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant px-space-lg py-space-md">
              <Dialog.Title className="font-headline-sm text-headline-sm text-primary">Bộ lọc sản phẩm</Dialog.Title>
              <Dialog.Close aria-label="Đóng bộ lọc" className="rounded-lg p-2 text-primary hover:bg-surface-container" type="button">
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">Chọn danh mục và khoảng giá để lọc sản phẩm.</Dialog.Description>
            <div className="min-h-0 flex-1 overflow-y-auto p-space-lg">
              <SearchFilterPanel
                categories={categories}
                query={query}
                onChange={updateAndClose}
                onReset={resetAndClose}
                radioPrefix="mobile"
                hideHeading
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
