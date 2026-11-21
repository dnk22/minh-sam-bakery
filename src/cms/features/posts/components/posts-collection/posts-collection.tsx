"use client";
import type { UseQueryResult } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { ResponsiveCollection } from "@/cms/components/responsive-collection/responsive-collection";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { getPostStatusPresentation } from "../../constants";
import type { PostFilters } from "../../hooks/use-post-filters";
import type { Post, PostList } from "../../types";
import { createPostColumns } from "../post-columns/post-columns";
import styles from "./posts-collection.module.css";
type Actions = { onDetail: (post: Post) => void; onEdit: (post: Post) => void; onPublish: (post: Post) => void; onDelete: (post: Post) => void };
export function PostsCollection({ filters, query, actions }: { filters: PostFilters; query: UseQueryResult<PostList, Error>; actions: Actions }) {
  const columns = useMemo(() => createPostColumns(actions), [actions]); const list = query.data;
  return <ResponsiveCollection className={styles.table} columns={columns} data={list?.items ?? []} getItemKey={(post) => post.id} getRowId={(post) => post.id} renderItem={(post) => <PostListItem post={post} />} renderAccessory={(post) => { const status = getPostStatusPresentation(post.status); return <CmsBadge variant={status.variant}>{status.label}</CmsBadge>; }} onItemClick={actions.onDetail} getItemLabel={(post) => `Xem bài viết ${post.title}`} loading={query.isLoading} error={query.error?.message} onRetry={() => query.refetch()} emptyState="Chưa có bài viết nào." filteredEmptyState="Không có bài viết phù hợp." isFiltered={filters.isFiltered} pagination={list ? { meta: list.pagination, onPageChange: filters.setPage } : undefined} />;
}
function PostListItem({ post }: { post: Post }) { return <div className={styles.item}>{post.thumbnailUrl ? <Image src={cmsAssetUrl(post.thumbnailUrl)} alt="" width={48} height={48} unoptimized /> : <span className={styles.placeholder}><ImageIcon aria-hidden="true" /></span>}<div><strong>{post.title}</strong><span>{post.author.fullName}</span><small>{post.showOnLanding ? "Hiển thị trên trang chủ" : "Không hiển thị trên trang chủ"}</small></div></div>; }
