"use client";
import { CmsToolbar } from "@/cms/components/toolbar/cms-toolbar";
import { useToolbarDraft } from "@/cms/hooks/use-toolbar-draft";
import { Search } from "lucide-react";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { POST_LANDING_OPTIONS, POST_STATUS_OPTIONS } from "../../constants";
import type { PostFilters } from "../../hooks/use-post-filters";
import { countPostAdvancedFilters, parsePostBoolean } from "../../lib/post-data";
import type { PostStatus } from "../../types";
import styles from "./posts-toolbar.module.css";
export function PostsToolbar({ filters }: { filters: PostFilters }) {
  const draft = useToolbarDraft({ search: filters.search, status: filters.status, showOnLanding: filters.showOnLanding });
  const apply = () => filters.applyFilters(draft.values);
  const clearAll = () => { draft.reset({ search: "", status: undefined, showOnLanding: undefined }); filters.clearFilters(); };
  const clearAdvanced = () => { const next = { search: filters.search, status: undefined, showOnLanding: undefined }; draft.reset(next); filters.applyFilters(next); }; const count = countPostAdvancedFilters(draft.values);
  return <CmsToolbar label="Bộ lọc bài viết" onSearch={apply} onClear={filters.isFiltered || draft.changed ? clearAll : undefined}
    search={<CmsInput aria-label="Tìm kiếm bài viết" controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} placeholder="Tìm theo tiêu đề" type="search" value={draft.values.search} onChange={event => draft.set("search", event.target.value)} />}
    filters={<CmsFilterGroup layout="toolbar" activeCount={count} label="Bộ lọc bài viết" onClear={clearAdvanced}>
      <CmsSelect aria-label="Lọc theo trạng thái" containerClassName={styles.select} controlSize="sm" options={POST_STATUS_OPTIONS} value={draft.values.status ?? ""} onChange={(event) => draft.set("status", (event.target.value || undefined) as PostStatus | undefined)} />
      <CmsSelect aria-label="Lọc hiển thị trên trang chủ" containerClassName={styles.select} controlSize="sm" options={POST_LANDING_OPTIONS} value={draft.values.showOnLanding === undefined ? "" : String(draft.values.showOnLanding)} onChange={(event) => draft.set("showOnLanding", parsePostBoolean(event.target.value))} />
    </CmsFilterGroup>}
    
  />;
}
