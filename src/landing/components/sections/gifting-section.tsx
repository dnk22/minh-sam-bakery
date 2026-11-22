import { BriefcaseBusiness, UsersRound } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";
import { BannerMedia } from "@/landing/features/banners/components/banner-media/banner-media";
import type { LandingBanner } from "@/landing/features/banners/types";
import { routes } from "@/landing/lib/routes";

const giftingFallback = {
  desktopImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7u8QZ6Uom86vQ1tTLd-m_UAwwSPHo670Z04ZDmhQG5twk3JOAPnWwHZMvcBymQ53ENQoU9SAL5uPCc-e1L20dFgg8vG2oMRfHvuf8XgV8QXCxN8Z42RTMt5ui_ghpoPKRiBedAZtPrGu6SgX8k2fK0Mz7ucSn2RDJtjTFKaoRvB2uLbACvcxrOAwQV-LYx2adyNTnDzk6puYjcqihF9YvNqHY2pIh1ggRcUE2NrRG4uOs4oyyUyr_",
  alt: "Hộp quà Trung thu sơn mài cùng bánh và trà",
};

export function GiftingSection({ banners = [] }: { banners?: LandingBanner[] }) {
  return (
    <section className="relative w-full flex flex-col justify-between overflow-hidden bg-primary-container px-6 py-16 text-on-primary md:px-12 lg:min-h-[calc(100vh-var(--landing-header-height))] lg:px-20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal className="reveal-split-left lg:col-span-6 relative order-2 lg:order-1" scale={1.015} x="var(--reveal-x)" y="var(--reveal-y)">
          <div className="relative rounded overflow-hidden shadow-2xl bg-primary">
            <BannerMedia banners={banners} className="h-[380px] lg:h-[480px]" fallback={giftingFallback} imageClassName="h-full w-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-primary/95 to-transparent text-secondary-fixed md:p-6">
              <span className="font-label-eyebrow font-semibold text-[10px] leading-4 tracking-[0.14em] uppercase block md:text-label-eyebrow md:tracking-[0.18em] lg:tracking-[0.2em]">Ấn Phẩm Tri Ân</span>
              <p className="font-headline-sm font-semibold text-[18px] leading-[1.35] md:text-[19px] md:leading-7 lg:text-headline-sm">Hộp Quà Di Sản Đoan Viên</p>
              <p className="font-body-sm text-[13px] leading-5 text-secondary-fixed-dim/80 md:text-[14px] md:leading-[22px] lg:text-body-sm">Sơn mài truyền thống, thêu tay chỉ vàng &amp; vị bánh hoàng gia.</p>
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
          <Reveal className="reveal-split-right" delay={0.07} x="var(--reveal-x)" y="var(--reveal-y)">
            <h2 className="font-display-hero text-[32px] leading-[1.25] text-secondary-fixed font-normal mb-4 md:text-[38px] md:leading-[1.2] lg:text-[46px]">Món quà mang theo hương vị.</h2>
          </Reveal>
          <Reveal className="reveal-split-right" delay={0.14} x="var(--reveal-x)" y="var(--reveal-y)">
            <p className="font-body-lg text-[14px] leading-[1.65] text-secondary-fixed-dim/90 mb-8 md:text-[15px] md:leading-6 lg:text-body-lg lg:leading-relaxed">Minh Sâm chuẩn bị những thức quà bánh tinh tế cho những khoảnh khắc sum vầy gia đình cũng như các dịp tri ân đối tác trang trọng. Mỗi hộp quà là một lời chúc thanh tao gửi gắm tình người xứ kinh kỳ.</p>
          </Reveal>
          <StaggerReveal
            className="reveal-split-right grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            delay={0.19}
            itemClassNames={["min-h-0", "min-h-0"]}
            scale={0.99}
            stagger={0.07}
            x="var(--reveal-x)"
            y="var(--reveal-y)"
          >
            <div className="h-full p-5 bg-primary/70 backdrop-blur-sm rounded hover:bg-primary/90 transition-colors">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mb-3"><UsersRound aria-hidden="true" className="size-[18px]" /></div>
              <h3 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-1 md:text-[19px] md:leading-7 lg:text-headline-sm">Quà Tặng Cá Nhân</h3>
              <p className="font-body-sm text-[14px] leading-[1.6] text-secondary-fixed-dim/80 lg:text-body-sm lg:leading-relaxed">Dành cho gia đình, bạn hữu, lễ Tết, ngày kỷ niệm &amp; mùa trăng đoàn viên ấm áp.</p>
            </div>
            <div className="h-full p-5 bg-primary/70 backdrop-blur-sm rounded hover:bg-primary/90 transition-colors">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mb-3"><BriefcaseBusiness aria-hidden="true" className="size-[18px]" /></div>
              <h3 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-1 md:text-[19px] md:leading-7 lg:text-headline-sm">Quà Doanh Nghiệp</h3>
              <p className="font-body-sm text-[14px] leading-[1.6] text-secondary-fixed-dim/80 lg:text-body-sm lg:leading-relaxed">Hỗ trợ ép kim khắc logo bespoke, cá nhân hóa thiệp chúc và giao vận chuyên nghiệp.</p>
            </div>
          </StaggerReveal>
          <Reveal className="reveal-split-right" delay={0.3} x="var(--reveal-x)" y="var(--reveal-y)">
            <div className="flex flex-wrap items-center gap-4">
              <Link className="w-full px-5 py-3.5 bg-secondary-fixed text-center text-on-secondary-fixed font-label-ui font-medium text-[12px] leading-5 uppercase tracking-[0.06em] rounded hover:bg-secondary-fixed-dim transition-all shadow-md sm:w-auto sm:px-8 md:text-label-ui md:tracking-wider" href={routes.category("qua-tang")}>Khám phá bộ sưu tập quà tặng</Link>
              {/* <button className="px-8 py-3.5 bg-transparent text-secondary-fixed font-label-ui text-label-ui uppercase tracking-wider rounded hover:bg-primary/50 transition-all">Tư vấn quà doanh nghiệp</button> */}
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto flex items-center justify-between pt-6 text-secondary-fixed-dim/70" delay={0.36} y={14}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-secondary-fixed/30" />
          <span className="font-label-eyebrow font-semibold text-[10px] leading-4 uppercase tracking-[0.14em] md:text-label-eyebrow lg:tracking-[0.18em]">Nghệ Thuật Trao Tặng</span>
        </div>
      </Reveal>
    </section>
  );
}
