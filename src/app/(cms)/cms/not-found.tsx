import Link from "next/link";
import { CmsMain } from "@/cms/components/layout/cms-main";

export default function CmsNotFound() {
  return <CmsMain><section className="cms-placeholder"><div><h1>Không tìm thấy trang CMS</h1><p>Đường dẫn này chưa được tạo trong Phase 1.</p><Link className="cms-button cms-button--default cms-button--size-default" href="/cms">Về Dashboard</Link></div></section></CmsMain>;
}
