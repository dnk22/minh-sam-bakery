import { Flame, Hammer, Leaf } from "lucide-react";

import { Reveal } from "@/landing/components/motion/reveal";
import { StaggerReveal } from "@/landing/components/motion/stagger-reveal";

export function CraftsmanshipSection() {
  return (
    <section className="w-full flex flex-col justify-between bg-surface-container-low px-6 py-16 text-on-surface md:px-12 lg:min-h-screen lg:px-20">
      <div className="w-full max-w-7xl mx-auto my-auto">
        <div className="max-w-2xl mb-12">
          <Reveal duration={0.65} y={22}>
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-[0.25em] block mb-2">Quy chuẩn nghề bánh</span>
          </Reveal>
          <Reveal delay={0.06} duration={0.65} y={22}>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-3">Không chỉ làm bánh. Minh Sâm hiểu nghề bánh.</h2>
          </Reveal>
          <Reveal delay={0.12} duration={0.65} y={22}>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Bánh ngon không đến từ sự vội vàng. Đằng sau mỗi chiếc bánh là sự chiêm nghiệm về nguyên liệu, cảm giác của đôi bàn tay và sự nhạy bén trước nhiệt độ lò nướng.</p>
          </Reveal>
        </div>
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          delay={0.08}
          itemClassNames={["h-full", "h-full", "h-full"]}
          scale={0.99}
          stagger={0.08}
          y={24}
        >
          <div className="h-full p-8 bg-surface-container-lowest rounded shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="font-display-hero text-headline-md text-secondary block mb-4">01</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Nguyên liệu tuyển trạch</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">Hạt sen Tây Hồ bùi ngọt, nếp cái hoa vàng chuẩn vụ mùa, bơ Pháp thượng hạng và thảo mộc tự nhiên. Tuyệt đối không chất bảo quản công nghiệp và hương liệu tổng hợp.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-secondary font-label-ui text-label-ui uppercase tracking-wider">
              <Leaf aria-hidden="true" className="size-4" />
              <span>Thuần khiết &amp; Minh bạch</span>
            </div>
          </div>
          <div className="h-full p-8 bg-surface-container-lowest rounded shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="font-display-hero text-headline-md text-secondary block mb-4">02</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Đôi tay &amp; khuôn gỗ khắc hoa</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">Đôi bàn tay người thợ cảm nhận chính xác độ dẻo của từng mẻ bột. Khuôn gỗ xà cừ cổ truyền tạo nên nét hoa văn sắc sảo, dứt khoát mà chỉ kỹ nghệ thủ công mới đạt tới.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-secondary font-label-ui text-label-ui uppercase tracking-wider">
              <Hammer aria-hidden="true" className="size-4" />
              <span>Thủ công chạm khắc</span>
            </div>
          </div>
          <div className="h-full p-8 bg-surface-container-lowest rounded shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="font-display-hero text-headline-md text-secondary block mb-4">03</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Kỹ thuật canh lửa &amp; độ ẩm</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">Kiểm soát nhiệt độ lò hai tầng nướng và độ ẩm tiêu chuẩn giúp vỏ bánh vàng ươm mỏng mịn, nhân dẻo không bị khô, lưu giữ trọn vẹn hương thơm thảo mộc tự nhiên.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-secondary font-label-ui text-label-ui uppercase tracking-wider">
              <Flame aria-hidden="true" className="size-4" />
              <span>Canh lửa chuẩn xác</span>
            </div>
          </div>
        </StaggerReveal>
      </div>
      <Reveal className="w-full max-w-7xl mx-auto" delay={0.12} duration={0.6} y={18}>
        <div className="flex items-center justify-between pt-6 text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-outline-variant" />
            <span className="font-label-eyebrow text-label-eyebrow uppercase">Quy Chuẩn Nghề Bánh</span>
          </div>
          <span className="font-body-sm text-body-sm">Được chứng nhận quy trình vệ sinh an toàn thực phẩm chuẩn quốc gia</span>
        </div>
      </Reveal>
    </section>
  );
}
