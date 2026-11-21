import sanitizeHtmlLibrary from "sanitize-html";

const EDITOR_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "s", "strike", "ul", "ol", "li", "blockquote", "br", "a", "code", "pre", "hr"]);
const COMPLEX_MARKERS = /(?:\bdata-(?:block|type|layout|widget)\s*=|\bclass\s*=\s*["'][^"']*(?:ck-|ckeditor|image|table|media|widget)|\bstyle\s*=|<!--|<\/?(?:img|figure|figcaption|table|thead|tbody|tfoot|tr|td|th|iframe|video|audio|svg|math|div|section|article|aside|details|summary)\b)/i;

export function isMeaningfulPostHtml(html: string) {
  const text = sanitizeHtmlLibrary(html, { allowedTags: [], allowedAttributes: {} }).replace(/&nbsp;/gi, " ").trim();
  return text.length > 0;
}

export function isSafeLinkHref(value: string) {
  const href = value.trim();
  if (!href) return false;
  if (href.startsWith("/") || href.startsWith("#")) return true;
  try { const url = new URL(href); return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:" || url.protocol === "tel:"; }
  catch { return false; }
}

export function inspectEditorCompatibility(html: string): { compatible: boolean; reason?: string } {
  if (COMPLEX_MARKERS.test(html)) return { compatible: false, reason: "Bài viết chứa cấu trúc HTML chưa được editor hiện tại hỗ trợ; chỉnh sửa nội dung cần Phase 7.2 hoặc công cụ tương thích." };
  const tags = [...html.matchAll(/<\/?([a-z][\w-]*)\b/gi)].map((match) => match[1].toLowerCase());
  if (tags.some((tag) => !EDITOR_TAGS.has(tag))) return { compatible: false, reason: "Bài viết chứa thẻ HTML chưa được editor hiện tại hỗ trợ; nội dung được khóa để tránh mất dữ liệu." };
  if (/\son[a-z]+\s*=|(?:href|src)\s*=\s*["']\s*(?:javascript|data):/i.test(html)) return { compatible: false, reason: "Nội dung chứa thuộc tính hoặc URL không an toàn và không thể chỉnh sửa bằng editor cơ bản." };
  return { compatible: true };
}

export function sanitizePostHtml(html: string) {
  return sanitizeHtmlLibrary(html, {
    allowedTags: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "s", "ul", "ol", "li", "blockquote", "br", "a", "code", "pre", "hr", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: { a: (_tag, attrs) => ({ tagName: "a", attribs: { ...attrs, ...(attrs.target === "_blank" ? { rel: "noopener noreferrer" } : {}) } }) },
  });
}
