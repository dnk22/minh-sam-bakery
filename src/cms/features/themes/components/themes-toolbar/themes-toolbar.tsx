"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";

import { Search } from "lucide-react";

import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { THEME_STATUS_OPTIONS } from "../../constants";
import type { ThemeFilters } from "../../hooks/use-theme-filters";
import styles from "./themes-toolbar.module.css";

export function ThemesToolbar({ filters }: { filters: ThemeFilters }) {
  const draft = useToolbarDraft({ search: filters.search, isActive: filters.isActive });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "", isActive: undefined }); filters.clear(); };
  const clearAdvanced = () => { const next = { search: filters.search, isActive: undefined }; draft.reset(next); filters.applyFilters(next); };
  return <CmsToolbar label="Bộ lọc giao diện website" onSearch={apply} onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput
        aria-label="Tìm theo tên hoặc mã theme"
        
        controlSize="sm"
        leadingIcon={<Search aria-hidden="true" size={17} />}
    filters={<CmsFilterGroup layout="toolbar"
        activeCount={Number(draft.values.isActive !== undefined)}
        label="Bộ lọc giao diện website"
        onClear={clearAdvanced}
      >
        <CmsSelect
          aria-label="Lọc theo trạng thái theme"
          containerClassName={styles.status}
          controlSize="sm"
          options={THEME_STATUS_OPTIONS}
          value={draft.values.isActive === undefined ? "" : String(draft.values.isActive)}
          onValueChange={(value) => draft.set("isActive", value === "" ? undefined : value === "true")}
        />
      </CmsFilterGroup>}
    
  />;
}
