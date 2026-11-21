"use client";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useRef } from "react";
import { articleDocumentHasContent, parseArticleContent, serializeArticleDocument } from "@/article/html/article-html";
import { createArticleDocument } from "@/article/registry/article-layout-registry";
import type { ArticleLayoutKey } from "@/article/contracts/article-layout";
import { ImageUpload } from "@/cms/components/image-upload/image-upload";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import { getPostStatusPresentation } from "../../constants";
import type { Post, PostFormValues } from "../../types";
import { BasicRichTextEditor } from "../basic-rich-text-editor/basic-rich-text-editor";
import { LayoutContentForm } from "../layout-content-form/layout-content-form";
import { LayoutSelector } from "../layout-selector/layout-selector";
import { inspectEditorCompatibility } from "../../lib/post-html";
import styles from "./post-fields.module.css";
export function PostFields({ form, post, onUploadPendingChange }: { form: UseFormReturn<PostFormValues>; post?: Post; onUploadPendingChange: (pending: boolean) => void }) {
  const status = getPostStatusPresentation(post?.status ?? "DRAFT");
  const pendingSources = useRef(new Set<string>());
  const setPending = (source: string, pending: boolean) => { if (pending) pendingSources.current.add(source); else pendingSources.current.delete(source); onUploadPendingChange(pendingSources.current.size > 0); };
  return <div className={styles.layout}><div className={styles.primary}>
    <section className={styles.card}><header><h2>Nội dung chính</h2><p>Tiêu đề, tóm tắt và nội dung HTML của bài viết.</p></header>
      <CmsFormField htmlFor="post-title" label="Tiêu đề" required error={form.formState.errors.title?.message}><CmsInput id="post-title" {...form.register("title")} /></CmsFormField>
      <CmsFormField htmlFor="post-slug" label="Slug" description="Để trống để tạo đường dẫn tự động." error={form.formState.errors.slug?.message}><CmsInput id="post-slug" {...form.register("slug")} /></CmsFormField>
      <CmsFormField htmlFor="post-excerpt" label="Tóm tắt" error={form.formState.errors.excerpt?.message}><CmsTextarea id="post-excerpt" rows={4} {...form.register("excerpt")} /></CmsFormField>
      <Controller control={form.control} name="content" render={({ field }) => {
        const parsed = parseArticleContent(field.value); const legacy = parsed.status === "legacy" ? inspectEditorCompatibility(field.value) : null;
        const chooseLayout = (key: ArticleLayoutKey) => {
          if (parsed.status === "supported" && parsed.document.key === key) return;
          if (parsed.status === "supported" && articleDocumentHasContent(parsed.document) && !window.confirm("Đổi layout sẽ tạo nội dung trống mới và bỏ các slot hiện tại. Tiếp tục?")) return;
          field.onChange(serializeArticleDocument(createArticleDocument(key)));
        };
        return <><>{!post && parsed.status === "supported" ? <LayoutSelector value={parsed.document.key} onChange={chooseLayout} /> : null}</><CmsFormField fieldName="content" label="Nội dung" required error={form.formState.errors.content?.message} description={parsed.status === "supported" ? "Soạn nội dung theo bố cục đã chọn." : parsed.reason}>
          {parsed.status === "supported" ? <LayoutContentForm document={parsed.document} onChange={(document) => field.onChange(serializeArticleDocument(document))} onPendingChange={(pending) => setPending("layout", pending)} /> : parsed.status === "legacy" && legacy?.compatible ? <BasicRichTextEditor value={field.value} onChange={field.onChange} /> : <div className={styles.warning} role="alert">{parsed.status === "legacy" ? legacy?.reason : parsed.reason}</div>}
        </CmsFormField></>;
      }} />
    </section>
    <section className={styles.card}><header><h2>SEO</h2><p>Thông tin mô tả cho công cụ tìm kiếm.</p></header>
      <CmsFormField htmlFor="post-seo-title" label="Tiêu đề SEO" error={form.formState.errors.seoTitle?.message}><CmsInput id="post-seo-title" {...form.register("seoTitle")} /></CmsFormField>
      <CmsFormField htmlFor="post-seo-description" label="Mô tả SEO" error={form.formState.errors.seoDescription?.message}><CmsTextarea id="post-seo-description" rows={4} {...form.register("seoDescription")} /></CmsFormField>
    </section>
  </div><aside className={styles.aside}>
    <section className={styles.card}><header><h2>Hiển thị</h2></header><div className={styles.status}><span>Trạng thái</span><CmsBadge variant={status.variant}>{status.label}</CmsBadge></div>
      <label className={styles.check}><input type="checkbox" {...form.register("showOnLanding")} /><span><strong>Hiển thị trên trang chủ</strong><small>Bài viết vẫn cần được xuất bản để người đọc có thể xem.</small></span></label>
      {post ? <dl><div><dt>Tác giả</dt><dd>{post.author.fullName}</dd></div><div><dt>Cập nhật</dt><dd>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(post.updatedAt))}</dd></div></dl> : null}
    </section>
    <section className={styles.card}><header><h2>Ảnh đại diện</h2><p>Ảnh đại diện của bài viết.</p></header><Controller control={form.control} name="thumbnailUrl" render={({ field }) => <CmsFormField fieldName="thumbnailUrl" label="Tệp ảnh" error={form.formState.errors.thumbnailUrl?.message}><ImageUpload folder="posts" value={field.value || null} onChange={(url) => field.onChange(url ?? "")} onPendingChange={(pending) => setPending("thumbnail", pending)} altText="Ảnh đại diện bài viết" pendingMessage="Ảnh chưa được tải lên. Hãy tải ảnh trước khi lưu bài viết." allowRemove={!post?.thumbnailUrl} /></CmsFormField>} />{post?.thumbnailUrl ? <p className={styles.note}>Bạn có thể thay ảnh đại diện hiện tại bằng một ảnh mới.</p> : null}</section>
  </aside></div>;
}
