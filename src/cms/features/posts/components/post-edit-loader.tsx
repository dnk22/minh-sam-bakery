"use client";
import Link from "next/link";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { usePostDetail } from "../hooks/use-posts";
import { PostEditorPage } from "./post-editor-page/post-editor-page";
export function PostEditLoader({ id }: { id: string }) {
  const query = usePostDetail(id);
  if (query.isLoading) return <CmsMain><p>Đang tải bài viết…</p></CmsMain>;
  if (query.error || !query.data) return <CmsMain><h1>Không thể tải bài viết</h1><p role="alert">{query.error instanceof Error ? query.error.message : "Không tìm thấy bài viết."}</p><div><CmsButton type="button" variant="outline" onClick={() => query.refetch()}>Thử lại</CmsButton> <CmsButton asChild variant="ghost"><Link href="/cms/posts">Quay lại</Link></CmsButton></div></CmsMain>;
  return <PostEditorPage key={query.data.id} post={query.data} />;
}
