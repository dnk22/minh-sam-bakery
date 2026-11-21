import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { CmsBadge } from "@/cms/components/ui/badge/badge";
import { ArticleRenderer } from "@/article/renderer/article-renderer";
import { parseArticleContent } from "@/article/html/article-html";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { getPostStatusPresentation } from "../../constants";
import { sanitizePostHtml } from "../../lib/post-html";
import type { Post } from "../../types";
import styles from "./post-detail.module.css";
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Chưa có";
export function PostDetail({ post }: { post: Post }) {
  const status = getPostStatusPresentation(post.status); const safeHtml = sanitizePostHtml(post.content);
  const parsed = parseArticleContent(post.content);
  return <div className={styles.root}>
    <div className={styles.hero}>{post.thumbnailUrl ? <Image src={cmsAssetUrl(post.thumbnailUrl)} alt={`Ảnh đại diện ${post.title}`} width={960} height={480} unoptimized /> : <span><ImageIcon aria-hidden="true" /> Chưa có ảnh đại diện</span>}</div>
    <div className={styles.badges}><CmsBadge variant={status.variant}>{status.label}</CmsBadge><CmsBadge variant={post.showOnLanding ? "warning" : "secondary"}>{post.showOnLanding ? "Được chọn cho landing" : "Không chọn cho landing"}</CmsBadge></div>
    <dl><div><dt>Slug</dt><dd>{post.slug}</dd></div><div><dt>Tác giả</dt><dd>{post.author.fullName}</dd></div><div><dt>Cập nhật</dt><dd>{formatDate(post.updatedAt)}</dd></div><div><dt>Xuất bản</dt><dd>{formatDate(post.publishedAt)}</dd></div></dl>
    {post.excerpt ? <section><h3>Tóm tắt</h3><p>{post.excerpt}</p></section> : null}
    <section><h3>Nội dung xem trước</h3>{parsed.status === "supported" ? <ArticleRenderer document={parsed.document} presentation={{ title: post.title, excerpt: post.excerpt ?? undefined, coverUrl: post.thumbnailUrl ?? undefined, coverAlt: post.title, author: post.author.fullName, publishedAt: post.publishedAt ?? undefined }} resolveImageUrl={cmsAssetUrl} /> : <article className={styles.article} dangerouslySetInnerHTML={{ __html: safeHtml }} />}</section>
    {(post.seoTitle || post.seoDescription) ? <section><h3>SEO</h3><p><strong>{post.seoTitle || "Chưa có tiêu đề SEO"}</strong></p><p>{post.seoDescription || "Chưa có mô tả SEO"}</p></section> : null}
  </div>;
}
