import { Reveal } from "@/landing/components/motion/reveal";

export function CategorySectionHeading() {
  return (
    <div className="mb-4 flex flex-col justify-between gap-2 md:mb-8 md:flex-row md:items-end md:gap-4">
      <Reveal>
        <div>
          <span className="mb-1 block font-label-eyebrow text-[10px] leading-4 font-semibold tracking-[0.14em] text-secondary uppercase md:mb-2 md:text-label-eyebrow md:tracking-[0.22em] lg:tracking-[0.25em]">Danh mục tiêu biểu</span>
          <h2 className="font-headline-lg text-[24px] leading-[1.25] font-medium text-primary sm:text-[29px] md:text-[34px] md:leading-[1.3] lg:text-headline-lg">Khám phá các dòng bánh Minh Sâm</h2>
        </div>
      </Reveal>
      <Reveal className="max-w-md" delay={0.08}>
        <p className="font-body-md text-[13px] leading-[1.6] text-on-surface-variant sm:text-[14px] md:text-[15px] md:leading-6 lg:text-body-md">Từ những hương vị truyền thống đến những dòng bánh mới cho nhịp sống hôm nay, gói trọn tinh tế ẩm thực đất kinh kỳ.</p>
      </Reveal>
    </div>
  );
}
