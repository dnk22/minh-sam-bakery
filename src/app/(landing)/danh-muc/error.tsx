"use client";

import { LandingDataUnavailable } from "@/landing/components/ui/landing-data-unavailable";

export default function CatalogRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <LandingDataUnavailable title="Chưa thể tải danh mục" description="Hệ thống sản phẩm đang tạm thời gián đoạn. Vui lòng thử lại sau ít phút." onRetry={reset} />;
}
