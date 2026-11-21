import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getPublicPosts } from "@/landing/features/journal/api";
import { JournalListingPage, JournalLoadingState } from "@/landing/features/journal/journal-listing-page";
import { buildJournalPageHref, parseJournalSearchParams } from "@/landing/features/journal/query";

export const metadata: Metadata = {
  title: "Chuyện Bánh & Hương Vị | Minh Sâm Bakery",
  description: "Những ghi chép về di sản ẩm thực Tràng An và nghệ thuật bánh thủ công Minh Sâm.",
};

type JournalRouteProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function JournalContent({ searchParams }: JournalRouteProps) {
  const query = parseJournalSearchParams(await searchParams);
  let data = null;
  let failed = false;
  try { data = await getPublicPosts(query); } catch { failed = true; }
  if (data && data.pagination.totalPages > 0 && query.page > data.pagination.totalPages) redirect(buildJournalPageHref(data.pagination.totalPages, query.search));
  return <JournalListingPage data={data} failed={failed} search={query.search} />;
}

export default function JournalRoute({ searchParams }: JournalRouteProps) {
  return <Suspense fallback={<JournalLoadingState />}><JournalContent searchParams={searchParams} /></Suspense>;
}
