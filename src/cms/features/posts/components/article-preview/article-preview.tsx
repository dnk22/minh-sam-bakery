"use client";
import { ArticleRenderer } from "@/article/renderer/article-renderer";
import { parseArticleContent } from "@/article/html/article-html";
import { cmsAssetUrl } from "@/cms/lib/api/asset-url";
import { sanitizePostHtml } from "../../lib/post-html";
import type { PostFormValues } from "../../types";
import styles from "./article-preview.module.css";
export function ArticlePreview({ values, author, publishedAt }: { values: PostFormValues; author?: string; publishedAt?: string }) {
  const parsed = parseArticleContent(values.content);
  if (parsed.status === "supported") return <div className={styles.frame}><ArticleRenderer document={parsed.document} presentation={{ title: values.title, excerpt: values.excerpt, coverUrl: values.thumbnailUrl, coverAlt: values.title, author, publishedAt }} resolveImageUrl={cmsAssetUrl} /></div>;
  return <div className={styles.legacy}><p>{parsed.reason}</p><article dangerouslySetInnerHTML={{ __html: sanitizePostHtml(values.content) }} /></div>;
}
