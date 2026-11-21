"use client";
import { Controller, type UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/cms/components/image-upload/image-upload";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { CmsFormField } from "@/cms/components/ui/form-field/form-field";
import { CmsInput } from "@/cms/components/ui/input/input";
import { CmsTextarea } from "@/cms/components/ui/textarea/textarea";
import { getPostStatusPresentation } from "../../constants";
import type { Post, PostFormValues } from "../../types";
import { BasicRichTextEditor } from "../basic-rich-text-editor/basic-rich-text-editor";
import styles from "./post-fields.module.css";
export function PostFields({ form, post, contentCompatible, compatibilityReason, onUploadPendingChange }: { form: UseFormReturn<PostFormValues>; post?: Post; contentCompatible: boolean; compatibilityReason?: string; onUploadPendingChange: (pending: boolean) => void }) {
  const status = getPostStatusPresentation(post?.status ?? "DRAFT");
  return <div className={styles.layout}><div className={styles.primary}>
    <section className={styles.card}><header><h2>Nội dung chính</h2><p>Tiêu đề, tóm tắt và nội dung HTML của bài viết.</p></header>
      <CmsFormField htmlFor="post-title" label="Tiêu đề" required error={form.formState.errors.title?.message}><CmsInput id="post-title" {...form.register("title")} /></CmsFormField>
      <CmsFormField htmlFor="post-slug" label="Slug" description="Để trống khi tạo để Backend tự sinh." error={form.formState.errors.slug?.message}><CmsInput id="post-slug" {...form.register("slug")} /></CmsFormField>
      <CmsFormField htmlFor="post-excerpt" label="Tóm tắt" error={form.formState.errors.excerpt?.message}><CmsTextarea id="post-excerpt" rows={4} {...form.register("excerpt")} /></CmsFormField>
      <CmsFormField label="Nội dung" required error={form.formState.errors.content?.message} description={contentCompatible ? "Editor lưu HTML; ảnh nội dung sẽ được bổ sung ở Phase 7.2." : compatibilityReason}>
        <Controller control={form.control} name="content" render={({ field }) => contentCompatible ? <BasicRichTextEditor value={field.value} onChange={field.onChange} /> : <div className={styles.warning} role="alert">{compatibilityReason}</div>} />
      </CmsFormField>
    </section>
    <section className={styles.card}><header><h2>SEO</h2><p>Thông tin mô tả cho công cụ tìm kiếm.</p></header>
      <CmsFormField htmlFor="post-seo-title" label="Tiêu đề SEO" error={form.formState.errors.seoTitle?.message}><CmsInput id="post-seo-title" {...form.register("seoTitle")} /></CmsFormField>
      <CmsFormField htmlFor="post-seo-description" label="Mô tả SEO" error={form.formState.errors.seoDescription?.message}><CmsTextarea id="post-seo-description" rows={4} {...form.register("seoDescription")} /></CmsFormField>
    </section>
  </div><aside className={styles.aside}>
    <section className={styles.card}><header><h2>Hiển thị</h2></header><div className={styles.status}><span>Trạng thái</span><CmsBadge variant={status.variant}>{status.label}</CmsBadge></div>
      <label className={styles.check}><input type="checkbox" {...form.register("showOnLanding")} /><span><strong>Chọn cho landing</strong><small>Không đồng nghĩa với đã xuất bản.</small></span></label>
      {post ? <dl><div><dt>Tác giả</dt><dd>{post.author.fullName}</dd></div><div><dt>Cập nhật</dt><dd>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(post.updatedAt))}</dd></div></dl> : null}
    </section>
    <section className={styles.card}><header><h2>Ảnh đại diện</h2><p>Ảnh được upload vào thư mục posts.</p></header><Controller control={form.control} name="thumbnailUrl" render={({ field }) => <ImageUpload folder="posts" value={field.value || null} onChange={(url) => field.onChange(url ?? "")} onPendingChange={onUploadPendingChange} altText="Ảnh đại diện bài viết" pendingMessage="Ảnh chưa được tải lên. Hãy tải ảnh trước khi lưu bài viết." allowRemove={!post?.thumbnailUrl} />} />{post?.thumbnailUrl ? <p className={styles.note}>API chưa xác nhận cách xóa ảnh hiện có; Phase 7.1 chỉ cho phép thay thế để tránh gửi giá trị xóa sai contract.</p> : null}</section>
  </aside></div>;
}
