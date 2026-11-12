/* eslint-disable @next/next/no-img-element */
import { BookOpenText, ArrowDown } from "lucide-react";

import { aboutContent } from "../data/about-content";

export function AboutHeroSection() {
  const content = aboutContent.hero;
  return (
    <section className="relative w-full overflow-hidden bg-background py-space-xl lg:py-28">
      <div className="mx-auto max-w-7xl px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col items-baseline justify-between gap-space-sm pb-space-lg lg:flex-row">
          <div className="flex flex-wrap items-center gap-space-md"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">{content.eyebrow}</span><span className="h-px w-12 bg-secondary-fixed-dim" /><span className="font-mono font-label-ui text-label-ui text-on-surface-variant">{content.chapter}</span></div>
          <span className="hidden text-right font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-outline lg:block">{content.archive}</span>
        </div>
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
          <div className="relative z-10 flex flex-col space-y-space-lg lg:col-span-6">
            <div className="space-y-space-md"><span className="inline-block rounded bg-surface-container px-space-sm py-1 text-label-eyebrow uppercase tracking-widest text-secondary">{content.badge}</span><h1 className="font-display-hero text-headline-lg leading-[1.12] tracking-tight text-primary lg:text-display-hero">Có những <span className="font-serif font-normal italic text-secondary">hương vị</span> mang theo cả một câu chuyện.</h1></div>
            <div className="h-0.5 w-20 bg-secondary-fixed" />
            <p className="max-w-xl font-subheading text-subheading leading-relaxed font-light text-on-surface-variant">{content.introduction}</p>
            <div className="flex flex-col items-start gap-space-lg pt-space-md sm:flex-row sm:items-center">
              <a className="group inline-flex items-center gap-space-sm rounded bg-primary px-space-lg py-space-md text-on-primary shadow-sm transition-all duration-300 hover:bg-primary-container" href="#chuong-02"><span className="font-label-ui text-label-ui uppercase tracking-wider">Lật từng trang bản thảo</span><ArrowDown className="size-[18px] transition-transform group-hover:translate-y-1" /></a>
              <div className="flex items-center gap-space-xs text-on-surface-variant"><BookOpenText className="size-5 text-secondary" /><span className="font-body-sm text-body-sm italic">{content.note}</span></div>
            </div>
          </div>
          <div className="relative mt-space-lg lg:col-span-6 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none"><div className="absolute -inset-4 rotate-1 rounded-lg bg-surface-container" /><figure className="relative rounded-lg bg-surface-container-lowest p-space-md shadow-xl lg:p-space-lg"><div className="relative aspect-[4/5] overflow-hidden bg-surface-container-high"><img alt={content.image.alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" src={content.image.src} /><figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent p-space-md text-on-primary"><span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary-fixed">Hiện vật lưu trữ • Số 01</span><p className="mt-1 font-body-sm text-body-sm text-surface-bright/90">{content.imageCaption}</p></figcaption></div><div className="mt-space-md flex items-center justify-between gap-3 pt-space-sm text-body-sm text-outline"><span className="font-mono text-label-eyebrow">FIG. 01 / BỘ SƯU TẬP TRĂNG RẰM</span><span className="text-right font-serif italic">Kỷ vật gia đình Minh Sâm</span></div></figure></div>
          </div>
        </div>
      </div>
    </section>
  );
}
