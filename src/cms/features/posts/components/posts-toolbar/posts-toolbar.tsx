"use client";
import { Search, X } from "lucide-react";
import { CmsFilterGroup } from "@/cms/components/filter-group/filter-group";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsSelect } from "@/cms/components/ui/select/select";
import { POST_LANDING_OPTIONS, POST_STATUS_OPTIONS } from "../../constants";
import type { PostFilters } from "../../hooks/use-post-filters";
import { usePostSearch } from "../../hooks/use-post-search";
import { countPostAdvancedFilters, parsePostBoolean } from "../../lib/post-data";
import type { PostStatus } from "../../types";
import styles from "./posts-toolbar.module.css";
export function PostsToolbar({ filters }: { filters: PostFilters }) {
  const search = usePostSearch({ value: filters.search, onCommit: filters.setSearch }); const count = countPostAdvancedFilters(filters);
  return <section className={styles.toolbar} aria-label="Bộ lọc bài viết"><div className={styles.controls}>
    <CmsInput aria-label="Tìm kiếm bài viết" containerClassName={styles.search} controlSize="sm" leadingIcon={<Search aria-hidden="true" size={17} />} placeholder="Tìm theo tiêu đề" type="search" value={search.draft} onBlur={search.onBlur} onFocus={search.onFocus} onChange={(event) => search.onChange(event.target.value)} />
    <CmsFilterGroup activeCount={count} label="Bộ lọc bài viết" onClear={filters.clearAdvancedFilters}>
      <CmsSelect aria-label="Lọc theo trạng thái" containerClassName={styles.select} controlSize="sm" options={POST_STATUS_OPTIONS} value={filters.status ?? ""} onChange={(event) => filters.setStatus((event.target.value || undefined) as PostStatus | undefined)} />
      <CmsSelect aria-label="Lọc hiển thị trên trang chủ" containerClassName={styles.select} controlSize="sm" options={POST_LANDING_OPTIONS} value={filters.showOnLanding === undefined ? "" : String(filters.showOnLanding)} onChange={(event) => filters.setShowOnLanding(parsePostBoolean(event.target.value))} />
    </CmsFilterGroup>
    {filters.isFiltered ? <CmsButton className={styles.clearAll} type="button" size="sm" variant="ghost" onClick={filters.clearFilters}><X aria-hidden="true" size={15} /> Xóa tất cả</CmsButton> : null}
  </div></section>;
}
