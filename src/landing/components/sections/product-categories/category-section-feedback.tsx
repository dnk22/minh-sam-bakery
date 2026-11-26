import Link from "next/link";

import { Reveal } from "@/landing/components/motion/reveal";
import { routes } from "@/landing/lib/routes";

export function CategorySectionFeedback({ loadFailed }: { loadFailed: boolean }) {
  return (
    <Reveal y={12}>
      <div className="rounded bg-surface-container px-4 py-6 text-center shadow-sm md:px-6 md:py-10">
        <p className="font-headline-sm text-[18px] text-primary md:text-headline-sm">{loadFailed ? "Chưa thể tải danh mục sản phẩm" : "Danh mục sản phẩm đang được cập nhật"}</p>
        <p className="mt-2 font-body-md text-[13px] text-on-surface-variant md:text-body-md">{loadFailed ? "Kết nối đến hệ thống sản phẩm đang tạm thời gián đoạn." : "Vui lòng quay lại sau để khám phá các dòng bánh Minh Sâm."}</p>
        {loadFailed ? <Link className="mt-4 inline-flex rounded bg-primary px-5 py-2.5 font-label-ui text-label-ui text-on-primary transition-colors hover:bg-primary-container" href={routes.home}>Thử lại</Link> : null}
      </div>
    </Reveal>
  );
}
