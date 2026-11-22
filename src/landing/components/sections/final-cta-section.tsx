import { Reveal } from "@/landing/components/motion/reveal";
import Link from "next/link";
import { routes } from "@/landing/lib/routes";

export function FinalCtaSection() {
  return (
    <section className="w-full bg-surface-container py-20 px-6 md:px-12 lg:px-20 text-on-surface">
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        <Reveal duration={0.55} y={18}>
          <span className="font-label-eyebrow font-semibold text-[10px] leading-4 uppercase text-secondary tracking-[0.16em] block mb-3 md:text-label-eyebrow md:tracking-[0.24em] lg:tracking-[0.3em]">Trải Nghiệm Thưởng Vị</span>
        </Reveal>
        <Reveal delay={0.05} duration={0.55} y={18}>
          <h2 className="font-headline-lg font-medium text-[30px] leading-[1.25] text-primary mb-4 md:text-[34px] md:leading-[1.3] lg:text-headline-lg">Khám phá hương vị phù hợp với bạn.</h2>
        </Reveal>
        <Reveal delay={0.1} duration={0.55} y={18}>
          <p className="font-body-lg text-[14px] leading-[1.65] text-on-surface-variant max-w-xl mb-8 md:text-[15px] md:leading-6 lg:text-body-lg lg:leading-relaxed">Dù là tách trà chiều tĩnh lặng hay món quà gửi gắm lòng tri ân sâu sắc, Minh Sâm luôn chuẩn bị trọn vẹn sự tinh tế dành riêng cho bạn.</p>
        </Reveal>
        <Reveal delay={0.15} duration={0.55} y={18}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link className="w-full px-6 py-4 bg-primary text-on-primary font-label-ui font-medium text-[12px] leading-[18px] tracking-[0.06em] uppercase rounded hover:bg-primary-container transition-all sm:w-auto sm:px-8 md:text-label-ui md:tracking-wider" href={routes.categories}>Xem các dòng bánh</Link>
            <Link className="w-full px-6 py-4 bg-surface-container-high text-primary font-label-ui font-medium text-[12px] leading-[18px] tracking-[0.06em] uppercase rounded hover:bg-surface-container-highest transition-all sm:w-auto sm:px-8 md:text-label-ui md:tracking-wider" href={routes.category("qua-tang")}>Khám phá quà tặng</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
