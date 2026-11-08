import type { Metadata } from "next";

import { JournalListingPage } from "@/landing/features/journal/journal-listing-page";

export const metadata: Metadata = {
  title: "Chuyện Bánh & Hương Vị | Minh Sâm Bakery",
  description: "Những ghi chép về di sản ẩm thực Tràng An và nghệ thuật bánh thủ công Minh Sâm.",
};

export default function JournalRoute() {
  return <JournalListingPage />;
}
