import { Reveal } from "@/landing/components/motion/reveal";
import { ScrollParallax } from "@/landing/components/motion/scroll-parallax";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[96vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-primary text-on-primary -mt-20 pt-24 px-6 md:px-12 lg:px-20 pb-10">
      <div className="absolute inset-0 z-0">
        <ScrollParallax
          className="w-full h-full bg-cover bg-center opacity-40 scale-105"
          dataAlt="Cinematic still life of artisanal mooncakes resting inside an ornate dark lacquered wooden gift box with red silk trim, accompanied by a steaming antique cast iron teapot and porcelain tea bowls on dark weathered teak wood."
          fromScale={1.05}
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8HNQOYqCo5LQ-SKBP8PYiIROr_7u7x9DEPGhjM1HKSkgjqM6YQN4TX1DMma1PcwTmvb3I3SxcUiam3NG6XfJXm3dtZLaMlGYjhjDFskmXeig6vm9O5M3aWD9pdYh27ErXSIyuMHBDxcUQAZJUTGuto-YR8pUEoeXe8jHHGkCvr-Z0bdEwVPjCMIkkEd_nK-Gx9ihH1tTbJ3wHxBwpI6p84XYr2JjA1L3cllyTl48rTm3Zkgc1B-Zv')" }}
          toScale={1.095}
          toY={38}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/60" />
      </div>
      <Reveal className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-6" delay={0.02} enterOnMount y={12}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
          <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed-dim tracking-[0.25em]">Hà Nội • Hương vị di sản</span>
        </div>
      </Reveal>
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-12">
        <div className="lg:col-span-8 flex flex-col justify-center">
          <Reveal delay={0.08} enterOnMount y={16}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.3em] uppercase bg-primary-container/80 px-3 py-1 rounded">Minh Sâm Bakery • Thương hiệu bánh thủ công Hà Nội</span>
            </div>
          </Reveal>
          <Reveal delay={0.14} enterOnMount y={18}>
            <h1 className="font-display-hero text-display-hero md:text-[56px] text-secondary-fixed font-normal leading-[1.12] mb-6 max-w-3xl">
              Tinh hoa bánh Việt cho những khoảnh khắc hôm nay.
            </h1>
          </Reveal>
          <Reveal delay={0.21} enterOnMount y={18}>
            <p className="font-body-lg text-body-lg text-secondary-fixed-dim/90 max-w-xl mb-10 leading-relaxed">
              Từ những hương vị truyền thống đến những dòng bánh mới cho nhịp sống hiện đại, gìn giữ trọn vẹn tinh thần thủ công Hà Thành qua từng thớ bột, khuôn gỗ và tâm huyết người thợ.
            </p>
          </Reveal>
          <Reveal delay={0.28} enterOnMount y={18}>
            <div className="flex flex-wrap items-center gap-5">
              <a className="inline-flex items-center justify-center px-8 py-4 bg-secondary-fixed text-on-secondary-fixed font-label-ui text-label-ui tracking-wider uppercase rounded hover:bg-secondary-fixed-dim transition-all duration-300 shadow-lg shadow-black/30" href="#danh-muc">Khám phá các dòng bánh</a>
              <a className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-secondary-fixed font-label-ui text-label-ui tracking-wider uppercase rounded hover:bg-primary-container/80 transition-all duration-300" href="#cau-chuyen">Về Minh Sâm</a>
            </div>
          </Reveal>
        </div>
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end text-right">
          <Reveal className="max-w-xs" delay={0.25} enterOnMount x={20} y={0}>
            <div className="p-6 bg-primary-container/50 backdrop-blur-md rounded max-w-xs shadow-xl">
              <span className="block font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed-dim tracking-[0.2em] mb-2">Bộ Sưu Tập Giới Hạn</span>
              <p className="font-headline-sm text-headline-sm text-secondary-fixed mb-2">Hương Cốm Đầu Mùa</p>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80">Lớp nếp dẻo thơm dịu nướng chậm cùng lá chanh vườn cũ, ngọt thanh cốt cách người Tràng An.</p>
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between pt-4" delay={0.36} enterOnMount y={12}>
        <div className="flex items-center gap-3">
          <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.2em] uppercase">01 / 07</span>
          <span className="w-8 h-[1px] bg-secondary-fixed/40" />
          <span className="hero-scroll-hint font-label-eyebrow text-label-eyebrow text-secondary-fixed-dim/70 uppercase">Cuộn để khám phá theo từng chương ↓</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-8 h-1 bg-secondary-fixed rounded-full" />
          <span className="w-2 h-1 bg-secondary-fixed/30 rounded-full" />
          <span className="w-2 h-1 bg-secondary-fixed/30 rounded-full" />
          <span className="w-2 h-1 bg-secondary-fixed/30 rounded-full" />
        </div>
      </Reveal>
    </section>
  );
}
