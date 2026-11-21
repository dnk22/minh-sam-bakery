import type { ZodType } from "zod";
import { editorialDataSchema, photoStoryDataSchema, productStoryDataSchema, type ArticleLayoutData, type ArticleLayoutDocument, type ArticleLayoutKey } from "../contracts/article-layout.ts";

export type ArticleLayoutDefinition = {
  key: ArticleLayoutKey; version: 1; name: string; description: string; category: string;
  schema: ZodType<ArticleLayoutData>; createEmpty: () => ArticleLayoutData;
};
const seedId = (prefix: string) => `${prefix}-initial`;
export const articleLayoutRegistry: readonly ArticleLayoutDefinition[] = [
  { key: "editorial", version: 1, name: "Editorial", category: "Bài viết dài", description: "Bố cục đọc dài, mục lục, section ảnh và trích dẫn.", schema: editorialDataSchema,
    createEmpty: () => ({ kind: "editorial", introduction: "<p></p>", sections: [{ id: seedId("section"), type: "section", title: "", body: "<p></p>", imageUrl: "", imageAlt: "", caption: "", imageSide: "right" }] }) },
  { key: "photo-story", version: 1, name: "Photo Story", category: "Kể chuyện bằng ảnh", description: "Các chương ảnh, gallery và phần mô tả theo nhịp thị giác.", schema: photoStoryDataSchema,
    createEmpty: () => ({ kind: "photo-story", introduction: "<p></p>", chapters: [{ id: seedId("chapter"), heading: "", body: "<p></p>", variant: "full", images: [] }] }) },
  { key: "product-story", version: 1, name: "Product Story", category: "Sản phẩm & quà tặng", description: "Câu chuyện sản phẩm, điểm nổi bật, lợi ích và CTA.", schema: productStoryDataSchema,
    createEmpty: () => ({ kind: "product-story", introduction: "<p></p>", sections: [{ id: seedId("story"), type: "section", title: "", body: "<p></p>", imageUrl: "", imageAlt: "", caption: "", imageSide: "left" }], highlight: { title: "", description: "", imageUrl: "", imageAlt: "", ctaLabel: "", ctaHref: "" }, benefits: [] }) },
] as const;

export function getArticleLayout(key: string, version: number) { return articleLayoutRegistry.find((layout) => layout.key === key && layout.version === version); }
export function createArticleDocument(key: ArticleLayoutKey): ArticleLayoutDocument { const layout = getArticleLayout(key, 1); if (!layout) throw new Error("Layout không tồn tại."); return { key, version: 1, data: layout.createEmpty() }; }
