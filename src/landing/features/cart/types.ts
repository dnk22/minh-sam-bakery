export type CartVariantOption = {
  id: string | null;
  label: string;
  originalPrice: number;
  effectivePrice: number;
};

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
  availableVariants: CartVariantOption[];
  originalPrice: number;
  effectivePrice: number;
  quantity: number;
  selected: boolean;
};

export type CheckoutIntent = {
  source: "buy-now" | "cart";
  items: CartLine[];
};
