"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { bannerRenderMode } from "../../banner-data";
import type { BannerFallback, LandingBanner } from "../../types";
import styles from "./banner-media.module.css";

type BannerMediaProps = {
  banners: LandingBanner[];
  fallback: BannerFallback;
  className?: string;
  imageClassName?: string;
  linkMedia?: boolean;
  priority?: boolean;
};

function Picture({ desktop, mobile, alt, imageClassName, eager, onError }: {
  desktop: string;
  mobile?: string | null;
  alt: string;
  imageClassName?: string;
  eager?: boolean;
  onError?: () => void;
}) {
  return <picture className="block h-full w-full">
    {mobile ? <source media="(max-width: 767px)" srcSet={mobile} /> : null}
    <img alt={alt} className={imageClassName ?? "h-full w-full object-cover"} decoding="async" fetchPriority={eager ? "high" : "auto"} loading={eager ? "eager" : "lazy"} onError={onError} src={desktop} />
  </picture>;
}

function Media({ banner, fallback, failed, imageClassName, eager, linkMedia, onError }: {
  banner?: LandingBanner;
  fallback: BannerFallback;
  failed: boolean;
  imageClassName?: string;
  eager?: boolean;
  linkMedia: boolean;
  onError?: () => void;
}) {
  const picture = <Picture
    alt={banner && !failed ? banner.title : fallback.alt}
    desktop={banner && !failed ? banner.desktopImageUrl : fallback.desktopImageUrl}
    eager={eager}
    imageClassName={imageClassName}
    mobile={banner && !failed ? banner.mobileImageUrl : fallback.mobileImageUrl}
    onError={banner && !failed ? onError : undefined}
  />;
  if (!banner?.link || failed || !linkMedia) return picture;
  const external = banner.link.startsWith("http://") || banner.link.startsWith("https://");
  return <a aria-label={banner.title} className={styles.mediaLink} href={banner.link} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined}>{picture}</a>;
}

export function BannerMedia({ banners, fallback, className, imageClassName, linkMedia = true, priority = false }: BannerMediaProps) {
  const mode = bannerRenderMode(banners.length);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const touchStart = useRef<number | null>(null);
  const multiple = mode === "carousel";

  useEffect(() => {
    if (!multiple || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % banners.length), 6_000);
    return () => window.clearInterval(timer);
  }, [banners.length, multiple, paused]);

  const previous = () => setIndex((current) => (current - 1 + banners.length) % banners.length);
  const next = () => setIndex((current) => (current + 1) % banners.length);
  const markFailed = (id: string) => setFailed((current) => new Set(current).add(id));

  if (mode === "fallback") return <div className={`${styles.root} ${className ?? "h-full w-full"}`}><Media failed={false} fallback={fallback} imageClassName={imageClassName} linkMedia={false} eager={priority} /></div>;

  return <div
    aria-label={multiple ? "Banner nổi bật" : undefined}
    aria-roledescription={multiple ? "carousel" : undefined}
    className={`${styles.root} ${className ?? "h-full w-full"}`}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    onFocus={() => setPaused(true)}
    onKeyDown={(event) => { if (!multiple) return; if (event.key === "ArrowLeft") previous(); if (event.key === "ArrowRight") next(); }}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onTouchEnd={(event) => {
      if (!multiple || touchStart.current === null) return;
      const distance = event.changedTouches[0]?.clientX ?? 0;
      if (Math.abs(distance - touchStart.current) > 40) {
        if (distance < touchStart.current) next();
        else previous();
      }
      touchStart.current = null;
    }}
    onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
    role={multiple ? "region" : undefined}
  >
    {banners.map((banner, bannerIndex) => <div aria-hidden={bannerIndex !== index} className={`${styles.slide} ${bannerIndex === index ? styles.active : ""}`} key={banner.id}>
      <Media banner={banner} eager={priority && bannerIndex === 0} failed={failed.has(banner.id)} fallback={fallback} imageClassName={imageClassName} linkMedia={linkMedia} onError={() => markFailed(banner.id)} />
    </div>)}
    {multiple ? <>
      <div className={styles.controls}>
        <button aria-label="Banner trước" className={styles.control} onClick={previous} type="button"><ChevronLeft aria-hidden="true" className="size-5" /></button>
        <button aria-label="Banner tiếp theo" className={styles.control} onClick={next} type="button"><ChevronRight aria-hidden="true" className="size-5" /></button>
      </div>
      <div aria-label="Chọn banner" className={styles.indicators} role="group">
        {banners.map((banner, bannerIndex) => <button aria-label={`Xem banner ${bannerIndex + 1}: ${banner.title}`} aria-current={bannerIndex === index ? "true" : undefined} className={`${styles.indicator} ${bannerIndex === index ? styles.indicatorActive : ""}`} key={banner.id} onClick={() => setIndex(bannerIndex)} type="button" />)}
      </div>
    </> : null}
  </div>;
}
