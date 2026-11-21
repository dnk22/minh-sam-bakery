"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, LoaderCircle, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Path } from "react-hook-form";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { ResponsiveModal } from "@/cms/components/responsive-modal/responsive-modal";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { usePostMutations } from "../../hooks/use-post-mutations";
import { inspectEditorCompatibility } from "../../lib/post-html";
import { createArticleDocument } from "@/article/registry/article-layout-registry";
import { parseArticleContent, serializeArticleDocument } from "@/article/html/article-html";
import { formToPostCreate, formToPostPatch, postFormSchema, postToForm, vietnamesePostSlug } from "../../schemas/post.schema";
import type { Post, PostFormValues } from "../../types";
import { PostFields } from "../post-fields/post-fields";
import { ArticlePreview } from "../article-preview/article-preview";
import { PostPublishDialog } from "../post-publish-dialog/post-publish-dialog";
import styles from "./post-editor-page.module.css";

export function PostEditorPage({ post }: { post?: Post }) {
  const router = useRouter(); const mutations = usePostMutations(); const isCreate = !post;
  const originalParse = parseArticleContent(post?.content ?? ""); const legacyCompatibility = originalParse.status === "legacy" ? inspectEditorCompatibility(post?.content ?? "") : null;
  const contentEditable = isCreate || originalParse.status === "supported" || (originalParse.status === "legacy" && Boolean(legacyCompatibility?.compatible));
  const initial = postToForm(post); if (isCreate) initial.content = serializeArticleDocument(createArticleDocument("editorial"));
  const form = useForm<PostFormValues>({ resolver: zodResolver(postFormSchema), defaultValues: initial });
  const [uploadPending, setUploadPending] = useState(false); const [publishTarget, setPublishTarget] = useState<Post | null>(null); const [previewValues, setPreviewValues] = useState<PostFormValues | null>(null); const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const acceptedVersion = useRef(post?.updatedAt);
  const slugManual = useRef(Boolean(post));
  // React Hook Form watch is intentionally used for create-mode slug assistance.
  // eslint-disable-next-line react-hooks/incompatible-library
  const title = form.watch("title");
  useEffect(() => { if (isCreate && !slugManual.current) form.setValue("slug", vietnamesePostSlug(title), { shouldDirty: false }); }, [form, isCreate, title]);
  useEffect(() => { if (!post || post.updatedAt === acceptedVersion.current || form.formState.isDirty) return; acceptedVersion.current = post.updatedAt; form.reset(postToForm(post)); }, [form, form.formState.isDirty, post]);
  useUnsavedChangesWarning(form.formState.isDirty || uploadPending, "Bỏ các thay đổi bài viết chưa lưu?");
  const pending = mutations.create.isPending || mutations.update.isPending || mutations.publish.isPending;
  const setError = (error: unknown) => { if (error instanceof CmsApiError) { Object.entries(error.fields ?? {}).forEach(([field, message]) => form.setError(field as Path<PostFormValues>, { message })); form.setError("root.server", { message: error.message }); } else form.setError("root.server", { message: "Không thể lưu bài viết lúc này." }); };
  const save = async (values: PostFormValues, navigateAfterCreate = true) => {
    if (uploadPending) { form.setError("root.server", { message: "Hãy tải xong ảnh đại diện trước khi lưu." }); return null; }
    try {
      const saved = isCreate ? await mutations.create.mutateAsync(formToPostCreate(values)) : await (async () => {
        const patch = formToPostPatch(values, post, { contentChanged: Boolean(form.formState.dirtyFields.content), contentCompatible: contentEditable });
        return Object.keys(patch).length ? mutations.update.mutateAsync({ id: post.id, input: patch }) : post;
      })();
      acceptedVersion.current = saved.updatedAt; form.reset(postToForm(saved)); setSavedMessage(isCreate ? "Đã tạo bản nháp." : "Đã lưu thay đổi.");
      if (isCreate && navigateAfterCreate) router.replace(`/cms/posts/${encodeURIComponent(saved.id)}/edit`);
      return saved;
    } catch (error) { setError(error); return null; }
  };
  const submit = (publishAfter = false) => form.handleSubmit(async (values) => { setSavedMessage(null); const saved = await save(values, !publishAfter); if (saved && publishAfter && saved.status === "DRAFT") setPublishTarget(saved); });
  const remoteConflict = Boolean(post && acceptedVersion.current && post.updatedAt !== acceptedVersion.current && form.formState.isDirty);
  return <CmsMain className={styles.main} fluid><header className={styles.heading}><div><Link className={styles.back} href="/cms/posts"><ArrowLeft aria-hidden="true" size={16} /> Bài viết</Link><h1>{isCreate ? "Tạo bài viết" : "Chỉnh sửa bài viết"}</h1><p>{isCreate ? "Bài viết mới luôn được tạo dưới dạng bản nháp." : post.title}</p></div></header>
    <form id="post-editor-form" noValidate onSubmit={submit(false)} onChange={() => setSavedMessage(null)}>
      <PostFields form={form} post={post} onUploadPendingChange={setUploadPending} />
      {form.formState.errors.root?.server?.message ? <p className={styles.error} role="alert">{form.formState.errors.root.server.message}</p> : null}
      {remoteConflict ? <div className={styles.error} role="alert">Bài viết đã thay đổi trên máy chủ trong khi bạn đang chỉnh sửa. Nội dung cục bộ chưa bị ghi đè. <CmsButton type="button" size="sm" variant="outline" onClick={() => window.location.reload()}>Tải lại bản máy chủ</CmsButton></div> : null}
      {savedMessage ? <p className={styles.success} role="status">{savedMessage}</p> : null}
      <div className={styles.actions}><CmsButton asChild type="button" variant="outline"><Link href="/cms/posts">Hủy</Link></CmsButton><CmsButton type="button" variant="secondary" onClick={() => setPreviewValues(form.getValues())}><Eye aria-hidden="true" size={16} /> Xem trước</CmsButton><CmsButton type="submit" variant="outline" disabled={pending || uploadPending}>{pending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : <Save aria-hidden="true" size={16} />}{isCreate ? "Lưu bản nháp" : "Lưu thay đổi"}</CmsButton>{post?.status !== "PUBLISHED" ? <CmsButton type="button" disabled={pending || uploadPending} onClick={() => void submit(true)()}><Send aria-hidden="true" size={16} /> Lưu và xuất bản</CmsButton> : null}</div>
    </form>
    <PostPublishDialog post={publishTarget} onClose={() => setPublishTarget(null)} onPublished={(saved) => { acceptedVersion.current = saved.updatedAt; form.reset(postToForm(saved)); setSavedMessage("Bài viết đã được xuất bản."); if (isCreate) router.replace(`/cms/posts/${encodeURIComponent(saved.id)}/edit`); }} />
    <ResponsiveModal className={styles.previewModal} open={Boolean(previewValues)} onOpenChange={(open) => { if (!open) setPreviewValues(null); }} title="Xem trước bài viết" description="Preview dùng cùng ArticleRenderer dự kiến cho Landing Phase 7.3.">{previewValues ? <ArticlePreview values={previewValues} author={post?.author.fullName} publishedAt={post?.publishedAt ?? undefined} /> : null}</ResponsiveModal>
  </CmsMain>;
}
