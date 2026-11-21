import { parseFragment, serialize, type DefaultTreeAdapterMap } from "parse5";
import { getArticleLayout } from "../registry/article-layout-registry.ts";
import { isSafeArticleImageUrl, type ArticleLayoutDocument, type ArticleParseResult, type EditorialData, type PhotoStoryData, type ProductStoryData } from "../contracts/article-layout.ts";
import { sanitizeArticleRichText } from "./article-sanitize.ts";

type ElementNode = DefaultTreeAdapterMap["element"];
type ParentNode = DefaultTreeAdapterMap["parentNode"];
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = (node: ElementNode, name: string) => node.attrs.find((item) => item.name === name)?.value;
const elements = (node: ParentNode) => node.childNodes.filter((item): item is ElementNode => "tagName" in item);
const byAttr = (node: ParentNode, name: string, value: string) => elements(node).find((item) => attr(item, name) === value);
const text = (node?: ParentNode): string => node ? node.childNodes.map((item): string => "value" in item ? item.value : "childNodes" in item ? text(item) : "").join("") : "";
const inner = (node: ElementNode) => serialize(node);
const exactAttrs = (node: ElementNode, allowed: string[]) => node.attrs.every((item) => allowed.includes(item.name)) && new Set(node.attrs.map((item) => item.name)).size === node.attrs.length;
const KNOWN_ATTRIBUTES = new Set(["data-ms-article-layout", "data-ms-layout-version", "data-ms-slot", "data-ms-richtext", "data-ms-block", "data-ms-block-id", "data-ms-image-side", "data-ms-field", "data-ms-gallery", "data-ms-image-id", "data-ms-variant", "src", "alt", "href", "target", "rel"]);
function hasOnlyKnownAttributes(node: ParentNode): boolean { return elements(node).every((child) => child.attrs.every((item) => KNOWN_ATTRIBUTES.has(item.name)) && hasOnlyKnownAttributes(child)); }

function rich(node?: ElementNode) {
  if (!node || !exactAttrs(node, ["data-ms-richtext"])) throw new Error("Vùng rich text không hợp lệ.");
  const raw = inner(node); const sanitized = sanitizeArticleRichText(raw);
  if (serialize(parseFragment(raw)) !== serialize(parseFragment(sanitized))) throw new Error("Rich text chứa HTML hoặc URL không an toàn.");
  return sanitized;
}
function imageFigure(node: ElementNode) {
  const children = elements(node); const image = children.find((item) => item.tagName === "img"); const caption = children.find((item) => item.tagName === "figcaption");
  if (!image || !exactAttrs(image, ["src", "alt"])) throw new Error("Ảnh không hợp lệ.");
  const url = attr(image, "src") ?? ""; if (url && !isSafeArticleImageUrl(url)) throw new Error("URL ảnh không an toàn.");
  return { url, alt: attr(image, "alt") ?? "", caption: text(caption) };
}

