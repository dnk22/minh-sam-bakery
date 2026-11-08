/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { articleHref, articles } from "./data";

const featuredSlides = [articles[0], articles[3], articles[1], articles[4]];

export function FeaturedStoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const article = featuredSlides[activeIndex];
  const move = (direction: number) => setActiveIndex((current) => (current + direction + featuredSlides.length) % featuredSlides.length);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-outline-variant/40 pb-6">
        <div className="flex items-center gap-3"><BookOpen className="size-5 text-secondary" /><span className="font-headline-sm text-headline-sm text-primary uppercase tracking-wider">Tiêu Điểm Tạp Chí</span></div>
        <div className="flex items-center gap-6"><div className="flex items-center gap-2"><span className="font-price-serif text-price-serif text-primary">{String(activeIndex + 1).padStart(2, "0")}</span><span className="font-body-sm text-outline-variant">/</span><span className="font-price-serif text-price-serif text-on-surface-variant">04</span></div><div className="flex items-center gap-2"><button aria-label="Bài trước" className="flex size-9 items-center justify-center rounded-full bg-surface-container text-primary transition-colors hover:bg-surface-container-high" onClick={() => move(-1)} type="button"><ArrowLeft className="size-[18px]" /></button><button aria-label="Bài kế tiếp" className="flex size-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-colors hover:bg-primary-container" onClick={() => move(1)} type="button"><ArrowRight className="size-[18px]" /></button></div></div>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-gutter-desktop lg:grid-cols-12">
        <article className="group flex flex-col overflow-hidden rounded-lg bg-surface-container-low shadow-sm transition-shadow hover:shadow-md lg:col-span-8">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container"><img alt={article.imageAlt} className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]" src={article.coverImage} /><div className="absolute top-4 left-4"><span className="rounded-sm bg-primary/90 px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-surface-bright backdrop-blur-md">{article.category}</span></div><div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-sm bg-surface-container-lowest/90 px-3 py-1 shadow-sm backdrop-blur-md"><span className="font-body-sm text-body-sm text-on-surface">{article.readingLabel}</span></div></div>
          <div className="flex flex-1 flex-col justify-between bg-surface-container-low p-8 md:p-10"><div><div className="mb-3 flex items-center gap-3 font-body-sm text-body-sm text-on-surface-variant"><span>{article.publishedAt}</span><span className="size-1 rounded-full bg-outline" /><span className="font-medium text-secondary">{article.author ?? "Minh Sâm Editorial"}</span></div><h3 className="font-headline-lg text-headline-md tracking-tight text-primary transition-colors group-hover:text-primary-container md:text-headline-lg"><Link href={articleHref(article)}>{article.listingTitle}</Link></h3><p className="mt-4 line-clamp-3 font-body-lg text-body-lg leading-relaxed text-on-surface-variant">{article.listingExcerpt ?? article.excerpt}</p></div><div className="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-6"><Link className="inline-flex items-center gap-2 font-label-ui text-label-ui uppercase tracking-wider text-primary transition-colors group-hover:text-secondary" href={articleHref(article)}>Đọc toàn bộ câu chuyện <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" /></Link><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-surface-variant">Chuyên đề Tết 2026</span></div></div>
        </article>
        <FeaturedSupportingStories />
      </div>
    </div>
  );
}

function FeaturedSupportingStories() {
  return <div className="flex flex-col justify-between gap-gutter lg:col-span-4">{articles.slice(1, 3).map((article) => <article className="group flex flex-1 flex-col rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md" key={article.id}><div className="relative mb-4 h-44 w-full overflow-hidden rounded-sm bg-surface-container"><img alt={article.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={article.coverImage} /><span className="absolute top-3 left-3 rounded-sm bg-tertiary-container/90 px-2.5 py-0.5 font-label-eyebrow text-[10px] uppercase tracking-wider text-tertiary-fixed">{article.category}</span></div><div className="mb-2 flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant"><span>{article.publishedAt}</span><span>•</span><span>{article.readingLabel}</span></div><h4 className="line-clamp-2 font-headline-sm text-headline-sm tracking-tight text-primary transition-colors group-hover:text-primary-container"><Link href={articleHref(article)}>{article.listingTitle}</Link></h4><p className="mt-2 line-clamp-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">{article.excerpt}</p><div className="mt-auto pt-4"><Link className="inline-flex items-center gap-1.5 font-label-ui text-label-ui text-secondary transition-transform group-hover:translate-x-1" href={articleHref(article)}>Chi tiết <ArrowRight className="size-4" /></Link></div></article>)}</div>;
}

export function ArticleShareActions({ title }: { title: string }) {
  const [feedback, setFeedback] = useState<"copy" | "share" | null>(null);

  async function copyUrl(mode: "copy" | "share") {
    await navigator.clipboard?.writeText(window.location.href);
    setFeedback(mode);
    window.setTimeout(() => setFeedback(null), 1800);
  }

  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title, url: window.location.href }); return; } catch { /* cancelled */ }
    }
    await copyUrl("share");
  }

  return <div className="flex items-center gap-2"><button className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 font-label-ui text-label-ui text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary" onClick={() => void copyUrl("copy")} type="button">{feedback === "copy" ? <Check className="size-4" /> : <Copy className="size-4" />}<span>{feedback === "copy" ? "Đã sao chép" : "Sao chép"}</span></button><button className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 font-label-ui text-label-ui text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary" onClick={() => void share()} type="button">{feedback === "share" ? <Check className="size-4" /> : <Share2 className="size-4" />}<span>{feedback === "share" ? "Đã sao chép" : "Chia sẻ"}</span></button></div>;
}

export function BookmarkButton() {
  const [saved, setSaved] = useState(false);
  return <button aria-label={saved ? "Bỏ lưu bài viết" : "Lưu bài viết"} aria-pressed={saved} className={`flex size-9 items-center justify-center rounded-full bg-surface-container text-primary transition-colors hover:bg-surface-container-high ${saved ? "ring-1 ring-secondary" : ""}`} onClick={() => setSaved((current) => !current)} type="button"><Bookmark className={`size-5 ${saved ? "fill-current" : ""}`} /></button>;
}
