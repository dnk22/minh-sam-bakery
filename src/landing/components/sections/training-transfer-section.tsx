import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";

export function TrainingTransferSection() {
  return (
    <section className="relative w-full flex flex-col justify-between overflow-hidden bg-primary px-6 py-16 text-on-primary md:px-12 lg:min-h-[calc(100vh-var(--landing-header-height))] lg:px-20">
      <div className="w-full max-w-7xl mx-auto my-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <Reveal duration={0.62} y={20}>
            <div>
              <h2 className="font-headline-lg font-medium text-[29px] leading-[1.25] text-secondary-fixed md:text-[34px] md:leading-[1.3] lg:text-headline-lg">Từ nghề bánh đến đào tạo &amp; chuyển giao.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.07} duration={0.62} y={20}>
            <p className="font-body-lg text-[14px] leading-[1.65] text-secondary-fixed-dim/90 max-w-md md:text-[15px] md:leading-6 lg:text-body-lg">Đồng hành cùng các đơn vị F&amp;B và người yêu bánh truyền thống qua các giải pháp chuẩn hóa chuyên nghiệp.</p>
          </Reveal>
        </div>
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          delay={0.06}
          itemClassNames={["h-full", "h-full", "h-full"]}
          scale={0.992}
          stagger={0.07}
          y={22}
        >
          <div className="h-full p-6 bg-primary-container rounded flex flex-col justify-between hover:bg-primary-container/80 transition-colors lg:p-8">
            <div>
              <span className="font-headline-md text-headline-md text-secondary-fixed block mb-3">01</span>
              <h3 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-2 md:text-[19px] md:leading-7 lg:text-headline-sm">Đào tạo tay nghề thợ bánh</h3>
              <p className="font-body-md text-[14px] leading-[1.65] text-secondary-fixed-dim/80 lg:text-body-md lg:leading-relaxed">Chuyển giao bí quyết nhào bột, sên nhân sen nhuyễn mịn, căn chỉnh nhiệt độ nướng cho các dòng bánh cổ truyền và đương đại.</p>
            </div>
          </div>
          <div className="h-full p-6 bg-primary-container rounded flex flex-col justify-between hover:bg-primary-container/80 transition-colors lg:p-8">
            <div>
              <span className="font-headline-md text-headline-md text-secondary-fixed block mb-3">02</span>
              <h3 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-2 md:text-[19px] md:leading-7 lg:text-headline-sm">Tư vấn công thức &amp; thực đơn</h3>
              <p className="font-body-md text-[14px] leading-[1.65] text-secondary-fixed-dim/80 lg:text-body-md lg:leading-relaxed">Nghiên cứu R&amp;D phát triển menu độc quyền cho chuỗi cà phê, nhà hàng và thương hiệu tiệm bánh cao cấp theo mùa lễ hội.</p>
            </div>
          </div>
          <div className="h-full p-6 bg-primary-container rounded flex flex-col justify-between hover:bg-primary-container/80 transition-colors lg:p-8">
            <div>
              <span className="font-headline-md text-headline-md text-secondary-fixed block mb-3">03</span>
              <h3 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-2 md:text-[19px] md:leading-7 lg:text-headline-sm">Chuyển giao công nghệ xưởng</h3>
              <p className="font-body-md text-[14px] leading-[1.65] text-secondary-fixed-dim/80 lg:text-body-md lg:leading-relaxed">Tư vấn thiết lập dây chuyền sản xuất bán tự động, quy trình kiểm soát vi sinh, định lượng nguyên liệu và bảo quản không dùng hóa chất.</p>
            </div>
          </div>
        </StaggerReveal>
        <Reveal delay={0.1} duration={0.6} y={18}>
          <div className="flex flex-col items-stretch justify-between gap-6 p-6 bg-primary-container/60 rounded sm:flex-row sm:items-center lg:p-8">
            <div className="min-w-0">
              <h4 className="font-headline-sm font-semibold text-[18px] leading-[1.35] text-secondary-fixed mb-1 md:text-[19px] md:leading-7 lg:text-headline-sm">Cần tư vấn giải pháp nghề bánh cho doanh nghiệp của bạn?</h4>
              <p className="font-body-md text-[14px] leading-[1.65] text-secondary-fixed-dim/80 lg:text-body-md">Đội ngũ nghệ nhân và chuyên gia kỹ thuật Minh Sâm luôn sẵn sàng hỗ trợ trực tiếp.</p>
            </div>
            <button className="w-full px-5 py-3.5 bg-secondary-fixed text-primary font-label-ui font-medium text-[12px] leading-5 uppercase tracking-[0.06em] rounded hover:bg-secondary-fixed-dim transition-all sm:w-auto sm:px-8 sm:shrink-0 md:text-label-ui md:tracking-wider">Liên hệ tư vấn chuyên môn</button>
          </div>
        </Reveal>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto" delay={0.1} duration={0.58} y={16}>
        <div className="flex flex-col items-start gap-3 pt-6 text-secondary-fixed-dim/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-secondary-fixed/30" />
            <span className="font-label-eyebrow font-semibold text-[10px] leading-4 uppercase tracking-[0.14em] md:text-label-eyebrow lg:tracking-[0.18em]">Đào Tạo &amp; Chuyển Giao</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
