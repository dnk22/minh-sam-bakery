"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { usePostMutations } from "../../hooks/use-post-mutations";
import type { Post } from "../../types";
import styles from "./post-delete-dialog.module.css";
export function PostDeleteDialog({ post, onClose, onDeleted }: { post: Post | null; onClose: () => void; onDeleted: () => void }) {
  const mutation = usePostMutations().remove; const [error, setError] = useState<string | null>(null);
  const confirm = async () => { if (!post || mutation.isPending) return; setError(null); try { await mutation.mutateAsync(post.id); onDeleted(); } catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xóa bài viết lúc này."); } };
  return <ResponsiveModal open={Boolean(post)} onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }} onBeforeClose={() => !mutation.isPending} title="Xóa mềm bài viết" description="Bài viết sẽ bị xóa khỏi CMS; Backend không cung cấp thao tác khôi phục." footer={<><CmsButton type="button" variant="outline" disabled={mutation.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" variant="destructive" disabled={mutation.isPending} onClick={confirm}>{mutation.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xác nhận xóa</CmsButton></>}><p>Bạn có chắc muốn xóa <strong>{post?.title}</strong>? Nếu bài đã xuất bản, nội dung công khai có thể bị ảnh hưởng.</p>{error ? <p className={styles.error} role="alert">{error}</p> : null}</ResponsiveModal>;
}
