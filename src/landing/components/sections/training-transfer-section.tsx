import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";

export function TrainingTransferSection() {
  return (
    <section className="relative w-full flex flex-col justify-between overflow-hidden bg-primary px-6 py-16 text-on-primary md:px-12 lg:min-h-screen lg:px-20">
      <div className="w-full max-w-7xl mx-auto my-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <Reveal duration={0.62} y={20}>
            <div>
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed tracking-[0.25em] block mb-2">Dịch vụ chuyên môn • 07</span>
              <h2 className="font-headline-lg text-headline-lg text-secondary-fixed">Từ nghề bánh đến đào tạo &amp; chuyển giao.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.07} duration={0.62} y={20}>
            <p className="font-body-lg text-body-lg text-secondary-fixed-dim/90 max-w-md">Đồng hành cùng các đơn vị F&amp;B và người yêu bánh truyền thống qua các giải pháp chuẩn hóa chuyên nghiệp.</p>
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
          <div className="h-full p-8 bg-primary-container rounded flex flex-col justify-between hover:bg-primary-container/80 transition-colors">
            <div>
              <span className="font-headline-md text-headline-md text-secondary-fixed block mb-3">01</span>
              <h3 className="font-headline-sm text-headline-sm text-secondary-fixed mb-2">Đào tạo tay nghề thợ bánh</h3>
              <p className="font-body-md text-body-md text-secondary-fixed-dim/80 leading-relaxed">Chuyển giao bí quyết nhào bột, sên nhân sen nhuyễn mịn, căn chỉnh nhiệt độ nướng cho các dòng bánh cổ truyền và đương đại.</p>
            </div>
            <div className="pt-6"><span className="font-label-ui text-label-ui text-secondary-fixed uppercase tracking-wider">Khóa học chuyên sâu →</span></div>
          </div>
          <div className="h-full p-8 bg-primary-container rounded flex flex-col justify-between hover:bg-primary-container/80 transition-colors">
            <div>
              <span className="font-headline-md text-headline-md text-secondary-fixed block mb-3">02</span>
              <h3 className="font-headline-sm text-headline-sm text-secondary-fixed mb-2">Tư vấn công thức &amp; thực đơn</h3>
              <p className="font-body-md text-body-md text-secondary-fixed-dim/80 leading-relaxed">Nghiên cứu R&amp;D phát triển menu độc quyền cho chuỗi cà phê, nhà hàng và thương hiệu tiệm bánh cao cấp theo mùa lễ hội.</p>
            </div>
            <div className="pt-6"><span className="font-label-ui text-label-ui text-secondary-fixed uppercase tracking-wider">Dịch vụ R&amp;D Menu →</span></div>
          </div>
          <div className="h-full p-8 bg-primary-container rounded flex flex-col justify-between hover:bg-primary-container/80 transition-colors">
            <div>
              <span className="font-headline-md text-headline-md text-secondary-fixed block mb-3">03</span>
              <h3 className="font-headline-sm text-headline-sm text-secondary-fixed mb-2">Chuyển giao công nghệ xưởng</h3>
              <p className="font-body-md text-body-md text-secondary-fixed-dim/80 leading-relaxed">Tư vấn thiết lập dây chuyền sản xuất bán tự động, quy trình kiểm soát vi sinh, định lượng nguyên liệu và bảo quản không dùng hóa chất.</p>
            </div>
            <div className="pt-6"><span className="font-label-ui text-label-ui text-secondary-fixed uppercase tracking-wider">Quy chuẩn xưởng →</span></div>
          </div>
        </StaggerReveal>
        <Reveal delay={0.1} duration={0.6} y={18}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-primary-container/60 rounded">
            <div>
              <h4 className="font-headline-sm text-headline-sm text-secondary-fixed mb-1">Cần tư vấn giải pháp nghề bánh cho doanh nghiệp của bạn?</h4>
              <p className="font-body-md text-body-md text-secondary-fixed-dim/80">Đội ngũ nghệ nhân và chuyên gia kỹ thuật Minh Sâm luôn sẵn sàng hỗ trợ trực tiếp.</p>
            </div>
            <button className="px-8 py-3.5 bg-secondary-fixed text-primary font-label-ui text-label-ui uppercase tracking-wider rounded hover:bg-secondary-fixed-dim transition-all shrink-0">Liên hệ tư vấn chuyên môn</button>
          </div>
        </Reveal>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto" delay={0.1} duration={0.58} y={16}>
        <div className="flex items-center justify-between pt-6 text-secondary-fixed-dim/70">
          <div className="flex items-center gap-3">
            <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed tracking-[0.2em] uppercase">07 / 07</span>
            <span className="w-8 h-[1px] bg-secondary-fixed/30" />
            <span className="font-label-eyebrow text-label-eyebrow uppercase">Đào Tạo &amp; Chuyển Giao</span>
          </div>
          <span className="font-label-ui text-label-ui uppercase tracking-wider">Hà Nội • TP. Hồ Chí Minh</span>
        </div>
      </Reveal>
    </section>
  );
}
