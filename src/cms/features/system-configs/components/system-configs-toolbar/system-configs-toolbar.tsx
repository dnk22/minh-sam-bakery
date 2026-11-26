"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";

import { Search } from "lucide-react";

import { CmsInput } from "@/cms/components/ui/input/input";

import type { SystemConfigFilters } from "../../hooks/use-system-config-filters";

export function SystemConfigsToolbar({ filters }: { filters: SystemConfigFilters }) {
  const draft = useToolbarDraft({ search: filters.search });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "" }); filters.clearFilters(); };
  
  return <CmsToolbar label="Bộ lọc cấu hình hệ thống" onSearch={apply} onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput aria-label="Tìm kiếm cấu hình" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} placeholder="Tìm theo khóa hoặc mô tả" type="search" value={draft.values.search} onChange={event => draft.set("search", event.target.value)} />}
    
    
  />;
}
