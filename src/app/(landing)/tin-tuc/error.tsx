"use client";

export default function JournalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-[70vh] items-center bg-surface pt-[var(--landing-header-height)]"><div className="mx-auto max-w-xl px-margin py-20 text-center"><h1 className="font-headline-lg text-headline-lg text-primary">Chưa thể mở bài viết</h1><p className="mt-4 text-on-surface-variant">Dịch vụ nội dung đang tạm thời gián đoạn. Vui lòng thử lại sau.</p><button className="mt-7 rounded-lg bg-primary px-6 py-3 text-on-primary" onClick={reset} type="button">Thử lại</button></div></main>;
}
