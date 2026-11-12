export const quantityOptions = [
  { value: "10-30", label: "10 – 30 hộp" },
  { value: "31-100", label: "31 – 100 hộp" },
  { value: "over-100", label: "Trên 100 hộp" },
  { value: "undetermined", label: "Chưa xác định" },
] as const;

export const occasionOptions = [
  { value: "tet", label: "Quà Tết" },
  { value: "partner", label: "Quà tặng đối tác" },
  { value: "gratitude", label: "Quà tri ân" },
  { value: "other", label: "Dịp khác" },
] as const;

export type QuantityRange = (typeof quantityOptions)[number]["value"];
export type GiftingOccasion = (typeof occasionOptions)[number]["value"];
export type QuotationFlowState = "closed" | "editing" | "submitting" | "success" | "error";

export type QuotationProductContext = {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  image: string;
  imageAlt: string;
  quotationProfile: "corporate-gift" | "custom-event";
};

export const customEventQuantityOptions = [
  { value: "10-30", label: "1 bánh / hạng mục chính" },
  { value: "31-100", label: "Tiệc quy mô nhỏ" },
  { value: "over-100", label: "Sự kiện quy mô lớn" },
  { value: "undetermined", label: "Chưa xác định" },
] as const;

export const customEventOccasionOptions = [
  { value: "tet", label: "Sinh nhật" },
  { value: "partner", label: "Tiệc trà" },
  { value: "gratitude", label: "Sự kiện đặc biệt" },
  { value: "other", label: "Dịp khác" },
] as const;

export type QuotationRequestDraft = {
  productId: string;
  productSlug: string;
  quantityRange: QuantityRange;
  occasion: GiftingOccasion;
  contactName: string;
  phone: string;
  desiredDeliveryDate: string;
  notes: string;
};

export type QuotationReceipt = {
  referenceId: string;
  submittedAt: string;
  request: QuotationRequestDraft;
};

export type QuotationSubmissionResult =
  | { ok: true; receipt: QuotationReceipt }
  | { ok: false; message: string };

export type QuotationField = keyof Pick<QuotationRequestDraft, "quantityRange" | "occasion" | "contactName" | "phone" | "desiredDeliveryDate" | "notes">;
export type QuotationErrors = Partial<Record<QuotationField, string>>;

export function quantityLabel(value: QuantityRange) {
  return quantityOptions.find((option) => option.value === value)?.label ?? value;
}

export function occasionLabel(value: GiftingOccasion) {
  return occasionOptions.find((option) => option.value === value)?.label ?? value;
}
