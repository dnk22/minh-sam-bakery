import sanitizeHtml from "sanitize-html";
import { isSafeArticleLink } from "../contracts/article-layout.ts";

export function sanitizeArticleRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "b", "em", "i", "s", "ul", "ol", "li", "blockquote", "br", "a", "code", "pre"],
    allowedAttributes: { a: ["href", "target", "rel"] }, allowedSchemes: ["http", "https"], allowProtocolRelative: false,
    transformTags: { a: (_tag, attrs) => isSafeArticleLink(attrs.href ?? "") ? { tagName: "a", attribs: { href: attrs.href, ...(attrs.target === "_blank" ? { target: "_blank", rel: "noopener noreferrer" } : {}) } } : { tagName: "span", attribs: {} } },
  });
}
