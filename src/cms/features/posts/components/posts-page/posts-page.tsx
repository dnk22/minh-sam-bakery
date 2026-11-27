"use client";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { usePostFilters } from "../../hooks/use-post-filters";
import { usePosts } from "../../hooks/use-posts";
import type { Post } from "../../types";
import { PostDeleteDialog } from "../post-delete-dialog/post-delete-dialog";
import { PostDetail } from "../post-detail/post-detail";
import { PostPublishDialog } from "../post-publish-dialog/post-publish-dialog";
import { PostsCollection } from "../posts-collection/posts-collection";
import { PostsToolbar } from "../posts-toolbar/posts-toolbar";
import styles from "./posts-page.module.css";
const PAGE_SIZE = 10;
export function PostsPage() {
  const router = useRouter(); const filters = usePostFilters(); const [detail, setDetail] = useState<Post | null>(null); const [publish, setPublish] = useState<Post | null>(null); const [remove, setRemove] = useState<Post | null>(null);
  const query = usePosts({ page: filters.page, limit: PAGE_SIZE, search: filters.search || undefined, status: filters.status, showOnLanding: filters.showOnLanding });
  const edit = useCallback((post: Post) => router.push(`/cms/posts/${encodeURIComponent(post.id)}/edit`), [router]);
  const actions = useMemo(() => ({ onDetail: setDetail, onEdit: edit, onPublish: setPublish, onDelete: setRemove }), [edit]);
  const deleted = () => { setRemove(null); setDetail(null); if ((query.data?.items.length ?? 0) === 1 && filters.page > 1) filters.setPage(filters.page - 1); };
  return <CmsMain className={styles.main}><header className={styles.heading}><div><h1>Bài viết</h1><p>Quản lý nội dung Journal, SEO và trạng thái xuất bản.</p></div><CmsButton className="cms-page-header-action" asChild><Link href="/cms/posts/new"><Plus aria-hidden="true" size={17} /> Thêm bài viết</Link></CmsButton></header>
    <PostsToolbar filters={filters} fetching={query.isFetching} /><PostsCollection filters={filters} query={query} actions={actions} />
    <ResponsiveModal size="lg" open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetail(null); }} title={detail?.title ?? "Chi tiết bài viết"} description="Xem nội dung và thông tin bài viết." footer={detail ? <CmsButton asChild><Link href={`/cms/posts/${encodeURIComponent(detail.id)}/edit`}><Pencil aria-hidden="true" size={16} /> Chỉnh sửa</Link></CmsButton> : null}>{detail ? <PostDetail post={detail} /> : null}</ResponsiveModal>
    <PostPublishDialog post={publish} onClose={() => setPublish(null)} /><PostDeleteDialog post={remove} onClose={() => setRemove(null)} onDeleted={deleted} />
  </CmsMain>;
}
