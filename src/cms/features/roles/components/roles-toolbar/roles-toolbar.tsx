"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";

import { Search } from "lucide-react";

import { CmsInput } from "@/cms/components/ui/input/input";

import type { RoleFilters } from "../../hooks/use-role-filters";

export function RolesToolbar({ filters }: { filters: RoleFilters }) {
  const draft = useToolbarDraft({ search: filters.search });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "" }); filters.clearFilters(); };
  
  return <CmsToolbar label="Bộ lọc vai trò" onSearch={apply} onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput
        aria-label="Tìm kiếm vai trò"
        
        controlSize="sm"
        leadingIcon={<Search aria-hidden="true" size={17} />}
    
    
  />;
}
