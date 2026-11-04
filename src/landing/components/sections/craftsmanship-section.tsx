import { Flame, Hammer, Leaf } from "lucide-react";

export function CraftsmanshipSection() {
  return (
    <section className="w-full min-h-[96vh] lg:min-h-screen flex flex-col justify-between bg-surface-container-low text-on-surface px-6 md:px-12 lg:px-20 py-16">
      <div className="w-full max-w-7xl mx-auto my-auto">
        <div className="max-w-2xl mb-12">
          <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary tracking-[0.25em] block mb-2">Quy chuẩn nghề bánh • 06</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-3">Không chỉ làm bánh. Minh Sâm hiểu nghề bánh.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Bánh ngon không đến từ sự vội vàng. Đằng sau mỗi chiếc bánh là sự chiêm nghiệm về nguyên liệu, cảm giác của đôi bàn tay và sự nhạy bén trước nhiệt độ lò nướng.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-surface-container-lowest rounded shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
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
          <div className="p-8 bg-surface-container-lowest rounded shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="font-display-hero text-headline-md text-secondary block mb-4">02</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">Đôi tay &amp; khuôn gỗ khắc hoa</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">Đôi bàn tay người thợ cảm nhận chính xác độ dẻo của từng mẻ bột. Khuôn gỗ xà cừ cổ truyền tạo nên nét hoa văn sắc sảo, dứt khoát mà chỉ kỹ nghệ thủ công mới đạt tới.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-secondary font-label-ui text-label-ui uppercase tracking-wider">
              <Hammer aria-hidden="true" className="size-4" />
              <span>Thủ công chạm khắc gỗ</span>
            </div>
          </div>
          <div className="p-8 bg-surface-container-lowest rounded shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
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
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-6 text-on-surface-variant">
        <div className="flex items-center gap-3">
          <span className="font-label-eyebrow text-label-eyebrow text-secondary uppercase tracking-[0.2em]">06 / 07</span>
          <span className="w-8 h-[1px] bg-outline-variant" />
          <span className="font-label-eyebrow text-label-eyebrow uppercase">Quy Chuẩn Nghề Bánh</span>
        </div>
        <span className="font-body-sm text-body-sm">Được chứng nhận quy trình vệ sinh an toàn thực phẩm chuẩn quốc gia</span>
      </div>
    </section>
  );
}
