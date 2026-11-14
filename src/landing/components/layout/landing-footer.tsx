import { Clock, Mail, MapPin, Phone } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full bg-primary text-secondary-fixed-dim">
      <div className="max-w-[1360px] mx-auto px-gutter-desktop pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop mb-space-xl">
          <div className="lg:col-span-9 flex flex-col gap-space-md">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-secondary-fixed tracking-wide">
                MINH SÂM BAKERY
              </span>
              <span className="font-label-eyebrow text-label-eyebrow text-secondary-fixed-dim tracking-[0.2em] uppercase mt-space-xs">
                Giữ vị truyền thống, tạo nên điều mới
              </span>
            </div>
            <p className="font-body-md text-body-md text-secondary-fixed-dim/90 max-w-sm leading-relaxed">
              Gìn giữ hương vị thanh tao của bánh cốm, bánh chả và tinh hoa
              trăng tròn xứ kinh kỳ qua nhiều thế hệ thủ công gia truyền.
            </p>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-secondary-fixed">
              Địa chỉ
            </span>
            <div className="flex flex-col gap-space-md text-secondary-fixed-dim/80 font-body-sm text-body-sm">
              <p className="flex items-start gap-space-xs">
                <MapPin
                  aria-hidden="true"
                  className="size-[18px] text-secondary-fixed shrink-0 mt-0.5"
                />
                <a
                  className="hover:text-secondary-fixed transition-colors"
                  href="https://maps.app.goo.gl/DWWpedxCWnzRvb2x7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  61 Ngõ 62 Nguyễn Chí Thanh, Láng, Hà Nội
                </a>
              </p>
              <p className="flex items-center gap-space-xs">
                <Phone
                  aria-hidden="true"
                  className="size-[18px] text-secondary-fixed shrink-0"
                />
                <a
                  className="hover:text-secondary-fixed transition-colors"
                  href="tel:+840974231998"
                >
                  +84 (0) 974 231 998
                </a>
              </p>
              <p className="flex items-center gap-space-xs">
                <Mail
                  aria-hidden="true"
                  className="size-[18px] text-secondary-fixed shrink-0"
                />
                <a
                  className="hover:text-secondary-fixed transition-colors"
                  href="mailto:minhsambakery@gmail.com"
                >
                  minhsambakery@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-space-xs">
                <Clock
                  aria-hidden="true"
                  className="size-[18px] text-secondary-fixed shrink-0"
                />
                <span>07:30 – 21:30 hàng ngày</span>
              </p>
            </div>
          </div>
        </div>
        <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-secondary-fixed-dim/60">
          <p>© 2026 Minh Sâm Bakery. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-space-md">
            <span aria-disabled="true" data-path="chinh-sach-bao-mat">
              Chính sách bảo mật
            </span>
            <span aria-disabled="true" data-path="dieu-khoan-dich-vu">
              Điều khoản dịch vụ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
