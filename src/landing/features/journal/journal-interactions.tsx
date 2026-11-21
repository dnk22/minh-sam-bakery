/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { JournalCard } from "./types";

export function FeaturedStoryCarousel({ articles }: { articles: JournalCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(articles.length - 1, 0));
  const article = articles[safeIndex];
  if (!article) return null;
  const move = (direction: number) => setActiveIndex((current) => (current + direction + articles.length) % articles.length);

  return <div><div className="mb-8 flex items-center justify-between border-b border-outline-variant/40 pb-6"><div className="flex items-center gap-3"><BookOpen className="size-5 text-secondary" /><span className="font-headline-sm text-headline-sm uppercase tracking-wider text-primary">Tiêu điểm mới nhất</span></div><div className="flex items-center gap-5"><span className="font-price-serif text-price-serif text-primary">{String(safeIndex + 1).padStart(2, "0")} <i className="font-body-sm not-italic text-outline-variant">/</i> {String(articles.length).padStart(2, "0")}</span>{articles.length > 1 ? <div className="flex gap-2"><button aria-label="Bài trước" className="flex size-10 items-center justify-center rounded-full bg-surface-container text-primary" onClick={() => move(-1)} type="button"><ArrowLeft className="size-[18px]" /></button><button aria-label="Bài kế tiếp" className="flex size-10 items-center justify-center rounded-full bg-primary text-on-primary" onClick={() => move(1)} type="button"><ArrowRight className="size-[18px]" /></button></div> : null}</div></div><article className="grid overflow-hidden rounded-xl bg-surface-container-low shadow-sm lg:grid-cols-12"><div className="relative min-h-72 overflow-hidden bg-surface-container lg:col-span-7">{article.thumbnailUrl ? <img alt={article.title} className="absolute inset-0 size-full object-cover transition-transform duration-700 hover:scale-[1.02]" src={article.thumbnailUrl} /> : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-surface-bright"><BookOpen className="size-14 opacity-70" /></div>}</div><div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-5"><div className="mb-4 flex flex-wrap items-center gap-3 font-body-sm text-body-sm text-on-surface-variant">{article.publishedLabel ? <time dateTime={article.publishedAt ?? undefined}>{article.publishedLabel}</time> : null}<span className="font-medium text-secondary">{article.author}</span></div><h2 className="font-headline-lg text-headline-md tracking-tight text-primary md:text-headline-lg"><Link href={article.href}>{article.title}</Link></h2>{article.excerpt ? <p className="mt-4 line-clamp-4 font-body-lg text-body-lg leading-relaxed text-on-surface-variant">{article.excerpt}</p> : null}<Link className="mt-8 inline-flex items-center gap-2 font-label-ui text-label-ui uppercase tracking-wider text-primary hover:text-secondary" href={article.href}>Đọc toàn bộ câu chuyện <ArrowRight className="size-[18px]" /></Link></div></article></div>;
}

export function ArticleShareActions({ title }: { title: string }) {
  const [feedback, setFeedback] = useState<"copy" | "share" | null>(null);
  async function copyUrl(mode: "copy" | "share") { await navigator.clipboard?.writeText(window.location.href); setFeedback(mode); window.setTimeout(() => setFeedback(null), 1800); }
  async function share() { if (navigator.share) { try { await navigator.share({ title, url: window.location.href }); return; } catch { /* user cancelled */ } } await copyUrl("share"); }
  return <div className="flex flex-wrap items-center gap-2"><button className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 font-label-ui text-label-ui text-on-surface-variant" onClick={() => void copyUrl("copy")} type="button">{feedback === "copy" ? <Check className="size-4" /> : <Copy className="size-4" />}<span>{feedback === "copy" ? "Đã sao chép" : "Sao chép"}</span></button><button className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 font-label-ui text-label-ui text-on-surface-variant" onClick={() => void share()} type="button">{feedback === "share" ? <Check className="size-4" /> : <Share2 className="size-4" />}<span>{feedback === "share" ? "Đã sao chép" : "Chia sẻ"}</span></button></div>;
}
