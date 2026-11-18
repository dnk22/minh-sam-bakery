import { CmsAppearanceControls } from "@/cms/features/settings/appearance-controls";
import { ContentSection } from "@/cms/features/settings/content-section";

export default function CmsDisplayPage() {
  return (
    <ContentSection description="Điều chỉnh kiểu sidebar, trạng thái thu gọn và hướng hiển thị của CMS." title="Hiển thị">
      <CmsAppearanceControls showTheme={false} />
      <p className="cms-settings-note">Các tùy chọn chỉ tác động tới CMS và không thay đổi giao diện Landing.</p>
    </ContentSection>
  );
}
