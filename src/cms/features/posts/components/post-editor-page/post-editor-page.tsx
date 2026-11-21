"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Path } from "react-hook-form";
import { CmsMain } from "@/cms/components/layout/cms-main";
import { CmsButton } from "@/cms/components/ui/button";
import { CmsApiError } from "@/cms/lib/api/errors";
import { useUnsavedChangesWarning } from "@/cms/hooks/use-unsaved-changes-warning";
import { usePostMutations } from "../../hooks/use-post-mutations";
import { inspectEditorCompatibility } from "../../lib/post-html";
import { formToPostCreate, formToPostPatch, postFormSchema, postToForm, vietnamesePostSlug } from "../../schemas/post.schema";
import type { Post, PostFormValues } from "../../types";
import { PostFields } from "../post-fields/post-fields";
import { PostPublishDialog } from "../post-publish-dialog/post-publish-dialog";
import styles from "./post-editor-page.module.css";

export function PostEditorPage({ post }: { post?: Post }) {
  const router = useRouter(); const mutations = usePostMutations(); const isCreate = !post; const compatibility = inspectEditorCompatibility(post?.content ?? "<p></p>");
  const form = useForm<PostFormValues>({ resolver: zodResolver(postFormSchema), defaultValues: postToForm(post) });
  const [uploadPending, setUploadPending] = useState(false); const [publishTarget, setPublishTarget] = useState<Post | null>(null); const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const slugManual = useRef(Boolean(post));
  // React Hook Form watch is intentionally used for create-mode slug assistance.
  // eslint-disable-next-line react-hooks/incompatible-library
  const title = form.watch("title");
  useEffect(() => { if (isCreate && !slugManual.current) form.setValue("slug", vietnamesePostSlug(title), { shouldDirty: false }); }, [form, isCreate, title]);
  useUnsavedChangesWarning(form.formState.isDirty || uploadPending, "Bỏ các thay đổi bài viết chưa lưu?");
  const pending = mutations.create.isPending || mutations.update.isPending || mutations.publish.isPending;
  const setError = (error: unknown) => { if (error instanceof CmsApiError) { Object.entries(error.fields ?? {}).forEach(([field, message]) => form.setError(field as Path<PostFormValues>, { message })); form.setError("root.server", { message: error.message }); } else form.setError("root.server", { message: "Không thể lưu bài viết lúc này." }); };
  const save = async (values: PostFormValues, navigateAfterCreate = true) => {
    if (uploadPending) { form.setError("root.server", { message: "Hãy tải xong ảnh đại diện trước khi lưu." }); return null; }
    try {
      const saved = isCreate ? await mutations.create.mutateAsync(formToPostCreate(values)) : await (async () => {
        const patch = formToPostPatch(values, post, { contentChanged: Boolean(form.formState.dirtyFields.content), contentCompatible: compatibility.compatible });
        return Object.keys(patch).length ? mutations.update.mutateAsync({ id: post.id, input: patch }) : post;
      })();
      form.reset(postToForm(saved)); setSavedMessage(isCreate ? "Đã tạo bản nháp." : "Đã lưu thay đổi.");
      if (isCreate && navigateAfterCreate) router.replace(`/cms/posts/${encodeURIComponent(saved.id)}/edit`);
      return saved;
    } catch (error) { setError(error); return null; }
  };
  const submit = (publishAfter = false) => form.handleSubmit(async (values) => { setSavedMessage(null); const saved = await save(values, !publishAfter); if (saved && publishAfter && saved.status === "DRAFT") setPublishTarget(saved); });
  return <CmsMain className={styles.main} fluid><header className={styles.heading}><div><Link className={styles.back} href="/cms/posts"><ArrowLeft aria-hidden="true" size={16} /> Bài viết</Link><h1>{isCreate ? "Tạo bài viết" : "Chỉnh sửa bài viết"}</h1><p>{isCreate ? "Bài viết mới luôn được tạo dưới dạng bản nháp." : post.title}</p></div></header>
    <form id="post-editor-form" noValidate onSubmit={submit(false)} onChange={() => setSavedMessage(null)}>
      <PostFields form={form} post={post} contentCompatible={compatibility.compatible} compatibilityReason={compatibility.reason} onUploadPendingChange={setUploadPending} />
      {form.formState.errors.root?.server?.message ? <p className={styles.error} role="alert">{form.formState.errors.root.server.message}</p> : null}
      {savedMessage ? <p className={styles.success} role="status">{savedMessage}</p> : null}
      <div className={styles.actions}><CmsButton asChild type="button" variant="outline"><Link href="/cms/posts">Hủy</Link></CmsButton><CmsButton type="submit" variant="outline" disabled={pending || uploadPending}>{pending ? <LoaderCircle className={styles.spin} aria-hidden="true" size={16} /> : <Save aria-hidden="true" size={16} />}{isCreate ? "Lưu bản nháp" : "Lưu thay đổi"}</CmsButton>{post?.status !== "PUBLISHED" ? <CmsButton type="button" disabled={pending || uploadPending} onClick={() => void submit(true)()}><Send aria-hidden="true" size={16} /> Lưu và xuất bản</CmsButton> : null}</div>
    </form>
    <PostPublishDialog post={publishTarget} onClose={() => setPublishTarget(null)} onPublished={(saved) => { form.reset(postToForm(saved)); setSavedMessage("Bài viết đã được xuất bản."); if (isCreate) router.replace(`/cms/posts/${encodeURIComponent(saved.id)}/edit`); }} />
  </CmsMain>;
}
