"use client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { usePostMutations } from "../../hooks/use-post-mutations";
import type { Post } from "../../types";
import styles from "./post-publish-dialog.module.css";
export function PostPublishDialog({ post, onClose, onPublished }: { post: Post | null; onClose: () => void; onPublished?: (post: Post) => void }) {
  const mutation = usePostMutations().publish; const [error, setError] = useState<string | null>(null);
  const confirm = async () => { if (!post || mutation.isPending) return; setError(null); try { const saved = await mutation.mutateAsync(post.id); onPublished?.(saved); onClose(); } catch (caught) { setError(caught instanceof CmsApiError ? caught.message : "Không thể xuất bản bài viết lúc này."); } };
  return <ResponsiveModal open={Boolean(post)} onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }} onBeforeClose={() => !mutation.isPending} title="Xuất bản bài viết" variant="confirm" footer={<><CmsButton type="button" variant="outline" disabled={mutation.isPending} onClick={onClose}>Hủy</CmsButton><CmsButton type="button" disabled={mutation.isPending} onClick={confirm}>{mutation.isPending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : null}Xuất bản</CmsButton></>}><p>Bài viết <strong>“{post?.title}”</strong> sẽ được hiển thị công khai.</p>{error ? <p className={styles.error} role="alert">{error}</p> : null}</ResponsiveModal>;
}
