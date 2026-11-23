import { SEMANTIC_COLOR_TOKENS, type SemanticColorToken } from "./semantic-tokens.ts";

export type ContrastTextCategory = "normal" | "large" | "ui";

export type ContrastPair = {
  id: string;
  foreground: SemanticColorToken;
  background: SemanticColorToken;
  requiredRatio: number;
  context: string;
  textCategory: ContrastTextCategory;
  foregroundOpacity?: number;
};

export const CONTRAST_PAIRS = [
  { id: "core-primary-content", foreground: "on-primary", background: "primary", requiredRatio: 4.5, context: "Nội dung thường trên nền Primary.", textCategory: "normal" },
  { id: "core-secondary-content", foreground: "on-secondary", background: "secondary", requiredRatio: 4.5, context: "Nhãn và nút trên nền Secondary.", textCategory: "normal" },
  { id: "core-background-content", foreground: "on-background", background: "background", requiredRatio: 4.5, context: "Nội dung trang trên Background.", textCategory: "normal" },
  { id: "core-surface-content", foreground: "on-surface", background: "surface", requiredRatio: 4.5, context: "Nội dung chính trên Surface.", textCategory: "normal" },
  { id: "core-surface-variant-content", foreground: "on-surface-variant", background: "surface", requiredRatio: 4.5, context: "Mô tả sản phẩm, tìm kiếm, giỏ hàng và checkout trên Surface.", textCategory: "normal" },
  { id: "core-primary-container-content", foreground: "on-primary-container", background: "primary-container", requiredRatio: 4.5, context: "Nội dung thường trên Primary Container.", textCategory: "normal" },
  { id: "core-secondary-container-content", foreground: "on-secondary-container", background: "secondary-container", requiredRatio: 4.5, context: "Nội dung thường trên Secondary Container.", textCategory: "normal" },
  { id: "core-tertiary-content", foreground: "on-tertiary", background: "tertiary", requiredRatio: 4.5, context: "Nội dung thường trên Tertiary.", textCategory: "normal" },
  { id: "core-error-content", foreground: "on-error", background: "error", requiredRatio: 4.5, context: "Nội dung trạng thái lỗi.", textCategory: "normal" },
  { id: "landing-hero-title", foreground: "secondary-fixed", background: "primary", requiredRatio: 3, context: "Tiêu đề lớn Hero và Training Transfer trên nền Primary.", textCategory: "large" },
  { id: "landing-hero-body", foreground: "secondary-fixed-dim", background: "primary", foregroundOpacity: 0.9, requiredRatio: 4.5, context: "Đoạn mô tả Hero/Training dùng secondary-fixed-dim ở opacity 90%.", textCategory: "normal" },
  { id: "landing-dark-card-title", foreground: "secondary-fixed", background: "primary-container", requiredRatio: 3, context: "Tiêu đề lớn trên card Primary Container.", textCategory: "large" },
  { id: "landing-dark-card-body", foreground: "secondary-fixed-dim", background: "primary-container", foregroundOpacity: 0.8, requiredRatio: 4.5, context: "Nội dung card Training dùng secondary-fixed-dim ở opacity 80%.", textCategory: "normal" },
  { id: "landing-accent-button-label", foreground: "on-secondary-fixed", background: "secondary-fixed", requiredRatio: 4.5, context: "CTA Hero trên nền Secondary Fixed.", textCategory: "normal" },
  { id: "landing-primary-container-button", foreground: "on-primary", background: "primary-container", requiredRatio: 4.5, context: "CTA Product Detail trên nền Primary Container.", textCategory: "normal" },
  { id: "landing-surface-heading", foreground: "primary", background: "surface", requiredRatio: 3, context: "Heading lớn ở Product, Search, Journal, About, Cart và Checkout.", textCategory: "large" },
  { id: "landing-surface-label", foreground: "secondary", background: "surface", requiredRatio: 4.5, context: "Eyebrow và nhãn Secondary trên Surface.", textCategory: "normal" },
  { id: "landing-card-heading", foreground: "primary", background: "surface-container-lowest", requiredRatio: 3, context: "Heading Product Card và các form card.", textCategory: "large" },
  { id: "landing-card-body", foreground: "on-surface-variant", background: "surface-container-lowest", requiredRatio: 4.5, context: "Mô tả Product Card, Cart và Checkout card.", textCategory: "normal" },
  { id: "landing-inset-heading", foreground: "primary", background: "surface-container-low", requiredRatio: 3, context: "Heading/giá trên inset surface và selected controls.", textCategory: "large" },
  { id: "landing-selected-control", foreground: "on-surface", background: "surface-container-low", requiredRatio: 4.5, context: "Nhãn lựa chọn trong Product Detail và Checkout.", textCategory: "normal" },
  { id: "landing-dark-light-heading", foreground: "surface-bright", background: "primary", requiredRatio: 3, context: "Heading lớn About Closing và nội dung sáng trên section Primary.", textCategory: "large" },
  { id: "landing-dark-light-body", foreground: "surface-dim", background: "primary", requiredRatio: 4.5, context: "Body copy About Closing trên nền Primary.", textCategory: "normal" },
  { id: "landing-gold-button-label", foreground: "primary", background: "secondary-fixed", requiredRatio: 4.5, context: "Nhãn CTA Training trên Secondary Fixed.", textCategory: "normal" },
  { id: "landing-gold-dim-button-label", foreground: "primary", background: "secondary-fixed-dim", requiredRatio: 4.5, context: "Nhãn CTA Training khi hover trên Secondary Fixed Dim.", textCategory: "normal" },
  { id: "landing-dark-container-light", foreground: "surface-bright", background: "primary-container", requiredRatio: 4.5, context: "CTA phụ và nội dung sáng trên Primary Container.", textCategory: "normal" },
] as const satisfies readonly ContrastPair[];

export function validateContrastPairRegistry(pairs: readonly ContrastPair[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const signatures = new Set<string>();
  const tokens = new Set<string>(SEMANTIC_COLOR_TOKENS);

  for (const pair of pairs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pair.id)) errors.push(`ID contrast không hợp lệ: ${pair.id}`);
    if (ids.has(pair.id)) errors.push(`ID contrast bị trùng: ${pair.id}`);
    ids.add(pair.id);

    const opacity = pair.foregroundOpacity ?? 1;
    const signature = `${pair.foreground}/${pair.background}/${opacity}`;
    if (signatures.has(signature)) errors.push(`Cặp contrast bị trùng: ${signature}`);
    signatures.add(signature);

    if (!tokens.has(pair.foreground) || !tokens.has(pair.background)) errors.push(`Token contrast không hợp lệ: ${pair.id}`);
    if (!(opacity > 0 && opacity <= 1)) errors.push(`Opacity contrast không hợp lệ: ${pair.id}`);
    const expectedRatio = pair.textCategory === "normal" ? 4.5 : 3;
    if (pair.requiredRatio !== expectedRatio) errors.push(`Ngưỡng contrast không đúng category: ${pair.id}`);
    if (!pair.context.trim()) errors.push(`Context contrast đang trống: ${pair.id}`);
  }

  return errors;
}
