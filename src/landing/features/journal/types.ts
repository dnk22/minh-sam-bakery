export type JournalArticle = {
  id: string;
  slug: string;
  listingTitle: string;
  listingExcerpt?: string;
  detailTitle?: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  imageAlt?: string;
  publishedAt: string;
  readingLabel: string;
  author?: string;
  fullArticle?: boolean;
  recommendedProductId?: string;
};

export type JournalTopic = {
  number: string;
  label: string;
  title: string;
  description: string;
  count: string;
  icon: "history" | "tea" | "celebration" | "gift" | "store";
  highlighted?: boolean;
};
