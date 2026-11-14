/* eslint-disable @next/next/no-img-element */
import { BadgeCheck, Quote } from "lucide-react";

import { aboutContent } from "../data/about-content";

export function BrandJourneySection() {
  const content = aboutContent.journey;
  return (
    <section className="relative w-full scroll-mt-[var(--landing-header-height)] bg-surface-container-low py-space-xl lg:py-28" id="chuong-02">
      <div className="mx-auto max-w-7xl px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex items-center gap-space-md pb-space-lg"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">02 / HÀNH TRÌNH MINH SÂM</span><div className="h-px flex-1 bg-surface-variant" /></div>
        <div className="grid grid-cols-1 items-start gap-gutter-desktop lg:grid-cols-12">
          <div className="space-y-space-md lg:col-span-5"><h2 className="font-headline-lg text-headline-md tracking-tight text-primary lg:text-headline-lg">{content.title}</h2><blockquote className="space-y-space-xs rounded-lg bg-surface-container p-space-lg shadow-sm"><Quote className="size-7 text-secondary" /><p className="font-headline-sm text-subheading leading-relaxed font-medium italic text-primary">{content.quote}</p><cite className="block pt-space-xs font-label-eyebrow text-label-eyebrow not-italic uppercase tracking-widest text-secondary">{content.quoteSource}</cite></blockquote><div className="space-y-space-xs pt-space-md"><div className="flex items-center gap-space-xs text-secondary"><BadgeCheck className="size-[18px]" /><span className="font-label-ui text-label-ui font-medium">{content.annotationTitle}</span></div><p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{content.annotation}</p></div></div>
          <div className="flex flex-col space-y-space-lg lg:col-span-7"><figure className="relative rounded-lg bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg"><div className="relative aspect-[16/10] overflow-hidden bg-surface-container"><img alt={content.image.alt} className="h-full w-full object-cover" src={content.image.src} /></div><figcaption className="mt-space-md flex flex-col justify-between gap-space-xs font-body-sm text-body-sm text-outline sm:flex-row sm:items-center"><span className="font-mono text-label-eyebrow uppercase text-secondary">Hiện vật số 02 — Góc Trà &amp; Bánh Phố Cổ</span><span className="font-serif italic">Ký ức bên chiếc bàn gỗ lim mộc mạc</span></figcaption></figure><div className="grid grid-cols-1 gap-gutter font-body-md text-body-md leading-relaxed text-on-surface-variant md:grid-cols-2"><p><span className="float-left pr-space-sm pt-1 font-serif text-display-hero leading-none text-primary">H</span>{content.paragraphs[0].slice(1)}</p><p>{content.paragraphs[1]}</p></div></div>
        </div>
      </div>
    </section>
  );
}