function serializeNarrative(item: EditorialData["sections"][number] & { type: "section" } | ProductStoryData["sections"][number]) {
  const figure = item.imageUrl ? `<figure data-ms-field="image"><img src="${esc(item.imageUrl)}" alt="${esc(item.imageAlt)}"><figcaption>${esc(item.caption)}</figcaption></figure>` : "";
  return `<section data-ms-block="section" data-ms-block-id="${esc(item.id)}" data-ms-image-side="${item.imageSide}"><h2 data-ms-field="title">${esc(item.title)}</h2><div data-ms-richtext="body">${sanitizeArticleRichText(item.body)}</div>${figure}</section>`;
}
function serializeEditorial(data: EditorialData) {
  return data.sections.map((item) => item.type === "quote" ? `<blockquote data-ms-block="quote" data-ms-block-id="${esc(item.id)}"><p data-ms-field="quote">${esc(item.quote)}</p><cite data-ms-field="attribution">${esc(item.attribution)}</cite></blockquote>` : serializeNarrative(item)).join("");
}
function serializePhoto(data: PhotoStoryData) {
  return data.chapters.map((chapter) => `<section data-ms-block="photo-chapter" data-ms-block-id="${esc(chapter.id)}" data-ms-variant="${chapter.variant}"><h2 data-ms-field="heading">${esc(chapter.heading)}</h2><div data-ms-richtext="body">${sanitizeArticleRichText(chapter.body)}</div><div data-ms-gallery="images">${chapter.images.map((image) => `<figure data-ms-image-id="${esc(image.id)}"><img src="${esc(image.url)}" alt="${esc(image.alt)}"><figcaption>${esc(image.caption)}</figcaption></figure>`).join("")}</div></section>`).join("");
}
function serializeProduct(data: ProductStoryData) {
  const highlight = data.highlight; const highlightImage = highlight.imageUrl ? `<img src="${esc(highlight.imageUrl)}" alt="${esc(highlight.imageAlt)}">` : "";
  return `${data.sections.map(serializeNarrative).join("")}<aside data-ms-slot="product-highlight">${highlightImage}<h2 data-ms-field="title">${esc(highlight.title)}</h2><p data-ms-field="description">${esc(highlight.description)}</p><a data-ms-field="cta" href="${esc(highlight.ctaHref)}">${esc(highlight.ctaLabel)}</a></aside><section data-ms-slot="benefits">${data.benefits.map((item) => `<article data-ms-block="benefit" data-ms-block-id="${esc(item.id)}"><h3 data-ms-field="title">${esc(item.title)}</h3><p data-ms-field="description">${esc(item.description)}</p></article>`).join("")}</section>`;
}

export function serializeArticleDocument(document: ArticleLayoutDocument) {
  const layout = getArticleLayout(document.key, document.version); if (!layout) throw new Error("Layout chưa được hỗ trợ.");
  const parsed = layout.schema.safeParse(document.data); if (!parsed.success || parsed.data.kind !== document.key) throw new Error("Dữ liệu layout không hợp lệ.");
  const body = parsed.data.kind === "editorial" ? serializeEditorial(parsed.data) : parsed.data.kind === "photo-story" ? serializePhoto(parsed.data) : serializeProduct(parsed.data);
  return `<article data-ms-article-layout="${document.key}" data-ms-layout-version="${document.version}"><section data-ms-slot="introduction"><div data-ms-richtext="content">${sanitizeArticleRichText(parsed.data.introduction)}</div></section>${body}</article>`;
}

