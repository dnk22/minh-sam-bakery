import type { Metadata } from "next";

import { AboutPage } from "@/landing/features/about/components/about-page";

export const metadata: Metadata = {
  title: "Về Minh Sâm | Câu chuyện thương hiệu Minh Sâm Bakery",
  description: "Khám phá câu chuyện thương hiệu, con người, tay nghề và những giá trị được Minh Sâm tiếp nối qua từng hương vị bánh Việt.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
