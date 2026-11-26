"use client";

import { useRouter } from "next/navigation";

export function LandingDataUnavailable({ title, description = "Hệ thống đang tạm thời gián đoạn. Vui lòng thử lại sau.", onRetry }: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  const router = useRouter();

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-surface px-gutter pt-[var(--landing-header-height)]">
      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-md">
        <h1 className="font-headline-md text-headline-md text-primary">{title}</h1>
        <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">{description}</p>
        <button className="mt-space-md min-h-11 rounded-lg bg-primary px-space-lg py-space-sm font-label-ui text-on-primary" onClick={onRetry ?? (() => router.refresh())} type="button">
          Thử lại
        </button>
      </div>
    </main>
  );
}
