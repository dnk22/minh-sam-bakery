"use client";

import { LandingDataUnavailable } from "@/landing/components/ui/landing-data-unavailable";

export default function SearchRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <LandingDataUnavailable title="Chưa thể mở trang tìm kiếm" description="Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau." onRetry={reset} />;
}
