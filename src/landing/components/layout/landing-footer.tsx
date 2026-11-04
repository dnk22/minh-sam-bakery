import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full bg-primary text-secondary-fixed-dim">
      <div className="max-w-[1360px] mx-auto px-gutter-desktop pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop mb-space-xl">
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-secondary-fixed tracking-wide">MINH SÂM BAKERY</span>
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed-dim tracking-[0.2em] uppercase mt-space-xs">Giữ vị truyền thống, tạo nên điều mới</span>
            </div>
            <p className="font-body-md text-body-md text-secondary-fixed-dim/90 max-w-sm leading-relaxed">Gìn giữ hương vị thanh tao của bánh cốm, bánh chả và tinh hoa trăng tròn xứ kinh kỳ qua nhiều thế hệ thủ công gia truyền.</p>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-secondary-fixed">Khám Phá</span>
            <nav className="flex flex-col gap-space-xs">
              <a className="font-body-sm text-body-sm text-secondary-fixed-dim/80 hover:text-secondary-fixed transition-colors py-0.5" data-path="trang-chu" href="#">Trang chủ</a>
              <a className="font-body-sm text-body-sm text-secondary-fixed-dim/80 hover:text-secondary-fixed transition-colors py-0.5" data-path="san-pham" href="#">Sản phẩm truyền thống</a>
              <a className="font-body-sm text-body-sm text-secondary-fixed-dim/80 hover:text-secondary-fixed transition-colors py-0.5" data-path="qua-tang" href="#">Hộp quà tri ân</a>
              <a className="font-body-sm text-body-sm text-secondary-fixed-dim/80 hover:text-secondary-fixed transition-colors py-0.5" data-path="ve-minh-sam" href="#">Câu chuyện thương hiệu</a>
              <a className="font-body-sm text-body-sm text-secondary-fixed-dim/80 hover:text-secondary-fixed transition-colors py-0.5" data-path="dao-tao-chuyen-giao" href="#">Lớp học làm bánh</a>
            </nav>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-secondary-fixed">Địa chỉ</span>
            <div className="flex flex-col gap-space-md text-secondary-fixed-dim/80 font-body-sm text-body-sm">
              <p className="flex items-start gap-space-xs"><MapPin aria-hidden="true" className="size-[18px] text-secondary-fixed shrink-0 mt-0.5" /><a className="hover:text-secondary-fixed transition-colors" href="https://maps.app.goo.gl/DWWpedxCWnzRvb2x7" target="_blank" rel="noopener noreferrer">61 Ngõ 62 Nguyễn Chí Thanh, Láng, Hà Nội</a></p>
              <p className="flex items-center gap-space-xs"><Phone aria-hidden="true" className="size-[18px] text-secondary-fixed shrink-0" /><a className="hover:text-secondary-fixed transition-colors" href="tel:+840974231998">+84 (0) 974 231 998</a></p>
              <p className="flex items-center gap-space-xs"><Mail aria-hidden="true" className="size-[18px] text-secondary-fixed shrink-0" /><a className="hover:text-secondary-fixed transition-colors" href="mailto:minhsambakery@gmail.com">minhsambakery@gmail.com</a></p>
              <p className="flex items-center gap-space-xs"><Clock aria-hidden="true" className="size-[18px] text-secondary-fixed shrink-0" /><span>07:30 – 21:30 hàng ngày</span></p>
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-secondary-fixed">Bản Tin Hương Vị</span>
            <p className="font-body-sm text-body-sm text-secondary-fixed-dim/80">Nhận thông báo về các bộ sưu tập bánh Trung thu giới hạn và quà tặng mùa lễ hội.</p>
            <form className="flex items-center mt-space-xs bg-primary-container p-1 rounded">
              <input className="w-full bg-transparent px-space-sm py-1.5 font-body-sm text-body-sm text-secondary-fixed placeholder:text-secondary-fixed-dim/50 focus:outline-none" placeholder="Địa chỉ email của bạn" type="email" />
              <button aria-label="Đăng ký nhận tin" className="px-space-md py-1.5 bg-secondary-fixed text-primary rounded font-label-ui text-label-ui hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center" type="button"><ArrowRight aria-hidden="true" className="size-[18px]" /></button>
            </form>
          </div>
        </div>
        <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-secondary-fixed-dim/60">
          <p>© 2025 Minh Sâm Bakery. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-space-md">
            <a className="hover:text-secondary-fixed transition-colors" data-path="chinh-sach-bao-mat" href="#">Chính sách bảo mật</a>
            <a className="hover:text-secondary-fixed transition-colors" data-path="dieu-khoan-dich-vu" href="#">Điều khoản dịch vụ</a>
            <a className="hover:text-secondary-fixed transition-colors" data-path="lien-he" href="#">Chăm sóc khách hàng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
