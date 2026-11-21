import { z } from "zod";

export const ARTICLE_LAYOUT_KEYS = ["editorial", "photo-story", "product-story"] as const;
export type ArticleLayoutKey = typeof ARTICLE_LAYOUT_KEYS[number];
export type ImagePlacement = "left" | "right" | "full";
export type PhotoVariant = "full" | "two-up" | "image-left" | "image-right";

const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{2,79}$/, "ID nội dung không hợp lệ.");
const richText = z.string().max(100_000);
const canonicalImage = z.string().max(2_000).refine((value) => !value || isSafeArticleImageUrl(value), "URL ảnh không an toàn.");
const safeLink = z.string().max(2_000).refine((value) => !value || isSafeArticleLink(value), "Liên kết không an toàn.");
const image = z.object({ id, url: canonicalImage, alt: z.string().max(500), caption: z.string().max(1_000) }).strict().refine((value) => !value.url || value.alt.trim().length > 0, { message: "Ảnh cần alt text.", path: ["alt"] });
const narrative = z.object({ id, type: z.literal("section"), title: z.string().max(500), body: richText, imageUrl: canonicalImage, imageAlt: z.string().max(500), caption: z.string().max(1_000), imageSide: z.enum(["left", "right", "full"]) }).strict().refine((value) => !value.imageUrl || value.imageAlt.trim().length > 0, { message: "Ảnh cần alt text.", path: ["imageAlt"] });

function uniqueIds<T extends { id: string }>(items: T[]) { return new Set(items.map((item) => item.id)).size === items.length; }

export const editorialDataSchema = z.object({
  kind: z.literal("editorial"), introduction: richText,
  sections: z.array(z.discriminatedUnion("type", [narrative, z.object({ id, type: z.literal("quote"), quote: z.string().max(5_000), attribution: z.string().max(500) }).strict()])).max(30),
}).strict().refine((value) => uniqueIds(value.sections), { message: "ID section bị trùng.", path: ["sections"] });

export const photoStoryDataSchema = z.object({
  kind: z.literal("photo-story"), introduction: richText,
  chapters: z.array(z.object({ id, heading: z.string().max(500), body: richText, variant: z.enum(["full", "two-up", "image-left", "image-right"]), images: z.array(image).max(6).refine(uniqueIds, "ID ảnh bị trùng.") }).strict()).max(24),
}).strict().refine((value) => uniqueIds(value.chapters), { message: "ID chapter bị trùng.", path: ["chapters"] });

export const productStoryDataSchema = z.object({
  kind: z.literal("product-story"), introduction: richText,
  sections: z.array(narrative).max(24),
  highlight: z.object({ title: z.string().max(500), description: z.string().max(5_000), imageUrl: canonicalImage, imageAlt: z.string().max(500), ctaLabel: z.string().max(200), ctaHref: safeLink }).strict(),
  benefits: z.array(z.object({ id, title: z.string().max(300), description: z.string().max(1_000) }).strict()).max(8),
}).strict().superRefine((value, context) => {
  if (!uniqueIds([...value.sections, ...value.benefits])) context.addIssue({ code: "custom", message: "ID block bị trùng.", path: ["sections"] });
  if (value.highlight.imageUrl && !value.highlight.imageAlt.trim()) context.addIssue({ code: "custom", message: "Ảnh cần alt text.", path: ["highlight", "imageAlt"] });
});

export type EditorialData = z.infer<typeof editorialDataSchema>;
export type PhotoStoryData = z.infer<typeof photoStoryDataSchema>;
export type ProductStoryData = z.infer<typeof productStoryDataSchema>;
export type ArticleLayoutData = EditorialData | PhotoStoryData | ProductStoryData;
export type ArticleLayoutDocument = { key: ArticleLayoutKey; version: 1; data: ArticleLayoutData };
export type ArticlePresentation = { title: string; excerpt?: string; coverUrl?: string; coverAlt?: string; author?: string; publishedAt?: string; publishedLabel?: string };

export type ArticleParseResult =
  | { status: "supported"; raw: string; document: ArticleLayoutDocument }
  | { status: "legacy"; raw: string; reason: string }
  | { status: "unsupported"; raw: string; reason: string; key?: string; version?: number }
  | { status: "invalid"; raw: string; reason: string };

export function isSafeArticleImageUrl(value: string) {
  if (value.startsWith("/uploads/") && !value.includes("..") && !value.includes("\\") && !value.startsWith("//") && !value.toLowerCase().split(/[?#]/)[0]?.endsWith(".svg")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.pathname.toLowerCase().endsWith(".svg"); } catch { return false; }
}
export function isSafeArticleLink(value: string) {
  if ((value.startsWith("/") || value.startsWith("#")) && !value.startsWith("//") && !value.includes("..") && !value.includes("\\")) return true;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}
