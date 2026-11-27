import type { CheckoutDraft, CheckoutErrors, CheckoutField } from "./types.ts";

import { normalizeVietnamMobilePhone } from "../../../lib/contracts/order/vietnam-mobile-phone.ts";
import { isValidReceiveDate, localCalendarDate } from "./utils/checkout-date.ts";
export { localCalendarDate } from "./utils/checkout-date.ts";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckoutPhone(value: string): string | undefined {
  if (!value.trim()) return "Vui lòng nhập số điện thoại.";
  if (!normalizeVietnamMobilePhone(value)) return "Vui lòng nhập số điện thoại di động Việt Nam hợp lệ.";
}

export function initialCheckoutDraft(today = localCalendarDate()): CheckoutDraft {
  return {
    fullName: "",
    phone: "",
    email: "",
    fulfillmentMethod: "pickup",
    deliveryAddress: "",
    receiveDate: today,
    deliveryTime: "",
    notes: "",
    paymentMethod: "AT_STORE",
  };
}

export function validateCheckoutDraft(
  draft: CheckoutDraft,
  today = localCalendarDate(),
): { errors: CheckoutErrors; firstInvalidField?: CheckoutField } {
  const errors: CheckoutErrors = {};
  if (!draft.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
  const phoneError = validateCheckoutPhone(draft.phone);
  if (phoneError) errors.phone = phoneError;
  if (draft.email.trim() && !emailPattern.test(draft.email.trim())) errors.email = "Email chưa đúng định dạng.";
  if (draft.fulfillmentMethod === "delivery" && !draft.deliveryAddress.trim()) {
    errors.deliveryAddress = "Vui lòng nhập địa chỉ giao hàng.";
  }
  if (!isValidReceiveDate(draft.receiveDate, today)) {
    errors.receiveDate = draft.fulfillmentMethod === "pickup"
      ? "Vui lòng chọn ngày nhận bánh hợp lệ."
      : "Vui lòng chọn ngày giao bánh hợp lệ.";
  }
  if (draft.deliveryTime.length > 100) errors.deliveryTime = "Khung giờ không được vượt quá 100 ký tự.";
  if (draft.fulfillmentMethod === "delivery" && draft.paymentMethod === "AT_STORE") {
    errors.paymentMethod = "Thanh toán tại cửa hàng chỉ áp dụng khi nhận tại cửa hàng.";
  }
  const order: CheckoutField[] = ["fullName", "phone", "email", "deliveryAddress", "receiveDate", "deliveryTime", "paymentMethod"];
  return { errors, firstInvalidField: order.find((field) => errors[field]) };
}

export function normalizeCheckoutDraft(draft: CheckoutDraft): CheckoutDraft {
  return {
    ...draft,
    fullName: draft.fullName.trim().replace(/\s+/g, " "),
    phone: normalizeVietnamMobilePhone(draft.phone) ?? draft.phone.trim(),
    email: draft.email.trim().toLowerCase(),
    deliveryAddress: draft.deliveryAddress.trim().replace(/\s+/g, " "),
    deliveryTime: draft.deliveryTime.trim(),
    notes: draft.notes.trim(),
  };
}
