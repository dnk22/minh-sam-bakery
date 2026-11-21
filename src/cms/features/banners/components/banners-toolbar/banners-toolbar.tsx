"use client";
import { Search, X } from "lucide-react";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import {
  BANNER_POSITION_OPTIONS,
  type BannerPosition,
} from "@/lib/banner/positions";
import type { BannerFilters } from "../../hooks/use-banner-filters";
import { useBannerSearch } from "../../hooks/use-banner-search";
import styles from "./banners-toolbar.module.css";
const activeOptions = [
  { value: "", label: "Trạng thái: Tất cả" },
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Đang tắt" },
];
export function BannersToolbar({ filters }: { filters: BannerFilters }) {
  const search = useBannerSearch({
    value: filters.search,
    onCommit: filters.setSearch,
  });
  return (
    <section className={styles.toolbar} aria-label="Bộ lọc banner">
      <div className={styles.controls}>
        <CmsInput
          aria-label="Tìm kiếm banner"
          containerClassName={styles.search}
          controlSize="sm"
          leadingIcon={<Search aria-hidden="true" size={17} />}
          type="search"
          placeholder="Tìm theo tiêu đề"
          value={search.draft}
          onBlur={search.onBlur}
          onFocus={search.onFocus}
          onChange={(event) => search.onChange(event.target.value)}
        />
        <CmsFilterGroup
          activeCount={
            Number(Boolean(filters.position)) +
            Number(filters.isActive !== undefined)
          }
          label="Bộ lọc banner"
          onClear={filters.clearAdvancedFilters}
        >
          <CmsSelect
            aria-label="Lọc theo vị trí"
            containerClassName={styles.positionSelect}
            controlSize="sm"
            options={[
              { value: "", label: "Vị trí: Tất cả" },
              ...BANNER_POSITION_OPTIONS,
            ]}
            value={filters.position ?? ""}
            onChange={(event) =>
              filters.setPosition(
                (event.target.value || undefined) as BannerPosition | undefined,
              )
            }
          />
          <CmsSelect
            aria-label="Lọc theo trạng thái"
            containerClassName={styles.statusSelect}
            controlSize="sm"
            options={activeOptions}
            value={
              filters.isActive === undefined ? "" : String(filters.isActive)
            }
            onChange={(event) =>
              filters.setActive(
                event.target.value === "true"
                  ? true
                  : event.target.value === "false"
                    ? false
                    : undefined,
              )
            }
          />
        </CmsFilterGroup>
        {filters.isFiltered ? (
          <CmsButton
            className={styles.clearAll}
            type="button"
            size="sm"
            variant="ghost"
            onClick={filters.clearFilters}
          >
            <X aria-hidden="true" size={15} /> Xóa tất cả
          </CmsButton>
        ) : null}
      </div>
    </section>
  );
}