function parseNarrative(node: ElementNode) {
  if (!exactAttrs(node, ["data-ms-block", "data-ms-block-id", "data-ms-image-side"])) throw new Error("Thuộc tính section không hợp lệ.");
  const figure = elements(node).find((item) => item.tagName === "figure"); const image = figure ? imageFigure(figure) : { url: "", alt: "", caption: "" };
  return { id: attr(node, "data-ms-block-id") ?? "", type: "section" as const, title: text(byAttr(node, "data-ms-field", "title")), body: rich(byAttr(node, "data-ms-richtext", "body")), imageUrl: image.url, imageAlt: image.alt, caption: image.caption, imageSide: attr(node, "data-ms-image-side") ?? "" };
}
function parseDocumentData(root: ElementNode, key: string) {
  const intro = byAttr(root, "data-ms-slot", "introduction"); if (!intro || !exactAttrs(intro, ["data-ms-slot"])) throw new Error("Thiếu introduction.");
  const introduction = rich(byAttr(intro, "data-ms-richtext", "content")); const children = elements(root).filter((node) => node !== intro);
  if (key === "editorial") return { kind: "editorial" as const, introduction, sections: children.map((node) => {
    const block = attr(node, "data-ms-block"); if (block === "section") return parseNarrative(node);
    if (block === "quote" && exactAttrs(node, ["data-ms-block", "data-ms-block-id"])) return { id: attr(node, "data-ms-block-id") ?? "", type: "quote" as const, quote: text(byAttr(node, "data-ms-field", "quote")), attribution: text(byAttr(node, "data-ms-field", "attribution")) };
    throw new Error("Block Editorial không được hỗ trợ.");
  }) };
  if (key === "photo-story") return { kind: "photo-story" as const, introduction, chapters: children.map((node) => {
    if (attr(node, "data-ms-block") !== "photo-chapter" || !exactAttrs(node, ["data-ms-block", "data-ms-block-id", "data-ms-variant"])) throw new Error("Photo chapter không hợp lệ.");
    const gallery = byAttr(node, "data-ms-gallery", "images"); if (!gallery || !exactAttrs(gallery, ["data-ms-gallery"])) throw new Error("Gallery không hợp lệ.");
    return { id: attr(node, "data-ms-block-id") ?? "", heading: text(byAttr(node, "data-ms-field", "heading")), body: rich(byAttr(node, "data-ms-richtext", "body")), variant: attr(node, "data-ms-variant") ?? "", images: elements(gallery).map((figure) => ({ id: attr(figure, "data-ms-image-id") ?? "", ...imageFigure(figure) })) };
  }) };
  if (key === "product-story") {
    const highlight = children.find((node) => attr(node, "data-ms-slot") === "product-highlight"); const benefits = children.find((node) => attr(node, "data-ms-slot") === "benefits");
    if (!highlight || !benefits || !exactAttrs(highlight, ["data-ms-slot"]) || !exactAttrs(benefits, ["data-ms-slot"])) throw new Error("Thiếu product highlight hoặc benefits.");
    const image = elements(highlight).find((item) => item.tagName === "img"); const imageUrl = image ? attr(image, "src") ?? "" : ""; if (imageUrl && !isSafeArticleImageUrl(imageUrl)) throw new Error("URL ảnh không an toàn.");
    const cta = byAttr(highlight, "data-ms-field", "cta");
    return { kind: "product-story" as const, introduction, sections: children.filter((node) => attr(node, "data-ms-block") === "section").map(parseNarrative), highlight: { title: text(byAttr(highlight, "data-ms-field", "title")), description: text(byAttr(highlight, "data-ms-field", "description")), imageUrl, imageAlt: image ? attr(image, "alt") ?? "" : "", ctaLabel: text(cta), ctaHref: cta ? attr(cta, "href") ?? "" : "" }, benefits: elements(benefits).map((node) => ({ id: attr(node, "data-ms-block-id") ?? "", title: text(byAttr(node, "data-ms-field", "title")), description: text(byAttr(node, "data-ms-field", "description")) })) };
  }
  throw new Error("Layout không được hỗ trợ.");
}

export function parseArticleContent(raw: string): ArticleParseResult {
  try {
    const fragment = parseFragment(raw); const roots = elements(fragment); const root = roots.length === 1 && roots[0]?.tagName === "article" ? roots[0] : undefined;
    if (!root || attr(root, "data-ms-article-layout") === undefined) return { status: "legacy", raw, reason: "Bài viết HTML cơ bản từ Phase 7.1." };
    if (!hasOnlyKnownAttributes(root)) return { status: "invalid", raw, reason: "Envelope chứa thuộc tính HTML không được phép." };
    if (!exactAttrs(root, ["data-ms-article-layout", "data-ms-layout-version"])) return { status: "invalid", raw, reason: "Envelope chứa thuộc tính không được phép." };
    const key = attr(root, "data-ms-article-layout") ?? ""; const version = Number(attr(root, "data-ms-layout-version")); const layout = getArticleLayout(key, version);
    if (!layout) return { status: "unsupported", raw, key, version: Number.isFinite(version) ? version : undefined, reason: `Layout ${key || "không xác định"}@${Number.isFinite(version) ? version : "?"} chưa được hỗ trợ.` };
    const parsed = layout.schema.safeParse(parseDocumentData(root, key)); if (!parsed.success) return { status: "invalid", raw, reason: parsed.error.issues[0]?.message ?? "Dữ liệu layout không hợp lệ." };
    return { status: "supported", raw, document: { key: layout.key, version: layout.version, data: parsed.data } as ArticleLayoutDocument };
  } catch (error) { return { status: "invalid", raw, reason: error instanceof Error ? error.message : "Không thể đọc nội dung layout." }; }
}

export function articleDocumentHasContent(document: ArticleLayoutDocument) {
  const html = serializeArticleDocument(document); return sanitizeArticleRichText(html).replace(/<[^>]+>/g, "").trim().length > 0 || /<img\b/i.test(html);
}
