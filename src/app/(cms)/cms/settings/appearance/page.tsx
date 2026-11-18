import { CmsAppearanceControls } from "@/cms/features/settings/appearance-controls";
import { ContentSection } from "@/cms/features/settings/content-section";

export default function CmsAppearancePage() {
  return <ContentSection description="Chọn chế độ sáng, tối hoặc theo thiết lập hệ điều hành. Thay đổi được lưu trên trình duyệt này." title="Giao diện"><CmsAppearanceControls showDirection={false} showLayout={false} /></ContentSection>;
}
