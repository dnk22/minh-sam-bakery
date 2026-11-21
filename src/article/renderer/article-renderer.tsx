import type { ArticleLayoutDocument, ArticlePresentation, EditorialData, PhotoStoryData, ProductStoryData } from "../contracts/article-layout";
import { sanitizeArticleRichText } from "../html/article-sanitize";
import styles from "./article-renderer.module.css";

export type ArticleRendererProps = { document: ArticleLayoutDocument; presentation: ArticlePresentation; resolveImageUrl?: (url: string) => string };
const Rich = ({ html }: { html: string }) => <div className={styles.rich} dangerouslySetInnerHTML={{ __html: sanitizeArticleRichText(html) }} />;
function ArticleImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // The shared renderer accepts runtime public/CDN URLs; Phase 7.3 supplies the public resolver.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
const ImageFigure = ({ url, alt, caption, resolve }: { url: string; alt: string; caption: string; resolve: (value: string) => string }) => url ? <figure><ArticleImage src={resolve(url)} alt={alt} />{caption ? <figcaption>{caption}</figcaption> : null}</figure> : null;
function Shell({ presentation, resolve, children, variant }: { presentation: ArticlePresentation; resolve: (value: string) => string; children: React.ReactNode; variant: string }) {
  return <article className={styles.shell} data-article-layout={variant}><header className={styles.header}><p className={styles.eyebrow}>Minh Sâm Journal</p><h1>{presentation.title || "Bài viết chưa có tiêu đề"}</h1>{presentation.excerpt ? <p className={styles.excerpt}>{presentation.excerpt}</p> : null}<div className={styles.meta}>{presentation.author ? <span>{presentation.author}</span> : null}{presentation.publishedAt ? <time dateTime={presentation.publishedAt}>{presentation.publishedLabel ?? presentation.publishedAt}</time> : null}</div>{presentation.coverUrl ? <ArticleImage className={styles.cover} src={resolve(presentation.coverUrl)} alt={presentation.coverAlt || presentation.title} /> : null}</header>{children}</article>;
}
function Editorial({ data, presentation, resolve }: { data: EditorialData; presentation: ArticlePresentation; resolve: (url: string) => string }) {
  const titled = data.sections.filter((item) => item.type === "section" && item.title);
  return <Shell presentation={presentation} resolve={resolve} variant="editorial"><div className={styles.editorialGrid}>{titled.length ? <nav className={styles.toc} aria-label="Mục lục"><strong>Nội dung</strong>{titled.map((item) => <a key={item.id} href={`#ms-${item.id}`}>{item.type === "section" ? item.title : ""}</a>)}</nav> : null}<div className={styles.reading}><Rich html={data.introduction} />{data.sections.map((item) => item.type === "quote" ? <blockquote className={styles.quote} key={item.id}><p>{item.quote}</p>{item.attribution ? <cite>{item.attribution}</cite> : null}</blockquote> : <section className={styles.narrative} data-image-side={item.imageSide} id={`ms-${item.id}`} key={item.id}><div>{item.title ? <h2>{item.title}</h2> : null}<Rich html={item.body} /></div><ImageFigure url={item.imageUrl} alt={item.imageAlt} caption={item.caption} resolve={resolve} /></section>)}</div></div></Shell>;
}
function PhotoStory({ data, presentation, resolve }: { data: PhotoStoryData; presentation: ArticlePresentation; resolve: (url: string) => string }) {
  return <Shell presentation={presentation} resolve={resolve} variant="photo-story"><div className={styles.photoIntro}><Rich html={data.introduction} /></div><div className={styles.chapters}>{data.chapters.map((chapter, index) => <section className={styles.chapter} data-variant={chapter.variant} key={chapter.id}><div className={styles.chapterText}><span>{String(index + 1).padStart(2, "0")}</span>{chapter.heading ? <h2>{chapter.heading}</h2> : null}<Rich html={chapter.body} /></div><div className={styles.gallery}>{chapter.images.map((image) => <ImageFigure key={image.id} url={image.url} alt={image.alt} caption={image.caption} resolve={resolve} />)}</div></section>)}</div></Shell>;
}
function ProductStory({ data, presentation, resolve }: { data: ProductStoryData; presentation: ArticlePresentation; resolve: (url: string) => string }) {
  const highlight = data.highlight;
  return <Shell presentation={presentation} resolve={resolve} variant="product-story"><div className={styles.productIntro}><Rich html={data.introduction} /></div>{data.sections.map((item) => <section className={styles.productNarrative} data-image-side={item.imageSide} key={item.id}><ImageFigure url={item.imageUrl} alt={item.imageAlt} caption={item.caption} resolve={resolve} /><div>{item.title ? <h2>{item.title}</h2> : null}<Rich html={item.body} /></div></section>)}{(highlight.title || highlight.description || highlight.imageUrl) ? <section className={styles.highlight}><ImageFigure url={highlight.imageUrl} alt={highlight.imageAlt} caption="" resolve={resolve} /><div><p className={styles.eyebrow}>Sản phẩm nổi bật</p>{highlight.title ? <h2>{highlight.title}</h2> : null}{highlight.description ? <p>{highlight.description}</p> : null}{highlight.ctaHref && highlight.ctaLabel ? <a className={styles.cta} href={highlight.ctaHref}>{highlight.ctaLabel}</a> : null}</div></section> : null}{data.benefits.length ? <section className={styles.benefits}>{data.benefits.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p></article>)}</section> : null}</Shell>;
}
export function ArticleRenderer({ document, presentation, resolveImageUrl = (url) => url }: ArticleRendererProps) {
  if (document.data.kind === "editorial") return <Editorial data={document.data} presentation={presentation} resolve={resolveImageUrl} />;
  if (document.data.kind === "photo-story") return <PhotoStory data={document.data} presentation={presentation} resolve={resolveImageUrl} />;
  return <ProductStory data={document.data} presentation={presentation} resolve={resolveImageUrl} />;
}
