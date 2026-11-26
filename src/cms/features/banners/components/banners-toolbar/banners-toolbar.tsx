"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";
import { Search } from "lucide-react";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import {
  BANNER_POSITION_OPTIONS,
  type BannerPosition,
} from "@/lib/banner/positions";
import type { BannerFilters } from "../../hooks/use-banner-filters";
import styles from "./banners-toolbar.module.css";
const activeOptions = [
  { value: "", label: "Trạng thái: Tất cả" },
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Đang tắt" },
];
export function BannersToolbar({ filters }: { filters: BannerFilters }) {
  const draft = useToolbarDraft({ search: filters.search, position: filters.position, isActive: filters.isActive });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "", position: undefined, isActive: undefined }); filters.clearFilters(); };
  const clearAdvanced = () => { const next = { search: filters.search, position: undefined, isActive: undefined }; draft.reset(next); filters.applyFilters(next); };
  return <CmsToolbar label="Bộ lọc banner" onSearch={apply} onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput aria-label="Tìm kiếm banner" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} placeholder="Tìm theo tiêu đề" type="search" value={draft.values.search} onChange={event => draft.set("search", event.target.value)} />}
    filters={<CmsFilterGroup layout="toolbar"
          activeCount={
            Number(Boolean(draft.values.position)) +
            Number(draft.values.isActive !== undefined)
          }
          label="Bộ lọc banner"
          onClear={clearAdvanced}
        >
          <CmsSelect
            aria-label="Lọc theo vị trí"
            containerClassName={styles.positionSelect}
            controlSize="sm"
            options={[
              { value: "", label: "Vị trí: Tất cả" },
              ...BANNER_POSITION_OPTIONS,
            ]}
            value={draft.values.position ?? ""}
            onChange={(event) =>
              draft.set("position", 
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
              draft.values.isActive === undefined ? "" : String(draft.values.isActive)
            }
            onChange={(event) =>
              draft.set("isActive", 
                event.target.value === "true"
                  ? true
                  : event.target.value === "false"
                    ? false
                    : undefined,
              )
            }
          />
        </CmsFilterGroup>}
    
  />;
}
