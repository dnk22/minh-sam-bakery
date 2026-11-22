import { CmsAppearanceControls } from "@/cms/features/settings/appearance-controls";
import { ContentSection } from "@/cms/features/settings/content-section";

export default function CmsDisplayPage() {
  return (
    <ContentSection
      description="Tùy chỉnh chế độ sáng/tối, kiểu sidebar, bố cục và hướng hiển thị của khu vực CMS."
      title="Giao diện & hiển thị"
    >
      <CmsAppearanceControls />
      <p className="cms-settings-note">Thay đổi được lưu trên trình duyệt này và chỉ áp dụng cho CMS, không ảnh hưởng giao diện Landing.</p>
    </ContentSection>
  );
}
