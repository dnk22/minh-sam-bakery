export type CartLine = {
  key: string;
  productId: string;
  categorySlug: string;
  productSlug: string;
  productName: string;
  productImage: string;
  productImageAlt: string;
  variantId: string | null;
  variantLabel: string;
  originalPrice: number;
  effectivePrice: number;
  quantity: number;
  selected: boolean;
};

export type CheckoutIntent = {
  source: "buy-now" | "cart";
  items: CartLine[];
};
