"use client";

import { LandingDataUnavailable } from "@/landing/components/ui/landing-data-unavailable";

export default function JournalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <LandingDataUnavailable title="Chưa thể mở bài viết" description="Dịch vụ nội dung đang tạm thời gián đoạn. Vui lòng thử lại sau." onRetry={reset} />;
}
