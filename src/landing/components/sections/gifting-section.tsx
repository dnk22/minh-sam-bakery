/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { BriefcaseBusiness, UsersRound } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";
import { routes } from "@/landing/lib/routes";

export function GiftingSection() {
  return (
    <section className="w-full min-h-[96vh] lg:min-h-screen flex flex-col justify-between bg-primary-container text-on-primary px-6 md:px-12 lg:px-20 py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal className="reveal-split-left lg:col-span-6 relative order-2 lg:order-1" scale={1.015} x="var(--reveal-x)" y="var(--reveal-y)">
          <div className="relative rounded overflow-hidden shadow-2xl bg-primary">
            <img className="w-full h-[380px] lg:h-[480px] object-cover" data-alt="Exquisite Vietnamese Mid-Autumn wooden lacquer gift box lined with red silk, holding four gourmet mooncakes and loose leaf tea canisters." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7u8QZ6Uom86vQ1tTLd-m_UAwwSPHo670Z04ZDmhQG5twk3JOAPnWwHZMvcBymQ53ENQoU9SAL5uPCc-e1L20dFgg8vG2oMRfHvuf8XgV8QXCxN8Z42RTMt5ui_ghpoPKRiBedAZtPrGu6SgX8k2fK0Mz7ucSn2RDJtjTFKaoRvB2uLbACvcxrOAwQV-LYx2adyNTnDzk6puYjcqihF9YvNqHY2pIh1ggRcUE2NrRG4uOs4oyyUyr_" />
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-primary/95 to-transparent text-secondary-fixed">
              <span className="font-label-eyebrow text-label-eyebrow tracking-[0.2em] uppercase block">Ấn Phẩm Tri Ân</span>
              <p className="font-headline-sm text-headline-sm">Hộp Quà Di Sản Đoan Viên</p>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80">Sơn mài truyền thống, thêu tay chỉ vàng &amp; vị bánh hoàng gia.</p>
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
          <Reveal className="reveal-split-right" x="var(--reveal-x)" y="var(--reveal-y)">
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed tracking-[0.25em] block mb-3">Nghệ thuật trao tặng • 03</span>
          </Reveal>
          <Reveal className="reveal-split-right" delay={0.07} x="var(--reveal-x)" y="var(--reveal-y)">
            <h2 className="font-display-hero text-headline-lg lg:text-[46px] text-secondary-fixed font-normal leading-[1.2] mb-4">Món quà mang theo hương vị.</h2>
          </Reveal>
          <Reveal className="reveal-split-right" delay={0.14} x="var(--reveal-x)" y="var(--reveal-y)">
            <p className="font-body-lg text-body-lg text-secondary-fixed-dim/90 mb-8 leading-relaxed">Minh Sâm chuẩn bị những thức quà bánh tinh tế cho những khoảnh khắc sum vầy gia đình cũng như các dịp tri ân đối tác trang trọng. Mỗi hộp quà là một lời chúc thanh tao gửi gắm tình người xứ kinh kỳ.</p>
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
              <h3 className="font-headline-sm text-headline-sm text-secondary-fixed mb-1">Quà Tặng Cá Nhân</h3>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80 leading-relaxed">Dành cho gia đình, bạn hữu, lễ Tết, ngày kỷ niệm &amp; mùa trăng đoàn viên ấm áp.</p>
            </div>
            <div className="h-full p-5 bg-primary/70 backdrop-blur-sm rounded hover:bg-primary/90 transition-colors">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mb-3"><BriefcaseBusiness aria-hidden="true" className="size-[18px]" /></div>
              <h3 className="font-headline-sm text-headline-sm text-secondary-fixed mb-1">Quà Doanh Nghiệp</h3>
              <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80 leading-relaxed">Hỗ trợ ép kim khắc logo bespoke, cá nhân hóa thiệp chúc và giao vận chuyên nghiệp.</p>
            </div>
          </StaggerReveal>
          <Reveal className="reveal-split-right" delay={0.3} x="var(--reveal-x)" y="var(--reveal-y)">
            <div className="flex flex-wrap items-center gap-4">
              <Link className="px-8 py-3.5 bg-secondary-fixed text-on-secondary-fixed font-label-ui text-label-ui uppercase tracking-wider rounded hover:bg-secondary-fixed-dim transition-all shadow-md" href={routes.category("qua-tang")}>Khám phá bộ sưu tập quà tặng</Link>
              <button className="px-8 py-3.5 bg-transparent text-secondary-fixed font-label-ui text-label-ui uppercase tracking-wider rounded hover:bg-primary/50 transition-all">Tư vấn quà doanh nghiệp</button>
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto flex items-center justify-between pt-6 text-secondary-fixed-dim/70" delay={0.36} y={14}>
        <div className="flex items-center gap-3">
          <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.2em] uppercase">03 / 07</span>
          <span className="w-8 h-[1px] bg-secondary-fixed/30" />
          <span className="font-label-eyebrow text-label-eyebrow uppercase">Nghệ Thuật Trao Tặng</span>
        </div>
        <span className="font-label-ui text-label-ui uppercase tracking-wider">Hộp Sơn Mài • Hộp Giấy Mỹ Thuật Bespoke</span>
      </Reveal>
    </section>
  );
}
