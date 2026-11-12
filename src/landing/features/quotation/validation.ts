import {
  occasionOptions,
  quantityOptions,
  type QuotationErrors,
  type QuotationField,
  type QuotationRequestDraft,
} from "./types";

const validQuantities = new Set<string>(quantityOptions.map(({ value }) => value));
const validOccasions = new Set<string>(occasionOptions.map(({ value }) => value));

export function normalizeQuotationDraft(draft: QuotationRequestDraft): QuotationRequestDraft {
  return {
    ...draft,
    contactName: draft.contactName.trim().replace(/\s+/g, " "),
    phone: draft.phone.trim(),
    desiredDeliveryDate: draft.desiredDeliveryDate.trim(),
    notes: draft.notes.trim(),
  };
}

export function validateQuotationDraft(draft: QuotationRequestDraft) {
  const errors: QuotationErrors = {};
  if (!validQuantities.has(draft.quantityRange)) errors.quantityRange = "Vui lòng chọn số lượng dự kiến.";
  if (!validOccasions.has(draft.occasion)) errors.occasion = "Vui lòng chọn dịp tặng quà.";
  if (!draft.contactName) errors.contactName = "Vui lòng nhập họ tên người liên hệ.";
  if (!draft.phone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!isPlausibleVietnamesePhone(draft.phone)) {
    errors.phone = "Số điện thoại chưa đúng định dạng Việt Nam.";
  }
  if (draft.desiredDeliveryDate && !isValidDate(draft.desiredDeliveryDate)) {
    errors.desiredDeliveryDate = "Vui lòng nhập ngày hợp lệ theo định dạng DD/MM/YYYY.";
  }
  const firstInvalidField = Object.keys(errors)[0] as QuotationField | undefined;
  return { errors, firstInvalidField };
}

function isPlausibleVietnamesePhone(value: string) {
  const normalized = value.replace(/[\s().-]/g, "");
  return /^(?:\+84|0)\d{9,10}$/.test(normalized);
}

function isValidDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
