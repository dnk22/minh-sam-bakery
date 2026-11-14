import { Reveal } from "@/landing/components/motion/reveal";
import { ScrollParallax } from "@/landing/components/motion/scroll-parallax";
import Link from "next/link";
import { routes } from "@/landing/lib/routes";

export function HeroSection() {
  return (
    <section className="relative -mt-[var(--landing-header-height)] flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-primary px-5 pt-[calc(var(--landing-header-height)+1rem)] pb-6 text-on-primary sm:px-6 sm:pb-8 md:px-12 lg:min-h-screen lg:px-20 lg:pt-24 lg:pb-10">
      <div className="absolute inset-0 z-0">
        <ScrollParallax
          className="h-full w-full scale-105 bg-cover bg-[position:58%_center] opacity-40 sm:bg-center"
          dataAlt="Cinematic still life of artisanal mooncakes resting inside an ornate dark lacquered wooden gift box with red silk trim, accompanied by a steaming antique cast iron teapot and porcelain tea bowls on dark weathered teak wood."
          fromScale={1.05}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8HNQOYqCo5LQ-SKBP8PYiIROr_7u7x9DEPGhjM1HKSkgjqM6YQN4TX1DMma1PcwTmvb3I3SxcUiam3NG6XfJXm3dtZLaMlGYjhjDFskmXeig6vm9O5M3aWD9pdYh27ErXSIyuMHBDxcUQAZJUTGuto-YR8pUEoeXe8jHHGkCvr-Z0bdEwVPjCMIkkEd_nK-Gx9ihH1tTbJ3wHxBwpI6p84XYr2JjA1L3cllyTl48rTm3Zkgc1B-Zv')",
          }}
          toScale={1.095}
          toY={38}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/60" />
      </div>
      <Reveal
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between pt-0 lg:pt-6"
        delay={0.02}
        enterOnMount
        y={12}
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="size-2 shrink-0 rounded-full bg-secondary-fixed" />
          <span className="font-label-eyebrow text-[10px] uppercase tracking-[0.2em] text-secondary-fixed-dim sm:text-label-eyebrow sm:tracking-[0.25em]">
            Hà Nội • Hương vị di sản
          </span>
        </div>
      </Reveal>
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-7xl grid-cols-1 gap-6 py-6 sm:py-8 lg:grid-cols-12 lg:gap-8 lg:py-12">
        <div className="flex flex-col justify-center lg:col-span-8">
          <Reveal delay={0.08} enterOnMount y={16}>
            <div className="mb-3 inline-flex max-w-full items-center gap-2 sm:mb-4">
              <span className="rounded lg:bg-primary-container/80 px-2.5 py-1 font-label-eyebrow text-[10px] uppercase tracking-[0.2em] text-secondary-fixed sm:px-3 sm:text-label-eyebrow sm:tracking-[0.3em]">
                Minh Sâm Bakery • Thương hiệu bánh thủ công Hà Nội
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.14} enterOnMount y={18}>
            <h1 className="mb-4 max-w-3xl text-pretty font-display-hero text-[clamp(1.95rem,8.5vw,2.625rem)] leading-[1.14] font-normal text-secondary-fixed sm:mb-5 sm:text-[clamp(2.25rem,7vw,3rem)] md:text-[48px] lg:mb-6 lg:text-display-hero lg:leading-[1.12]">
              Tinh hoa bánh Việt cho những khoảnh khắc hôm nay.
            </h1>
          </Reveal>
          <Reveal delay={0.21} enterOnMount y={18}>
            <p className="mb-6 max-w-xl font-body-md text-body-md leading-[22px] text-secondary-fixed-dim/90 md:mb-8 md:font-body-lg md:text-body-lg md:leading-relaxed lg:mb-10">
              Từ những hương vị truyền thống đến những dòng bánh mới cho nhịp
              sống hiện đại, gìn giữ trọn vẹn tinh thần thủ công Hà Thành qua
              từng thớ bột, khuôn gỗ và tâm huyết người thợ.
            </p>
          </Reveal>
          <Reveal delay={0.28} enterOnMount y={18}>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <a
                className="inline-flex min-h-11 w-full items-center justify-center rounded bg-secondary-fixed px-6 py-3 font-label-ui text-label-ui uppercase tracking-wider text-on-secondary-fixed shadow-lg shadow-black/30 transition-all duration-300 hover:bg-secondary-fixed-dim sm:w-auto lg:px-8 lg:py-4"
                href="#danh-muc"
              >
                Khám phá các dòng bánh
              </a>
              <Link
                className="inline-flex min-h-11 w-full items-center justify-center rounded px-6 py-3 font-label-ui text-label-ui uppercase tracking-wider text-secondary-fixed transition-colors hover:bg-primary-container/80 sm:w-auto lg:px-8 lg:py-4"
                href={routes.about}
              >
                Về Minh Sâm
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end text-right">
          <Reveal className="max-w-xs" delay={0.25} enterOnMount x={20} y={0}>
            <div className="p-6 bg-primary-container/50 backdrop-blur-md rounded max-w-xs shadow-xl">
              <span className="block font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed-dim tracking-[0.2em] mb-2">
                Bộ Sưu Tập Giới Hạn
              </span>
              <p className="font-headline-sm text-headline-sm text-secondary-fixed mb-2">
                Hương Cốm Đầu Mùa
              </p>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80">
                Lớp nếp dẻo thơm dịu nướng chậm cùng lá chanh vườn cũ, ngọt
                thanh cốt cách người Tràng An.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal
        className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 pt-2 sm:pt-3 lg:pt-4"
        delay={0.36}
        enterOnMount
        y={12}
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="h-px w-6 shrink-0 bg-secondary-fixed/40 sm:w-8" />
          <span className="hero-scroll-hint font-label-eyebrow text-[9px] uppercase tracking-[0.14em] text-secondary-fixed-dim/70 sm:text-label-eyebrow sm:tracking-normal">
            Cuộn để khám phá theo từng chương ↓
          </span>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="w-8 h-1 bg-secondary-fixed rounded-full" />
          <span className="w-2 h-1 bg-secondary-fixed/30 rounded-full" />
          <span className="w-2 h-1 bg-secondary-fixed/30 rounded-full" />
          <span className="w-2 h-1 bg-secondary-fixed/30 rounded-full" />
        </div>
      </Reveal>
    </section>
  );
}
