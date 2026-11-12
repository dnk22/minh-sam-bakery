export type PromotionTarget =
  | { type: "category"; slug: string }
  | { type: "product"; productId: string }
  | { type: "catalog" };

export const merchandising = {
  seasonalFeaturedProductId: "heritage-reunion-gift-box",
  supportingProductIds: [
    "traditional-mixed-mooncake",
    "almond-young-rice-mooncake",
    "corporate-lacquer-gratitude-box",
  ],
  relatedFixedProductIds: [
    "lime-leaf-crispy-cake",
    "spring-matcha-butter-cookie",
    "charcoal-dried-mung-bean-cake",
    "salt-roasted-chestnut-cake",
  ],
  alternativeGiftProductIds: [
    "heritage-reunion-gift-box",
    "lotus-carved-wood-gift-box",
    "moc-an-library-gift-set",
  ],
  promotions: [
    { id: "tet-reunion", target: { type: "category", slug: "qua-tang" } },
    { id: "tea-combo", target: { type: "catalog" } },
    { id: "corporate-engraving", target: { type: "product", productId: "corporate-lacquer-gratitude-box" } },
  ] satisfies Array<{ id: string; target: PromotionTarget }>,
} as const;

export function getFeaturedProducts() {
  return [merchandising.seasonalFeaturedProductId, ...merchandising.supportingProductIds];
}
